'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

// Valida a sessão do locatário e retorna a empresa ativa
async function getTenantContext() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Usuário não autenticado.')

  // Obtém o perfil e verifica o bloqueio da empresa
  const { data: profile, error } = await supabase
    .from('usuarios')
    .select('empresa_id, role, empresas(ativo)')
    .eq('id', user.id)
    .maybeSingle()

  if (error || !profile) {
    throw new Error('Perfil do usuário não encontrado.')
  }

  const empresa = profile.empresas as any
  if (profile.role !== 'super_admin' && (!empresa || empresa.ativo === false)) {
    throw new Error('Acesso suspenso. Sua empresa está bloqueada temporariamente.')
  }

  return { supabase, empresaId: profile.empresa_id, user }
}

// Lista os leads do inquilino
export async function getLeads() {
  try {
    const { supabase, empresaId } = await getTenantContext()
    if (!empresaId) return []

    // RLS já garante a proteção, mas filtramos explicitamente por empresa_id por boa prática
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('empresa_id', empresaId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erro Supabase ao buscar leads:', error)
      throw new Error(`Erro ao buscar leads: ${error.message}`)
    }

    return data || []
  } catch (err: any) {
    console.error('Erro na Action getLeads:', err)
    throw err
  }
}

// Lista os agendamentos (visitas/instalações) do inquilino
export async function getAppointments() {
  try {
    const { supabase, empresaId } = await getTenantContext()
    if (!empresaId) return []

    const { data, error } = await supabase
      .from('agendamentos')
      .select('*')
      .eq('empresa_id', empresaId)
      .order('data_hora', { ascending: true })

    if (error) {
      console.error('Erro Supabase ao buscar agendamentos:', error)
      throw new Error(`Erro ao buscar agendamentos: ${error.message}`)
    }

    return data || []
  } catch (err: any) {
    console.error('Erro na Action getAppointments:', err)
    throw err
  }
}

export interface AppointmentState {
  success: boolean
  error: string | null
}

// Cria um novo agendamento (Visita/Instalação)
export async function createAppointment(prevState: AppointmentState, formData: FormData): Promise<AppointmentState> {
  try {
    const { supabase, empresaId } = await getTenantContext()
    if (!empresaId) {
      return { success: false, error: 'Apenas usuários vinculados a locatários podem agendar visitas ou instalações.' }
    }

    const nome_cliente = formData.get('nome_cliente') as string
    const tipo = formData.get('tipo') as string
    const descricao = formData.get('descricao') as string
    const data_hora_raw = formData.get('data_hora') as string

    if (!nome_cliente || !tipo || !data_hora_raw) {
      return { success: false, error: 'Todos os campos obrigatórios devem ser preenchidos.' }
    }

    if (tipo !== 'visita' && tipo !== 'instalacao') {
      return { success: false, error: 'Tipo de agendamento inválido.' }
    }

    const data_hora = new Date(data_hora_raw)
    if (isNaN(data_hora.getTime())) {
      return { success: false, error: 'A data ou hora fornecida é inválida.' }
    }

    const { error } = await supabase
      .from('agendamentos')
      .insert({
        empresa_id: empresaId,
        nome_cliente,
        tipo,
        descricao,
        data_hora: data_hora.toISOString(),
        status: 'pendente'
      })

    if (error) {
      console.error('Erro Supabase ao criar agendamento:', error)
      return { success: false, error: `Erro de banco de dados: ${error.message}` }
    }

    revalidatePath('/dashboard/calendario')
    return { success: true, error: null }
  } catch (err: any) {
    return { success: false, error: err?.message || 'Erro inesperado no servidor.' }
  }
}
