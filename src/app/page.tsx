import Link from 'next/link'
import { ArrowRight, Shield, Activity, Users } from 'lucide-react'

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-950 px-6 py-12 text-slate-100">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(99,102,241,0.12),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(168,85,247,0.06),transparent_50%)]" />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-4xl text-center space-y-12">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 shadow-xl shadow-indigo-500/20">
            <span className="text-2xl font-black text-white tracking-wider">H</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mt-4">
            Hubly<span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent"> Pro</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto">
            A fundação do seu CRM SaaS B2B2C com segurança de nível bancário e isolamento rigoroso de inquilinos.
          </p>
        </div>

        {/* Action Button */}
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center space-x-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-4 text-base font-semibold text-white transition-all duration-200 hover:from-indigo-600 hover:to-purple-700 hover:scale-[1.02] shadow-lg hover:shadow-indigo-500/30"
          >
            <span>Acessar o Painel</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid gap-6 sm:grid-cols-3 text-left mt-8">
          <div className="rounded-xl border border-slate-900 bg-slate-900/35 p-6 space-y-3 backdrop-blur-sm">
            <div className="h-10 w-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
              <Shield className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-white">Multi-Tenancy RLS</h3>
            <p className="text-sm text-slate-450 leading-relaxed">
              Políticas de Row Level Security nativas no PostgreSQL garantem isolamento total dos dados por empresa.
            </p>
          </div>

          <div className="rounded-xl border border-slate-900 bg-slate-900/35 p-6 space-y-3 backdrop-blur-sm">
            <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/20">
              <Users className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-white">Supabase SSR Auth</h3>
            <p className="text-sm text-slate-450 leading-relaxed">
              Autenticação segura via cookies integrada de ponta a ponta com Next.js App Router e Middleware.
            </p>
          </div>

          <div className="rounded-xl border border-slate-900 bg-slate-900/35 p-6 space-y-3 backdrop-blur-sm">
            <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
              <Activity className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-white">API de Captura</h3>
            <p className="text-sm text-slate-450 leading-relaxed">
              Endpoint público em <code className="text-emerald-300">/api/leads</code> com CORS desabilitado para integração com sites externos.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

