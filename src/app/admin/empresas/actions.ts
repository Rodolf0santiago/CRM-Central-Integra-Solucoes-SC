'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

// Função auxiliar para validar se o usuário atual é super_admin no nível da aplicação
async function checkSuperAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Usuário não autenticado no sistema.')

  const { data: profile, error } = await supabase
    .from('usuarios')
    .select('role')
    .eq('id', user.id)
    .maybeSingle()

  if (error || profile?.role !== 'super_admin') {
    throw new Error('Acesso negado. Apenas Super Admins podem executar esta ação.')
  }

  return { supabase, user }
}

export interface CreateCompanyState {
  success: boolean
  empresa: any
  error: string | null
}

// Criação de uma nova empresa
export async function createCompany(prevState: CreateCompanyState, formData: FormData): Promise<CreateCompanyState> {
  try {
    const { supabase } = await checkSuperAdmin()

    const nome = formData.get('nome') as string
    const plano = formData.get('plano') as string
    const valor_mensalidade_raw = formData.get('valor_mensalidade')
    const status_pagamento = formData.get('status_pagamento') as string

    if (!nome || !plano || !valor_mensalidade_raw) {
      return { success: false, empresa: null, error: 'Os campos nome, plano e valor da mensalidade são obrigatórios.' }
    }

    const valor_mensalidade = Number(valor_mensalidade_raw)
    if (isNaN(valor_mensalidade) || valor_mensalidade < 0) {
      return { success: false, empresa: null, error: 'O valor da mensalidade deve ser um número válido.' }
    }

    // Grava no banco. O RLS permite pois a role na tabela usuarios é super_admin.
    const { data, error } = await supabase
      .from('empresas')
      .insert({
        nome,
        plano,
        valor_mensalidade,
        status_pagamento: status_pagamento || 'ativo'
      })
      .select()
      .single()

    if (error) {
      console.error('Erro Supabase ao criar empresa:', error)
      return { success: false, empresa: null, error: `Erro de banco de dados: ${error.message}` }
    }

    // Revalidar rotas administrativas para atualizar as tabelas e dados na interface
    revalidatePath('/admin/empresas')
    revalidatePath('/admin')
    
    return { 
      success: true, 
      empresa: data, 
      error: null 
    }
  } catch (err: any) {
    return { success: false, empresa: null, error: err?.message || 'Erro inesperado no servidor.' }
  }
}

// Listagem de todas as empresas do banco
export async function getCompanies() {
  try {
    const { supabase } = await checkSuperAdmin()

    const { data, error } = await supabase
      .from('empresas')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erro Supabase ao listar empresas:', error)
      throw new Error(`Erro ao obter empresas: ${error.message}`)
    }

    return data || []
  } catch (err: any) {
    console.error('Erro na Action getCompanies:', err)
    throw err
  }
}

// Consolidação de métricas globais da plataforma para a dashboard da Torre de Controle
export async function getPlatformMetrics() {
  try {
    const { supabase } = await checkSuperAdmin()

    // 1. Total de empresas ativas
    const { count: activeCompaniesCount, error: err1 } = await supabase
      .from('empresas')
      .select('*', { count: 'exact', head: true })
      .eq('status_pagamento', 'ativo')

    // 2. Faturamento mensal total (soma das mensalidades das empresas ativas)
    const { data: companies, error: err2 } = await supabase
      .from('empresas')
      .select('valor_mensalidade')
      .eq('status_pagamento', 'ativo')

    const totalBilling = companies?.reduce((acc, c) => acc + (Number(c.valor_mensalidade) || 0), 0) || 0

    // 3. Total de leads captados na plataforma inteira
    const { count: totalLeadsCount, error: err3 } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })

    if (err1 || err2 || err3) {
      console.error('Erro parcial ao buscar métricas da plataforma:', { err1, err2, err3 })
    }

    return {
      activeCompanies: activeCompaniesCount || 0,
      totalBilling: totalBilling,
      totalLeads: totalLeadsCount || 0
    }
  } catch (err: any) {
    console.error('Erro na Action getPlatformMetrics:', err)
    return {
      activeCompanies: 0,
      totalBilling: 0,
      totalLeads: 0
    }
  }
}

// Excluir empresa (limpa em cascata usuários/leads/agendamentos)
export async function deleteCompany(id: string) {
  try {
    const { supabase } = await checkSuperAdmin()

    const { error } = await supabase
      .from('empresas')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Erro Supabase ao deletar empresa:', error)
      throw new Error(`Erro de banco: ${error.message}`)
    }

    revalidatePath('/admin/empresas')
    revalidatePath('/admin')
    return { success: true }
  } catch (err: any) {
    console.error('Erro ao deletar empresa:', err)
    return { success: false, error: err?.message || 'Erro ao excluir' }
  }
}

// Alternar status de bloqueio (ativo true/false)
export async function toggleCompanyAccess(id: string, currentStatus: boolean) {
  try {
    const { supabase } = await checkSuperAdmin()

    const { error } = await supabase
      .from('empresas')
      .update({ ativo: !currentStatus })
      .eq('id', id)

    if (error) {
      console.error('Erro Supabase ao alternar status da empresa:', error)
      throw new Error(`Erro de banco: ${error.message}`)
    }

    revalidatePath('/admin/empresas')
    revalidatePath('/admin')
    return { success: true }
  } catch (err: any) {
    console.error('Erro ao alterar acesso de empresa:', err)
    return { success: false, error: err?.message || 'Erro ao alterar status' }
  }
}

// Atualizar dados cadastrais da empresa
export async function updateCompany(prevState: CreateCompanyState, formData: FormData): Promise<CreateCompanyState> {
  try {
    const { supabase } = await checkSuperAdmin()

    const id = formData.get('id') as string
    const nome = formData.get('nome') as string
    const plano = formData.get('plano') as string
    const valor_mensalidade_raw = formData.get('valor_mensalidade')
    const status_pagamento = formData.get('status_pagamento') as string
    const ativo_raw = formData.get('ativo')

    if (!id || !nome || !plano || !valor_mensalidade_raw) {
      return { success: false, empresa: null, error: 'Todos os campos obrigatórios devem ser preenchidos.' }
    }

    const valor_mensalidade = Number(valor_mensalidade_raw)
    if (isNaN(valor_mensalidade) || valor_mensalidade < 0) {
      return { success: false, empresa: null, error: 'Valor da mensalidade inválido.' }
    }

    const { data, error } = await supabase
      .from('empresas')
      .update({
        nome,
        plano,
        valor_mensalidade,
        status_pagamento: status_pagamento || 'ativo',
        ativo: ativo_raw === 'true'
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Erro Supabase ao atualizar empresa:', error)
      return { success: false, empresa: null, error: `Erro de banco: ${error.message}` }
    }

    revalidatePath('/admin/empresas')
    revalidatePath('/admin')
    return { success: true, empresa: data, error: null }
  } catch (err: any) {
    return { success: false, empresa: null, error: err?.message || 'Erro inesperado no servidor.' }
  }
}
