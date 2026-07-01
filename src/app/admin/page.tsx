import { getPlatformMetrics } from './empresas/actions'
import { 
  Building2, 
  DollarSign, 
  Users, 
  Activity, 
  ShieldCheck 
} from 'lucide-react'

// Define revalidação dinâmica para termos dados atualizados a cada carregamento
export const revalidate = 0

export default async function AdminDashboardPage() {
  const metrics = await getPlatformMetrics()

  const formattedBilling = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(metrics.totalBilling)

  const cards = [
    {
      name: 'Empresas Ativas',
      value: metrics.activeCompanies.toString(),
      description: 'Locatários com pagamento em dia',
      icon: Building2,
      color: 'from-cyan-500 to-blue-500',
    },
    {
      name: 'Faturamento Mensal',
      value: formattedBilling,
      description: 'Recorrência mensal acumulada',
      icon: DollarSign,
      color: 'from-emerald-500 to-teal-500',
    },
    {
      name: 'Total de Leads',
      value: metrics.totalLeads.toString(),
      description: 'Captados por todas as empresas',
      icon: Users,
      color: 'from-purple-500 to-indigo-500',
    },
  ]

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Banner de Status */}
      <div className="relative overflow-hidden rounded-2xl border border-cyan-500/10 bg-slate-900/30 p-6 md:p-8 backdrop-blur-xl">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 h-64 w-64 bg-cyan-500/5 blur-3xl rounded-full" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Torre de Controle <span className="text-cyan-400">Hubly Pro</span>
            </h2>
            <p className="text-slate-400 text-sm md:text-base max-w-2xl leading-relaxed">
              Painel global para monitoramento de faturamento, locatários e tráfego de dados do ecossistema SaaS.
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-400">
            <ShieldCheck className="h-4.5 w-4.5 text-cyan-400" />
            <span>Sistema Online (RBAC Ativo)</span>
          </div>
        </div>
      </div>

      {/* Grid de Indicadores */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <div
              key={card.name}
              className="relative overflow-hidden rounded-xl border border-slate-800/80 bg-slate-900/10 p-6 transition-all duration-200 hover:border-slate-700/60 group hover:shadow-lg hover:shadow-cyan-950/5"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-400">{card.name}</span>
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-tr ${card.color} text-white shadow-md shadow-cyan-950/20`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-bold tracking-tight text-white">{card.value}</span>
                <p className="mt-1 text-xs text-slate-500">{card.description}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Seção de Status Técnico */}
      <div className="rounded-xl border border-slate-850 bg-slate-900/10 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white">Status dos Serviços da Plataforma</h3>
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          <div className="p-4 rounded-lg bg-slate-950 border border-slate-900 flex items-center gap-3">
            <Activity className="h-5 w-5 text-cyan-400 shrink-0" />
            <div>
              <p className="text-xs text-slate-500">Banco de Dados</p>
              <p className="text-sm font-bold text-white">Excelente (Supabase)</p>
            </div>
          </div>
          <div className="p-4 rounded-lg bg-slate-950 border border-slate-900 flex items-center gap-3">
            <Activity className="h-5 w-5 text-purple-400 shrink-0" />
            <div>
              <p className="text-xs text-slate-500">Isolamento (RLS)</p>
              <p className="text-sm font-bold text-white">Ativo (Políticas OK)</p>
            </div>
          </div>
          <div className="p-4 rounded-lg bg-slate-950 border border-slate-900 flex items-center gap-3">
            <Activity className="h-5 w-5 text-emerald-400 shrink-0" />
            <div>
              <p className="text-xs text-slate-500">API de Leads CORS</p>
              <p className="text-sm font-bold text-white">Liberado (Sem Bloqueio)</p>
            </div>
          </div>
          <div className="p-4 rounded-lg bg-slate-950 border border-slate-900 flex items-center gap-3">
            <Activity className="h-5 w-5 text-blue-400 shrink-0" />
            <div>
              <p className="text-xs text-slate-500">Middleware RBAC</p>
              <p className="text-sm font-bold text-white">Edge Actived</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
