'use client'

import { useState, useActionState } from 'react'
import { updateCompany, type CreateCompanyState } from '@/app/admin/empresas/actions'
import { Edit2, X, Check, AlertCircle } from 'lucide-react'

interface EditCompanyModalProps {
  company: {
    id: string
    nome: string
    plano: string
    valor_mensalidade: number
    status_pagamento: string
    ativo: boolean
    cnpj?: string | null
    telefone?: string | null
  }
}

export default function EditCompanyModal({ company }: EditCompanyModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [successMsg, setSuccessMsg] = useState(false)

  const initialState: CreateCompanyState = {
    success: false,
    empresa: null,
    error: null
  }

  // Action state para update
  const [state, formAction, isPending] = useActionState(async (prevState: CreateCompanyState, formData: FormData) => {
    const res = await updateCompany(prevState, formData)
    if (res.success) {
      setSuccessMsg(true)
      setTimeout(() => {
        setSuccessMsg(false)
        setIsOpen(false)
        window.location.reload()
      }, 1500)
    }
    return res
  }, initialState)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition flex items-center justify-center cursor-pointer"
        title="Editar Empresa"
      >
        <Edit2 className="h-4 w-4" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm animate-fade-in text-left">
          <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl p-6 md:p-8 animate-scale-in">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white">Editar Empresa</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {successMsg ? (
              <div className="mt-6 space-y-4 py-8 text-center">
                <div className="mx-auto h-12 w-12 rounded-full bg-emerald-500/15 flex items-center justify-center text-emerald-400">
                  <Check className="h-6 w-6" />
                </div>
                <h4 className="text-base font-bold text-white">Empresa Atualizada!</h4>
                <p className="text-sm text-slate-400">
                  As alterações foram salvas com sucesso no banco de dados.
                </p>
              </div>
            ) : (
              <form action={formAction} className="mt-6 space-y-5">
                {/* ID Oculto */}
                <input type="hidden" name="id" value={company.id} />

                <div>
                  <label htmlFor="nome-edit" className="block text-sm font-medium text-slate-350">
                    Nome da Empresa
                  </label>
                  <input
                    id="nome-edit"
                    name="nome"
                    type="text"
                    required
                    disabled={isPending}
                    defaultValue={company.nome}
                    className="mt-1.5 block w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-white focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all disabled:opacity-50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="cnpj-edit" className="block text-sm font-medium text-slate-350">
                      CNPJ
                    </label>
                    <input
                      id="cnpj-edit"
                      name="cnpj"
                      type="text"
                      disabled={isPending}
                      defaultValue={company.cnpj || ''}
                      placeholder="00.000.000/0000-00"
                      className="mt-1.5 block w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label htmlFor="telefone-edit" className="block text-sm font-medium text-slate-350">
                      Telefone
                    </label>
                    <input
                      id="telefone-edit"
                      name="telefone"
                      type="text"
                      disabled={isPending}
                      defaultValue={company.telefone || ''}
                      placeholder="(00) 00000-0000"
                      className="mt-1.5 block w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-white placeholder-slate-550 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="plano-edit" className="block text-sm font-medium text-slate-350">
                      Plano Contratado
                    </label>
                    <select
                      id="plano-edit"
                      name="plano"
                      required
                      disabled={isPending}
                      defaultValue={company.plano}
                      className="mt-1.5 block w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-white focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all disabled:opacity-50"
                    >
                      <option value="Bronze">Bronze</option>
                      <option value="Silver">Silver</option>
                      <option value="Gold">Gold</option>
                      <option value="Platinum">Platinum</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="valor_mensalidade-edit" className="block text-sm font-medium text-slate-355">
                      Mensalidade (R$)
                    </label>
                    <input
                      id="valor_mensalidade-edit"
                      name="valor_mensalidade"
                      type="number"
                      step="0.01"
                      required
                      disabled={isPending}
                      defaultValue={company.valor_mensalidade}
                      className="mt-1.5 block w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-white focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="status_pagamento-edit" className="block text-sm font-medium text-slate-350">
                      Status Pagamento
                    </label>
                    <select
                      id="status_pagamento-edit"
                      name="status_pagamento"
                      required
                      disabled={isPending}
                      defaultValue={company.status_pagamento}
                      className="mt-1.5 block w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-white focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all disabled:opacity-50"
                    >
                      <option value="ativo">Ativo / Adimplente</option>
                      <option value="inadimplente">Inadimplente</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="ativo-edit" className="block text-sm font-medium text-slate-350">
                      Status de Acesso
                    </label>
                    <select
                      id="ativo-edit"
                      name="ativo"
                      required
                      disabled={isPending}
                      defaultValue={company.ativo ? 'true' : 'false'}
                      className="mt-1.5 block w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-white focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all disabled:opacity-50"
                    >
                      <option value="true">Liberado</option>
                      <option value="false">Bloqueado</option>
                    </select>
                  </div>
                </div>

                {state?.error && (
                  <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3.5 text-sm text-red-400 flex items-start gap-2.5">
                    <AlertCircle className="h-5 w-5 shrink-0" />
                    <span>{state.error}</span>
                  </div>
                )}

                <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    disabled={isPending}
                    className="rounded-xl border border-slate-750 px-4 py-2.5 text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition disabled:opacity-50 cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-700 shadow-lg shadow-cyan-600/15 disabled:opacity-50 cursor-pointer"
                  >
                    {isPending ? 'Salvando...' : 'Salvar Alterações'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}
