import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white p-4 text-center">
      <h1 className="text-5xl font-bold mb-4 tracking-tighter">ControlAI 🤖</h1>
      <p className="text-xl text-gray-400 mb-8 max-w-md">
        Plataforma segura de Inteligência Artificial para empresas (SaaS
        Multi-tenant).
      </p>

      <div className="flex gap-4">
        <Link
          href="/login"
          className="px-8 py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition"
        >
          Acessar Plataforma
        </Link>
      </div>
    </div>
  )
}
