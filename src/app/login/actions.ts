'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(prevState: any, formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'E-mail e senha são obrigatórios.' }
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    // Traduzir mensagens comuns do Supabase Auth para o usuário final
    let userFriendlyError = error.message
    if (error.message.includes('Invalid login credentials')) {
      userFriendlyError = 'E-mail ou senha incorretos.'
    } else if (error.message.includes('Email not confirmed')) {
      userFriendlyError = 'Por favor, confirme seu e-mail antes de acessar.'
    }
    return { error: userFriendlyError }
  }

  // Se o login for bem-sucedido, busca a role para fazer o direcionamento correto
  if (data?.user) {
    const { data: profile } = await supabase
      .from('usuarios')
      .select('role')
      .eq('id', data.user.id)
      .maybeSingle()

    if (profile?.role === 'super_admin') {
      revalidatePath('/admin', 'layout')
      redirect('/admin')
    }
  }

  revalidatePath('/dashboard', 'layout')
  redirect('/dashboard')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
