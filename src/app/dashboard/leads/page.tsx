import { getLeads } from '../actions'
import { Calendar, User, Phone, Briefcase, Tag, Sparkles } from 'lucide-react'

export const revalidate = 0

export default async function TenantLeadsPage() {
  let leads: any[] = []
  let errorMsg = null

  try {
    leads = await getLeads()
  } catch (err: any) {
    errorMsg = err.message || 'Falha ao recuperar leads.'
  }

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(dateString))
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-slate-900">
        <div className="space-y-1">
          <p className="text-sm text-slate-450">Funil de Atendimento</p>
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Leads do Site ({leads.length})
          </h2>
        </div>
      </div>

      {errorMsg && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
          {errorMsg}
        </div>
      )}

      {/* Main Content */}
      {leads.length === 0 ? (
        <div className="rounded-xl border border-slate-850 bg-slate-900/10 p-12 text-center space-y-3">
          <Sparkles className="mx-auto h-12 w-12 text-slate-650" />
          <h3 className="text-base font-bold text-white">Nenhum lead por aqui</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            Integre seu formulário externo enviando requisições POST para a rota <code className="text-indigo-400 bg-slate-900 px-1 py-0.5 rounded">/api/leads</code> com o seu ID de locatário.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-850 bg-slate-900/15">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/60 border-b border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <th className="px-6 py-4">Nome do Lead</th>
                  <th className="px-6 py-4">Telefone / WhatsApp</th>
                  <th className="px-6 py-4">Serviço Solicitado</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4">Captado Em</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850/80 text-sm text-slate-350">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-900/35 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-semibold text-xs">
                          {lead.nome.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold text-white">{lead.nome}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-slate-300">
                        <Phone className="h-4 w-4 text-slate-500" />
                        <span>{lead.telefone || 'Não informado'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-300">
                        <Briefcase className="h-4 w-4 text-slate-500" />
                        <span>{lead.servico || 'Não informado'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border ${
                          lead.status === 'novo'
                            ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        }`}
                      >
                        {lead.status === 'novo' ? 'Novo' : lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-450 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-slate-500" />
                        <span>{formatDate(lead.created_at)}</span>
                      </div>
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
