import { DashboardSidebar } from '@/components/dashboard/dashboard-sidebar'
import { Toaster } from '@/components/ui/toaster'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function TenantAdminLayout({
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

  // Buscar perfil do usuário
  const { data: perfil } = await supabase
    .from('perfis')
    .select('empresa_id, role')
    .eq('id', user.id)
    .single()

  // Verificar se é admin_tenant
  if (perfil?.role !== 'admin_tenant') {
    redirect('/dashboard')
  }

  // Buscar nome da empresa
  let empresaNome = 'Enterprise'
  if (perfil?.empresa_id) {
    const { data: empresa } = await supabase
      .from('empresas')
      .select('nome')
      .eq('id', perfil.empresa_id)
      .single()

    empresaNome = empresa?.nome || 'Enterprise'
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-zinc-950">
      <DashboardSidebar
        empresaNome={empresaNome}
        userEmail={user.email || ''}
        userRole="admin_tenant"
      />

      <main className="flex-1 overflow-y-auto">
        <div className="p-4 md:p-8">{children}</div>
      </main>
      <Toaster />
    </div>
  )
}
