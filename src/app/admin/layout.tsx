import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import AdminLayoutClient from '@/components/AdminLayoutClient'

export default async function AdminLayout({
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

  // Verifica a permissão de super_admin antes de renderizar qualquer página administrativa
  const { data: profile } = await supabase
    .from('usuarios')
    .select('nome, role')
    .eq('id', user.id)
    .maybeSingle()

  if (!profile || profile.role !== 'super_admin') {
    redirect('/dashboard')
  }

  return (
    <AdminLayoutClient 
      userName={profile.nome || 'Administrador Global'} 
      userEmail={user.email || ''}
    >
      {children}
    </AdminLayoutClient>
  )
}
