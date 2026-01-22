import DashboardContent from '@/components/dashboard/dashboard-content'
import OnboardingCard from '@/components/dashboard/onboarding-card'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Buscar perfil do usuário
  const { data: perfil, error } = await supabase
    .from('perfis')
    .select('*, empresas(*)')
    .eq('id', user.id)
    .single()

  if (error) {
    console.error('Erro ao buscar perfil:', error)
  }

  // Cenário A: Sem empresa - Mostrar onboarding
  if (!perfil?.empresa_id) {
    return <OnboardingCard userEmail={user.email || ''} />
  }

  // Cenário B: Com empresa - Mostrar dashboard
  return <DashboardContent user={user} empresa={perfil.empresas} />
}
