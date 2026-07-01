'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Shield, 
  Building2, 
  LayoutDashboard,
  LogOut, 
  Menu, 
  X,
  UserCheck
} from 'lucide-react'
import { logout } from '@/app/login/actions'

interface AdminLayoutClientProps {
  children: React.ReactNode
  userName: string
  userEmail: string
}

export default function AdminLayoutClient({ 
  children, 
  userName, 
  userEmail 
}: AdminLayoutClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  const navigation = [
    { name: 'Visão Geral', href: '/admin', icon: LayoutDashboard },
    { name: 'Empresas', href: '/admin/empresas', icon: Building2 },
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-950/85 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar (Off-Canvas Drawer) */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 border-r border-slate-800 p-6 flex flex-col justify-between transform transition-transform duration-300 ease-in-out lg:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-white shadow-md shadow-cyan-500/10">
                A
              </div>
              <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                Hubly Admin
              </span>
            </div>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="rounded-lg bg-cyan-950/30 border border-cyan-850 p-3 flex items-center gap-2">
            <Shield className="h-4 w-4 text-cyan-400 shrink-0" />
            <span className="text-xs font-semibold text-cyan-300">Torre de Controle</span>
          </div>

          <nav className="space-y-1.5">
            {navigation.map((item) => {
              const active = pathname === item.href
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition ${
                    active 
                      ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/10' 
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-100'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="border-t border-slate-800 pt-4 flex flex-col gap-4">
          <div className="flex items-center space-x-3 px-2">
            <div className="h-10 w-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400">
              <UserCheck className="h-5 w-5" />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-white truncate">{userName}</p>
              <p className="text-xs text-slate-500 truncate">{userEmail}</p>
            </div>
          </div>
          <form action={logout}>
            <button 
              type="submit"
              className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition"
            >
              <LogOut className="h-5 w-5" />
              <span>Sair do Admin</span>
            </button>
          </form>
        </div>
      </div>

      {/* Desktop Sidebar (Permanent) */}
      <aside className="hidden lg:flex lg:w-72 lg:flex-col lg:justify-between lg:fixed lg:inset-y-0 lg:z-30 bg-slate-900/65 border-r border-slate-850 p-6 backdrop-blur-xl">
        <div className="space-y-8">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-black text-white shadow-lg shadow-cyan-500/20">
              A
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-white">Hubly <span className="text-cyan-400">Admin</span></span>
            </div>
          </div>

          <div className="rounded-xl bg-cyan-950/20 border border-cyan-500/10 p-3.5 flex items-center gap-2">
            <Shield className="h-4.5 w-4.5 text-cyan-400 shrink-0" />
            <span className="text-xs font-semibold text-cyan-400">Torre de Controle (SaaS)</span>
          </div>

          <nav className="space-y-1.5">
            {navigation.map((item) => {
              const active = pathname === item.href
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-205 ${
                    active 
                      ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/15' 
                      : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-100'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="border-t border-slate-800 pt-4 flex flex-col gap-4">
          <div className="flex items-center space-x-3 px-2">
            <div className="h-10 w-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400 shadow-inner">
              <UserCheck className="h-5 w-5" />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-white truncate">{userName}</p>
              <p className="text-xs text-slate-500 truncate">{userEmail}</p>
            </div>
          </div>
          <form action={logout}>
            <button 
              type="submit"
              className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition"
            >
              <LogOut className="h-5 w-5" />
              <span>Sair da conta</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col lg:pl-72 min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-20 h-16 bg-slate-950/70 border-b border-slate-900/80 backdrop-blur-md px-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 lg:hidden transition"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-lg font-semibold text-white">
              {pathname === '/admin' ? 'Painel Administrativo' : 'Empresas Cadastradas'}
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <span className="hidden sm:inline-block text-xs font-semibold px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Super Admin Ativo
            </span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
