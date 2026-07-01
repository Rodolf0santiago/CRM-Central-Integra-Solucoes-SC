'use client'

import { useActionState, useEffect } from 'react'
import { createAppointment, type AppointmentState } from '@/app/dashboard/actions'
import { Calendar, User, FileText, Check, AlertCircle } from 'lucide-react'

const initialState: AppointmentState = {
  success: false,
  error: null
}

export default function CreateAppointmentForm() {
  const [state, formAction, isPending] = useActionState(createAppointment, initialState)

  useEffect(() => {
    if (state?.success) {
      // Força recarga da página para puxar os dados atualizados
      window.location.reload()
    }
  }, [state])

  return (
    <div className="rounded-xl border border-slate-850 bg-slate-900/10 p-6 space-y-4">
      <div className="space-y-1">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Calendar className="h-4.5 w-4.5 text-indigo-400" />
          <span>Agendar Nova Visita/Instalação</span>
        </h3>
        <p className="text-xs text-slate-500">
          Preencha os dados abaixo para reservar na agenda do inquilino.
        </p>
      </div>

      <form action={formAction} className="space-y-4 text-left">
        <div>
          <label htmlFor="nome_cliente" className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
            Nome do Cliente
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-4 w-4 text-slate-500" />
            </div>
            <input
              id="nome_cliente"
              name="nome_cliente"
              type="text"
              required
              disabled={isPending}
              placeholder="Ex: João da Silva"
              className="block w-full pl-9 rounded-lg border border-slate-750 bg-slate-950 px-3 py-2 text-sm text-white placeholder-slate-550 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="tipo" className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Tipo
            </label>
            <select
              id="tipo"
              name="tipo"
              required
              disabled={isPending}
              className="mt-1 block w-full rounded-lg border border-slate-750 bg-slate-950 px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
            >
              <option value="visita">Visita Técnica</option>
              <option value="instalacao">Instalação</option>
            </select>
          </div>

          <div>
            <label htmlFor="data_hora" className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Data e Hora
            </label>
            <input
              id="data_hora"
              name="data_hora"
              type="datetime-local"
              required
              disabled={isPending}
              className="mt-1 block w-full rounded-lg border border-slate-750 bg-slate-950 px-3 py-1.5 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
            />
          </div>
        </div>

        <div>
          <label htmlFor="descricao" className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
            Observações / Descrição
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 pt-3 flex items-start pointer-events-none">
              <FileText className="h-4 w-4 text-slate-500" />
            </div>
            <textarea
              id="descricao"
              name="descricao"
              rows={3}
              disabled={isPending}
              placeholder="Ex: Instalação de painéis solares ou vistoria técnica..."
              className="block w-full pl-9 rounded-lg border border-slate-750 bg-slate-950 px-3 py-2 text-sm text-white placeholder-slate-550 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
            />
          </div>
        </div>

        {state?.error && (
          <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400 flex items-start gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
            <span>{state.error}</span>
          </div>
        )}

        {state?.success && (
          <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs text-emerald-400 flex items-start gap-2">
            <Check className="h-4 w-4 shrink-0 text-emerald-400" />
            <span>Agendamento criado! Atualizando...</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 shadow-md shadow-indigo-600/10 disabled:opacity-50 cursor-pointer"
        >
          {isPending ? 'Agendando...' : 'Confirmar Agendamento'}
        </button>
      </form>
    </div>
  )
}
