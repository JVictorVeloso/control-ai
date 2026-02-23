import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Middleware de autenticação e controle de acesso baseado em roles.
 *
 * ESTRUTURA DE ROTAS:
 * - /login: Landing page pública (marketing)
 * - /auth: Formulário de autenticação (sign up/login)
 * - /dashboard: Área autenticada (redireciona baseado no role)
 * - /admin/master: Dashboard do Master Admin (acesso global)
 * - /admin/tenant: Dashboard do Admin Tenant (gestão da empresa)
 * - /setup: Onboarding para colaboradores
 *
 * FLUXO:
 * 1. Usuário não autenticado acessa rota protegida → Redireciona para /login
 * 2. Usuário autenticado acessa /login → Redireciona para dashboard apropriado
 * 3. Middleware valida role e redireciona conforme hierarquia (Master > Admin > Colaborador)
 */
export async function middleware(request: NextRequest) {
  const response = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // Redirecionar não autenticados para login
  if (
    !user &&
    (pathname.startsWith('/dashboard') ||
      pathname.startsWith('/admin') ||
      pathname.startsWith('/setup'))
  ) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Redirecionar autenticados de /login para dashboard apropriado
  if (user && pathname.startsWith('/login')) {
    // Buscar role do usuário
    const { data: perfil } = await supabase
      .from('perfis')
      .select('role')
      .eq('id', user.id)
      .single()

    if (perfil?.role === 'master') {
      return NextResponse.redirect(new URL('/admin/master', request.url))
    } else if (perfil?.role === 'admin_tenant') {
      return NextResponse.redirect(new URL('/admin/tenant', request.url))
    } else {
      // Colaboradores vão para setup para se promoverem
      return NextResponse.redirect(new URL('/setup', request.url))
    }
  }

  // Redirecionar usuários do /dashboard para dashboard apropriado baseado no role
  if (user && pathname === '/dashboard') {
    const { data: perfil } = await supabase
      .from('perfis')
      .select('role, empresa_id')
      .eq('id', user.id)
      .single()

    // Se não tem empresa, deixar passar (vai para onboarding)
    if (!perfil?.empresa_id) {
      return response
    }

    // Redirecionar baseado no role
    if (perfil?.role === 'master') {
      return NextResponse.redirect(new URL('/admin/master', request.url))
    } else if (perfil?.role === 'admin_tenant') {
      return NextResponse.redirect(new URL('/admin/tenant', request.url))
    } else if (perfil?.role === 'colaborador') {
      return NextResponse.redirect(new URL('/setup', request.url))
    }
  }

  // Proteger rotas admin baseado em role
  if (user && pathname.startsWith('/admin')) {
    const { data: perfil } = await supabase
      .from('perfis')
      .select('role')
      .eq('id', user.id)
      .single()

    // Master tentando acessar tenant admin
    if (pathname.startsWith('/admin/tenant') && perfil?.role === 'master') {
      return NextResponse.redirect(new URL('/admin/master', request.url))
    }

    // Admin tenant tentando acessar master
    if (
      pathname.startsWith('/admin/master') &&
      perfil?.role === 'admin_tenant'
    ) {
      return NextResponse.redirect(new URL('/admin/tenant', request.url))
    }

    // Colaborador tentando acessar qualquer admin
    if (
      (pathname.startsWith('/admin/master') ||
        pathname.startsWith('/admin/tenant')) &&
      perfil?.role === 'colaborador'
    ) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return response
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/login', '/setup'],
}
