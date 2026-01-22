import { createClient } from '@/utils/supabase/server'
import { Building2, MessageSquare, Settings } from 'lucide-react'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Busca o nome do workspace para exibir no card
  const { data: workspace } = await supabase
    .from('workspaces')
    .select('*')
    .eq('user_id', user?.id)
    .single()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-500">
          Bem-vindo ao seu workspace! Use o menu lateral para navegar.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {/* Card Chat */}
        <Link
          href="/dashboard/chat"
          className="block p-6 bg-white border rounded-lg hover:shadow-md transition group"
        >
          <div className="flex items-center gap-4 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition">
              <MessageSquare className="h-6 w-6 text-blue-700" />
            </div>
            <h3 className="font-bold text-lg">Chat AI</h3>
          </div>
          <p className="text-sm text-gray-500">
            Converse com a inteligência artificial da empresa.
          </p>
        </Link>

        {/* Card Configurações */}
        <Link
          href="/dashboard"
          className="block p-6 bg-white border rounded-lg hover:shadow-md transition group"
        >
          <div className="flex items-center gap-4 mb-2">
            <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition">
              <Settings className="h-6 w-6 text-gray-700" />
            </div>
            <h3 className="font-bold text-lg">Configurações</h3>
          </div>
          <p className="text-sm text-gray-500">
            Gerencie dados e preferências.
          </p>
        </Link>

        {/* Card Empresa */}
        <div className="p-6 bg-white border rounded-lg">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Building2 className="h-6 w-6 text-purple-700" />
            </div>
            <h3 className="font-bold text-lg">Empresa</h3>
          </div>
          <p className="text-sm text-gray-500 font-medium">
            {workspace?.name || 'Minha Startup'}
          </p>
        </div>
      </div>
    </div>
  )
}
