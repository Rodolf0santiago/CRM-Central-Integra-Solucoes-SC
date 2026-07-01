'use client'

import { useActionState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { login } from './actions'
import { AlertCircle } from 'lucide-react'

const initialState = {
  error: null as string | null,
}

function LoginForm() {
  const [state, formAction, isPending] = useActionState(login, initialState)
  const searchParams = useSearchParams()
  const errorParam = searchParams.get('error')

  return (
    <div className="relative w-full max-w-md space-y-8">
      {/* Logo/Brand Section */}
      <div className="flex flex-col items-center text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
          <span className="text-xl font-black text-white tracking-wider">H</span>
        </div>
        <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          Hubly<span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent"> Pro</span>
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          O CRM SaaS completo para empresas modernas
        </p>
      </div>

      {/* Card Container */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8 shadow-2xl backdrop-blur-xl">
        <form action={formAction} className="space-y-6">
          {/* Alerta de Empresa Bloqueada */}
          {errorParam === 'blocked' && (
            <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-3.5 text-sm text-amber-400 flex items-start gap-2.5">
              <AlertCircle className="h-5 w-5 shrink-0 text-amber-400" />
              <span>Acesso suspenso. Esta empresa foi bloqueada temporariamente. Entre em contato com a administração.</span>
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-300">
              E-mail corporativo
            </label>
            <div className="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                disabled={isPending}
                className="block w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-white placeholder-slate-500 transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="exemplo@empresa.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-300">
              Senha de acesso
            </label>
            <div className="mt-1">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                disabled={isPending}
                className="block w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-white placeholder-slate-500 transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Error Message display */}
          {state?.error && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3.5 text-sm text-red-400">
              <div className="flex">
                <span className="font-medium">{state.error}</span>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isPending}
              className="group relative flex w-full justify-center rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-3 text-sm font-semibold text-white transition-all duration-200 hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:cursor-not-allowed disabled:opacity-50 shadow-md hover:shadow-indigo-500/25"
            >
              {isPending ? (
                <div className="flex items-center space-x-2">
                  <svg className="h-5 w-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Entrando...</span>
                </div>
              ) : (
                <span>Acessar CRM</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-950 px-4 py-12 sm:px-6 lg:px-8">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(99,102,241,0.08),transparent_40%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(168,85,247,0.08),transparent_40%)]" />

      <Suspense fallback={
        <div className="text-center text-slate-400">
          <svg className="mx-auto h-8 w-8 animate-spin text-indigo-550" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="mt-2 block text-sm">Carregando formulário...</span>
        </div>
      }>
        <LoginForm />
      </Suspense>
    </div>
  )
}
