'use client'

import { useState, useActionState, startTransition } from 'react'
import { createCompany, type CreateCompanyState } from '@/app/admin/empresas/actions'
import { X, Copy, Check, Plus, AlertCircle } from 'lucide-react'

const initialState: CreateCompanyState = {
  success: false,
  empresa: null,
  error: null
}

export default function CreateCompanyModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [state, formAction, isPending] = useActionState(createCompany, initialState)

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleClose = () => {
    setIsOpen(false)
    // Reinicia o modal para o estado inicial quando fecha
    startTransition(() => {
      // Forçar atualização do actionState
      const form = document.createElement('form')
      const resetAction = () => ({ success: false, empresa: null, error: null })
      // Apenas fecha o modal e reseta o state local se necessário
    })
    window.location.reload() // Recarrega a página para puxar os dados atualizados
  }

  return (
    <>
      {/* Botão de Trigger */}
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center space-x-2 rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-700 shadow-lg shadow-cyan-600/15 cursor-pointer"
      >
        <Plus className="h-4 w-4" />
        <span>Cadastrar Nova Empresa</span>
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm animate-fade-in">
          {/* Modal Container */}
          <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl p-6 md:p-8 animate-scale-in">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white">Cadastrar Nova Empresa</h3>
              <button
                onClick={handleClose}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Conteúdo após criação com sucesso */}
            {state?.success && state.empresa ? (
              <div className="mt-6 space-y-6">
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-5 text-center space-y-3">
                  <div className="mx-auto h-12 w-12 rounded-full bg-emerald-500/15 flex items-center justify-center text-emerald-400">
                    <Check className="h-6 w-6" />
                  </div>
                  <h4 className="text-base font-bold text-white">Empresa Cadastrada!</h4>
                  <p className="text-sm text-slate-400">
                    A empresa <strong className="text-emerald-350">{state.empresa.nome}</strong> foi criada com sucesso no plano <strong className="text-emerald-350">{state.empresa.plano}</strong>.
                  </p>
                </div>

                {/* ID do Locatário (Copiar UUID) */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                    ID do Locatário (empresa_id)
                  </label>
                  <p className="text-xs text-slate-500">
                    Use este identificador nas chaves de ambiente para direcionamento de leads e isolamento RLS:
                  </p>
                  <div className="flex items-center gap-2 rounded-lg bg-slate-950 border border-slate-800 p-3 mt-1.5">
                    <code className="text-xs text-cyan-400 font-mono select-all flex-1 break-all">
                      {state.empresa.id}
                    </code>
                    <button
                      onClick={() => handleCopy(state.empresa.id)}
                      className="p-2 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition active:scale-95"
                      title="Copiar ID"
                    >
                      {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleClose}
                    className="w-full rounded-xl bg-slate-800 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-750 cursor-pointer"
                  >
                    Concluir e Voltar
                  </button>
                </div>
              </div>
            ) : (
              /* Formulário Padrão */
              <form action={formAction} className="mt-6 space-y-5">
                <div>
                  <label htmlFor="nome" className="block text-sm font-medium text-slate-350">
                    Nome da Empresa
                  </label>
                  <input
                    id="nome"
                    name="nome"
                    type="text"
                    required
                    disabled={isPending}
                    placeholder="Ex: Integra Soluções Ltda"
                    className="mt-1.5 block w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-white placeholder-slate-550 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all disabled:opacity-50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="plano" className="block text-sm font-medium text-slate-350">
                      Plano Contratado
                    </label>
                    <select
                      id="plano"
                      name="plano"
                      required
                      disabled={isPending}
                      className="mt-1.5 block w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-white focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all disabled:opacity-50"
                    >
                      <option value="Bronze">Bronze</option>
                      <option value="Silver">Silver</option>
                      <option value="Gold">Gold</option>
                      <option value="Platinum">Platinum</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="valor_mensalidade" className="block text-sm font-medium text-slate-355">
                      Valor Mensalidade (R$)
                    </label>
                    <input
                      id="valor_mensalidade"
                      name="valor_mensalidade"
                      type="number"
                      step="0.01"
                      required
                      disabled={isPending}
                      placeholder="Ex: 299.90"
                      className="mt-1.5 block w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-white placeholder-slate-550 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all disabled:opacity-50"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="status_pagamento" className="block text-sm font-medium text-slate-350">
                    Status de Pagamento
                  </label>
                  <div className="mt-1.5 flex gap-4">
                    <label className="flex items-center space-x-2.5 text-sm text-slate-300">
                      <input
                        type="radio"
                        name="status_pagamento"
                        value="ativo"
                        defaultChecked
                        disabled={isPending}
                        className="text-cyan-600 focus:ring-cyan-500/20"
                      />
                      <span>Ativo / Adimplente</span>
                    </label>
                    <label className="flex items-center space-x-2.5 text-sm text-slate-300">
                      <input
                        type="radio"
                        name="status_pagamento"
                        value="inadimplente"
                        disabled={isPending}
                        className="text-cyan-600 focus:ring-cyan-500/20"
                      />
                      <span>Inadimplente</span>
                    </label>
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
                    onClick={handleClose}
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
                    {isPending ? 'Salvando...' : 'Salvar Empresa'}
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
