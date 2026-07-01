import { getAppointments } from '../actions'
import CreateAppointmentForm from '@/components/CreateAppointmentForm'
import { Calendar, Clock, Wrench, ShieldCheck, Tag, Info } from 'lucide-react'

export const revalidate = 0

export default async function TenantCalendarPage() {
  let appointments: any[] = []
  let errorMsg = null

  try {
    appointments = await getAppointments()
  } catch (err: any) {
    errorMsg = err.message || 'Falha ao buscar agendamentos.'
  }

  const formatTime = (dateString: string) => {
    return new Intl.DateTimeFormat('pt-BR', {
      timeStyle: 'short',
    }).format(new Date(dateString))
  }

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    }).format(new Date(dateString))
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-slate-900">
        <div className="space-y-1">
          <p className="text-sm text-slate-450">Serviços Externos</p>
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Agenda de Visitas e Instalações
          </h2>
        </div>
      </div>

      {errorMsg && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
          {errorMsg}
        </div>
      )}

      {/* Two Column Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column: Form */}
        <div className="lg:col-span-1">
          <CreateAppointmentForm />
        </div>

        {/* Right Column: Appointments List */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-base font-bold text-white mb-3">Compromissos Agendados</h3>

          {appointments.length === 0 ? (
            <div className="rounded-xl border border-slate-850 bg-slate-900/10 p-12 text-center space-y-3">
              <Calendar className="mx-auto h-12 w-12 text-slate-650" />
              <h4 className="text-base font-bold text-white">Nenhum agendamento registrado</h4>
              <p className="text-sm text-slate-500 max-w-sm mx-auto">
                Utilize o formulário ao lado para cadastrar a primeira visita técnica ou instalação do locatário.
              </p>
            </div>
          ) : (
            <div className="space-y-4 relative border-l border-slate-800 ml-4 pl-6">
              {appointments.map((app) => {
                const isVisit = app.tipo === 'visita'
                return (
                  <div
                    key={app.id}
                    className="relative p-5 rounded-xl border border-slate-850 bg-slate-900/15 backdrop-blur-sm space-y-3 hover:border-slate-800 transition"
                  >
                    {/* Timeline Bullet */}
                    <div className={`absolute -left-[31px] top-6 h-4.5 w-4.5 rounded-full border-4 border-slate-950 flex items-center justify-center ${
                      isVisit ? 'bg-indigo-500' : 'bg-purple-500'
                    }`} />

                    {/* Meta info & Badges */}
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                        <Clock className="h-3.5 w-3.5 text-slate-500" />
                        <span>{formatDate(app.data_hora)} às {formatTime(app.data_hora)}</span>
                      </div>
                      <div className="flex gap-2">
                        <span
                          className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-semibold border ${
                            isVisit
                              ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                              : 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                          }`}
                        >
                          <Wrench className="h-3 w-3" />
                          <span>{isVisit ? 'Visita Técnica' : 'Instalação'}</span>
                        </span>
                        <span className="inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold bg-slate-850 border border-slate-750 text-slate-400">
                          {app.status}
                        </span>
                      </div>
                    </div>

                    {/* Client info */}
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-white">Cliente: {app.nome_cliente}</h4>
                      {app.descricao && (
                        <p className="text-sm text-slate-400 leading-relaxed font-light flex items-start gap-1.5">
                          <Info className="h-4 w-4 text-slate-500 shrink-0 mt-0.5" />
                          <span>{app.descricao}</span>
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
