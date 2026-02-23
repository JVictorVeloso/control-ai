import { redirect } from 'next/navigation'

export default function HomePage() {
  // Redireciona automaticamente para a landing page no /login
  redirect('/login')
}
