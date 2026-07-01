import { NextResponse } from 'next/server'
import { createAdminClient } from '@/utils/supabase/server'

// Manipulador da requisição de pré-voo (Pre-flight OPTIONS) para evitar erros de CORS em requisições de sites externos
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400', // Cache por 24 horas
    },
  })
}

// Rota POST para receber leads externos
export async function POST(request: Request) {
  try {
    // Obter o corpo da requisição JSON
    let body
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { error: 'Formato JSON inválido.' },
        {
          status: 400,
          headers: { 'Access-Control-Allow-Origin': '*' }
        }
      )
    }

    const { nome, telefone, servico, empresa_id } = body

    // 1. Validação dos Campos Obrigatórios
    if (!empresa_id) {
      return NextResponse.json(
        { error: 'O campo "empresa_id" é obrigatório para direcionar o lead ao locatário correspondente.' },
        {
          status: 400,
          headers: { 'Access-Control-Allow-Origin': '*' }
        }
      )
    }

    if (!nome) {
      return NextResponse.json(
        { error: 'O campo "nome" é obrigatório.' },
        {
          status: 400,
          headers: { 'Access-Control-Allow-Origin': '*' }
        }
      )
    }

    // 2. Criar cliente com service_role (Admin) para ignorar RLS
    // Isso é seguro pois este código roda estritamente no servidor e processa captação anônima.
    const supabaseAdmin = createAdminClient()

    // 3. Inserir Lead
    const { data, error } = await supabaseAdmin
      .from('leads')
      .insert({
        nome,
        telefone,
        servico,
        empresa_id,
        status: 'novo'
      })
      .select()
      .single()

    if (error) {
      console.error('Erro ao registrar lead no Supabase:', error)
      return NextResponse.json(
        { error: 'Falha ao salvar o lead no banco de dados.', details: error.message },
        {
          status: 500,
          headers: { 'Access-Control-Allow-Origin': '*' }
        }
      )
    }

    // 4. Retornar Sucesso 200 com CORS liberado
    return NextResponse.json(
      { 
        success: true, 
        message: 'Lead capturado com sucesso!', 
        lead: data 
      },
      {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        }
      }
    )
  } catch (err: any) {
    console.error('Erro não tratado na API de Leads:', err)
    return NextResponse.json(
      { 
        error: 'Erro interno no servidor.', 
        details: err?.message || 'Erro desconhecido' 
      },
      {
        status: 500,
        headers: { 'Access-Control-Allow-Origin': '*' }
      }
    )
  }
}
