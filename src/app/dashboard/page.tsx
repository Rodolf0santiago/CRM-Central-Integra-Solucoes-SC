import { 
  TrendingUp, 
  Users, 
  Calendar, 
  ArrowUpRight 
} from 'lucide-react'

export default function DashboardPage() {
  const stats = [
    {
      name: 'Total de Leads',
      value: '1,248',
      change: '+12.5%',
      changeType: 'positive',
      icon: Users,
      color: 'from-blue-500 to-indigo-500',
    },
    {
      name: 'Leads Convertidos',
      value: '356',
      change: '+18.2%',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-500',
    },
    {
      name: 'Agendamentos (Esta Semana)',
      value: '42',
      change: '-4.1%',
      changeType: 'negative',
      icon: Calendar,
      color: 'from-purple-500 to-pink-500',
    },
  ]

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-indigo-500/10 bg-slate-900/40 p-6 md:p-8 backdrop-blur-xl">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 h-64 w-64 bg-indigo-500/5 blur-3xl rounded-full" />
        <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 h-64 w-64 bg-purple-500/5 blur-3xl rounded-full" />

        <div className="relative z-10 space-y-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            Fundação CRM Configurada
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Bem-vindo ao <span className="bg-gradient-to-r from-indigo-450 to-purple-450 bg-clip-text text-transparent">Hubly Pro</span>
          </h2>
          <p className="text-slate-400 text-sm md:text-base max-w-2xl leading-relaxed">
            Seu ambiente multi-tenant está pronto. A separação de dados por RLS garante que cada locatário gerencie suas informações com total privacidade e segurança nível banco.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.name}
              className="relative overflow-hidden rounded-xl border border-slate-800/80 bg-slate-900/20 p-6 transition-all duration-200 hover:border-slate-705 group hover:shadow-lg hover:shadow-indigo-950/10"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-400">{stat.name}</span>
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-tr ${stat.color} text-white shadow-md opacity-85 group-hover:opacity-100 transition-opacity`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline space-x-2">
                <span className="text-3xl font-bold tracking-tight text-white">{stat.value}</span>
                <span
                  className={`inline-flex items-center text-xs font-semibold ${
                    stat.changeType === 'positive' ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {stat.change}
                  <ArrowUpRight className="ml-0.5 h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Quick Start Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-slate-800/85 bg-slate-900/10 p-6 space-y-4">
          <h3 className="text-base font-bold text-white">Próximos Passos recomendados</h3>
          <ul className="space-y-3 text-sm text-slate-400">
            <li className="flex items-start space-x-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-800 text-xs font-medium text-slate-350">1</span>
              <span>Rode o script SQL contido em <code className="text-indigo-350 bg-slate-900 px-1 py-0.5 rounded">schema.sql</code> no SQL Editor do painel do Supabase.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-800 text-xs font-medium text-slate-350">2</span>
              <span>Crie uma conta no Supabase Auth e insira os dados correspondentes nas tabelas <code className="text-indigo-350 bg-slate-900 px-1 py-0.5 rounded">empresas</code> e <code className="text-indigo-350 bg-slate-900 px-1 py-0.5 rounded">usuarios</code>.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-800 text-xs font-medium text-slate-350">3</span>
              <span>Integre formulários ou CRMs externos usando a rota de captação de leads em <code className="text-indigo-350 bg-slate-900 px-1 py-0.5 rounded">/api/leads</code>.</span>
            </li>
          </ul>
        </div>

        <div className="rounded-xl border border-slate-800/85 bg-slate-900/10 p-6 flex flex-col justify-between">
          <div className="space-y-2">
            <h3 className="text-base font-bold text-white">Status da Conexão</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              O cliente SSR do Next.js está utilizando variáveis de ambiente para se comunicar com o Supabase de forma segura tanto no lado do servidor quanto do cliente.
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-500">
            <span>Next.js App Router v16</span>
            <span>Supabase SSR Active</span>
          </div>
        </div>
      </div>
    </div>
  )
}
