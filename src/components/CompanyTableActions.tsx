'use client'

import { useTransition } from 'react'
import { toggleCompanyAccess, deleteCompany } from '@/app/admin/empresas/actions'
import EditCompanyModal from './EditCompanyModal'
import { Ban, Unlock, Trash2 } from 'lucide-react'

interface CompanyTableActionsProps {
  company: {
    id: string
    nome: string
    plano: string
    valor_mensalidade: number
    status_pagamento: string
    ativo: boolean
  }
}

export default function CompanyTableActions({ company }: CompanyTableActionsProps) {
  const [isPending, startTransition] = useTransition()

  const handleToggleAccess = () => {
    const actionName = company.ativo ? 'Bloquear' : 'Liberar'
    if (confirm(`Tem certeza que deseja ${actionName} o acesso da empresa "${company.nome}"?`)) {
      startTransition(async () => {
        const res = await toggleCompanyAccess(company.id, company.ativo)
        if (!res.success) {
          alert(res.error || 'Erro ao alterar acesso.')
        } else {
          window.location.reload()
        }
      })
    }
  }

  const handleDelete = () => {
    if (confirm(`ATENÇÃO: Deletar a empresa "${company.nome}" removerá permanentemente TODOS os usuários, leads e agendamentos vinculados a ela.\n\nTem certeza que deseja prosseguir?`)) {
      startTransition(async () => {
        const res = await deleteCompany(company.id)
        if (!res.success) {
          alert(res.error || 'Erro ao deletar empresa.')
        } else {
          window.location.reload()
        }
      })
    }
  }

  return (
    <div className="flex items-center justify-end gap-2">
      {/* Botão de Editar */}
      <EditCompanyModal company={company} />

      {/* Botão de Bloquear/Liberar */}
      <button
        onClick={handleToggleAccess}
        disabled={isPending}
        className={`p-2 rounded-lg transition flex items-center justify-center cursor-pointer ${
          company.ativo 
            ? 'hover:bg-amber-500/10 text-amber-500 hover:text-amber-400' 
            : 'hover:bg-emerald-500/10 text-emerald-500 hover:text-emerald-400'
        } disabled:opacity-50`}
        title={company.ativo ? 'Bloquear Acesso' : 'Liberar Acesso'}
      >
        {company.ativo ? <Ban className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
      </button>

      {/* Botão de Excluir */}
      <button
        onClick={handleDelete}
        disabled={isPending}
        className="p-2 rounded-lg hover:bg-rose-500/10 text-rose-500 hover:text-rose-400 transition flex items-center justify-center cursor-pointer disabled:opacity-50"
        title="Excluir Empresa"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  )
}
