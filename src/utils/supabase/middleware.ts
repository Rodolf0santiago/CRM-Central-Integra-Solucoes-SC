import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANTE: Obter o usuário atual de forma segura usando getUser()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const url = request.nextUrl.clone()

  // Regra 1: Se não estiver autenticado, impede acesso ao /dashboard e /admin
  if (!user) {
    if (url.pathname.startsWith('/dashboard') || url.pathname.startsWith('/admin')) {
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }
  }

  // Regra 2: Usuário autenticado
  if (user) {
    // Obter perfil e status da empresa em uma única query otimizada
    const { data: profile } = await supabase
      .from('usuarios')
      .select('role, empresas(ativo)')
      .eq('id', user.id)
      .maybeSingle()

    const empresa = profile?.empresas as any

    // Bloqueio automático de inquilinos desativados
    if (profile?.role !== 'super_admin' && (!empresa || empresa.ativo === false)) {
      await supabase.auth.signOut()
      url.pathname = '/login'
      url.searchParams.set('error', 'blocked')
      return NextResponse.redirect(url)
    }

    // Redirecionamento da tela de login para a home correta com base na role
    if (url.pathname === '/login') {
      if (profile?.role === 'super_admin') {
        url.pathname = '/admin'
      } else {
        url.pathname = '/dashboard'
      }
      return NextResponse.redirect(url)
    }

    // Proteção rigorosa do painel Super Admin (/admin)
    if (url.pathname.startsWith('/admin')) {
      if (profile?.role !== 'super_admin') {
        url.pathname = '/dashboard'
        return NextResponse.redirect(url)
      }
    }
  }

  return supabaseResponse
}
