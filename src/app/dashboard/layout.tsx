import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import DashboardLayoutClient from '@/components/DashboardLayoutClient'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Tenta obter o nome do usuário cadastrado na tabela "usuarios"
  let userName = 'Usuário CRM'
  
  try {
    const { data: profile, error } = await supabase
      .from('usuarios')
      .select('nome')
      .eq('id', user.id)
      .maybeSingle()

    if (!error && profile?.nome) {
      userName = profile.nome
    }
  } catch (err) {
    console.error('Erro ao recuperar perfil:', err)
  }

  return (
    <DashboardLayoutClient 
      userName={userName} 
      userEmail={user.email || ''}
    >
      {children}
    </DashboardLayoutClient>
  )
}
