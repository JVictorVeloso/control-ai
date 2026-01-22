import { createClient } from '@/utils/supabase/server'
import { Building2, LogOut, MessageSquare, Settings } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

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

  // Pega o nome da empresa (opcional, só visual)
  const { data: workspace } = await supabase
    .from('workspaces')
    .select('name')
    .eq('user_id', user.id)
    .single()

  return (
    <div className="flex h-screen bg-gray-50">
      {/* 📱 SIDEBAR (Escondida no celular com 'hidden md:flex') */}
      <aside className="hidden md:flex w-64 flex-col border-r bg-white p-6 justify-between">
        <div>
          <div className="flex items-center gap-2 mb-8 text-black">
            <Building2 className="h-6 w-6" />
            <div>
              <h2 className="font-bold text-lg leading-none">Control AI</h2>
              <p className="text-xs text-gray-500 mt-1">
                {workspace?.name || 'SaaS'}
              </p>
            </div>
          </div>

          <nav className="space-y-2">
            <Link
              href="/dashboard/chat"
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
            >
              <MessageSquare className="h-4 w-4" />
              Chat AI
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition"
            >
              <Settings className="h-4 w-4" />
              Configurações
            </Link>
          </nav>
        </div>

        <div className="border-t pt-4">
          <p className="text-xs text-gray-400 mb-2 truncate">{user.email}</p>
          <form action="/auth/signout" method="post">
            <button className="flex items-center gap-2 text-sm text-red-500 hover:text-red-700 transition w-full">
              <LogOut className="h-4 w-4" />
              Sair
            </button>
          </form>
        </div>
      </aside>

      {/* 🖥️ ÁREA PRINCIPAL (Conteúdo) */}
      <main className="flex-1 overflow-y-auto">
        {/* Barra topo Mobile (Só aparece no celular para dar contexto) */}
        <div className="md:hidden flex items-center p-4 bg-white border-b">
          <Building2 className="h-5 w-5 mr-2" />
          <span className="font-bold">Control AI</span>
        </div>

        <div className="p-4 md:p-8">{children}</div>
      </main>
    </div>
  )
}
