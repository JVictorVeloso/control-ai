import { DashboardSidebar } from '@/components/dashboard/dashboard-sidebar'
import { Toaster } from '@/components/ui/toaster'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function MasterAdminLayout({
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

  // Verificar se é master
  const { data: perfil } = await supabase
    .from('perfis')
    .select('role')
    .eq('id', user.id)
    .single()

  if (perfil?.role !== 'master') {
    redirect('/dashboard')
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-zinc-950">
      <DashboardSidebar
        empresaNome="Control AI Platform"
        userEmail={user.email || ''}
        userRole="master"
      />

      <main className="flex-1 overflow-y-auto">
        <div className="p-4 md:p-8">{children}</div>
      </main>
      <Toaster />
    </div>
  )
}
