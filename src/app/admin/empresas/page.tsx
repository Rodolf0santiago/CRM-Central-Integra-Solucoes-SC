import { getCompanies } from './actions'
import CreateCompanyModal from '@/components/CreateCompanyModal'
import CompanyTableActions from '@/components/CompanyTableActions'
import { Calendar, Layers, ShieldCheck, DollarSign } from 'lucide-react'

export const revalidate = 0

export default async function AdminCompaniesPage() {
  let companies: any[] = []
  let errorMsg = null

  try {
    companies = await getCompanies()
  } catch (err: any) {
    errorMsg = err.message || 'Falha ao buscar empresas.'
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'medium',
    }).format(new Date(dateString))
  }

  return (
    <div className="space-y-6">
      {/* Top Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-slate-900">
        <div className="space-y-1">
          <p className="text-sm text-slate-450">Visão Geral dos Locatários</p>
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Empresas Cadastradas ({companies.length})
          </h2>
        </div>
        <div className="flex shrink-0">
          <CreateCompanyModal />
        </div>
      </div>

      {errorMsg && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
          {errorMsg}
        </div>
      )}

      {/* Table Section */}
      {companies.length === 0 ? (
        <div className="rounded-xl border border-slate-850 bg-slate-900/10 p-12 text-center space-y-3">
          <Layers className="mx-auto h-12 w-12 text-slate-600" />
          <h3 className="text-base font-bold text-white">Nenhuma empresa encontrada</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            Cadastre novas empresas e configure seus planos para iniciar a captação de leads.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-850 bg-slate-900/15">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/60 border-b border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <th className="px-6 py-4">Nome da Empresa / UUID</th>
                  <th className="px-6 py-4">Plano</th>
                  <th className="px-6 py-4 text-right">Mensalidade</th>
                  <th className="px-6 py-4 text-center">Pagamento</th>
                  <th className="px-6 py-4 text-center">Acesso</th>
                  <th className="px-6 py-4">Cadastrada Em</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850/80 text-sm text-slate-300">
                {companies.map((company) => (
                  <tr key={company.id} className="hover:bg-slate-900/30 transition">
                    <td className="px-6 py-4 space-y-1">
                      <div className="font-semibold text-white">{company.nome}</div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-slate-550 font-mono select-all">
                          {company.id}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-350">
                        {company.plano}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-slate-205">
                      {formatCurrency(company.valor_mensalidade || 0)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border ${
                          company.status_pagamento === 'ativo'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        }`}
                      >
                        {company.status_pagamento === 'ativo' ? 'Adimplente' : 'Inadimplente'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border ${
                          company.ativo !== false
                            ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}
                      >
                        {company.ativo !== false ? 'Liberado' : 'Bloqueado'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-450 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4 text-slate-500" />
                        <span>{formatDate(company.created_at)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <CompanyTableActions company={company} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
