-- Script de Criação de Tabelas e Políticas de RLS para o Hubly Pro (CRM SaaS Multi-Tenant com Super Admin e Agenda)

-- Habilitar extensão para geração de UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =========================================================================
-- 1. CRIAÇÃO E ATUALIZAÇÃO DAS TABELAS
-- =========================================================================

-- Tabela 1: empresas
CREATE TABLE IF NOT EXISTS public.empresas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome TEXT NOT NULL,
    plano TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Adicionar colunas para o Super Admin
ALTER TABLE public.empresas ADD COLUMN IF NOT EXISTS status_pagamento TEXT DEFAULT 'ativo';
ALTER TABLE public.empresas ADD COLUMN IF NOT EXISTS valor_mensalidade NUMERIC DEFAULT 0.00;
ALTER TABLE public.empresas ADD COLUMN IF NOT EXISTS ativo BOOLEAN DEFAULT true;

-- Tabela 2: usuarios (perfis vinculados aos usuários de auth.users e suas empresas)
CREATE TABLE IF NOT EXISTS public.usuarios (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    empresa_id UUID REFERENCES public.empresas(id) ON DELETE CASCADE,
    nome TEXT,
    role TEXT DEFAULT 'admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabela 3: leads
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    empresa_id UUID REFERENCES public.empresas(id) ON DELETE CASCADE NOT NULL,
    nome TEXT NOT NULL,
    telefone TEXT,
    servico TEXT,
    status TEXT DEFAULT 'novo',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabela 4: agendamentos (Aprimorada para Visitas e Instalações)
DROP TABLE IF EXISTS public.agendamentos CASCADE;

CREATE TABLE public.agendamentos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    empresa_id UUID REFERENCES public.empresas(id) ON DELETE CASCADE NOT NULL,
    nome_cliente TEXT NOT NULL,
    tipo TEXT NOT NULL, -- 'visita' ou 'instalacao'
    status TEXT DEFAULT 'pendente', -- 'pendente', 'confirmado', 'concluido', 'cancelado'
    descricao TEXT,
    data_hora TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =========================================================================
-- 2. HABILITAR ROW LEVEL SECURITY (RLS)
-- =========================================================================

ALTER TABLE public.empresas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agendamentos ENABLE ROW LEVEL SECURITY;

-- =========================================================================
-- 3. FUNÇÕES DE SUPORTE SECURITY DEFINER
-- =========================================================================

-- Função 1: Obter o empresa_id do usuário autenticado
CREATE OR REPLACE FUNCTION public.get_auth_user_empresa_id()
RETURNS UUID AS $$
    SELECT empresa_id FROM public.usuarios WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER SET search_path = public;

-- Função 2: Obter a role do usuário autenticado (super_admin, tenant_admin, etc.)
CREATE OR REPLACE FUNCTION public.get_auth_user_role()
RETURNS TEXT AS $$
    SELECT role FROM public.usuarios WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER SET search_path = public;

-- =========================================================================
-- 4. REMOVER POLÍTICAS ANTIGAS (Prevenir conflitos)
-- =========================================================================

DROP POLICY IF EXISTS "empresas_tenant_policy" ON public.empresas;
DROP POLICY IF EXISTS "usuarios_tenant_policy" ON public.usuarios;
DROP POLICY IF EXISTS "leads_tenant_policy" ON public.leads;

DROP POLICY IF EXISTS "empresas_super_and_tenant_policy" ON public.empresas;
DROP POLICY IF EXISTS "usuarios_super_and_tenant_policy" ON public.usuarios;
DROP POLICY IF EXISTS "leads_super_and_tenant_policy" ON public.leads;
DROP POLICY IF EXISTS "agendamentos_super_and_tenant_policy" ON public.agendamentos;

-- =========================================================================
-- 5. NOVAS POLÍTICAS DE RLS (Com suporte a Super Admin)
-- =========================================================================

-- Políticas para: empresas
CREATE POLICY "empresas_super_and_tenant_policy" ON public.empresas
    FOR ALL
    TO authenticated
    USING (
        public.get_auth_user_role() = 'super_admin'
        OR id = public.get_auth_user_empresa_id()
    )
    WITH CHECK (
        public.get_auth_user_role() = 'super_admin'
        OR id = public.get_auth_user_empresa_id()
    );

-- Políticas para: usuarios
CREATE POLICY "usuarios_super_and_tenant_policy" ON public.usuarios
    FOR ALL
    TO authenticated
    USING (
        public.get_auth_user_role() = 'super_admin'
        OR empresa_id = public.get_auth_user_empresa_id()
        OR id = auth.uid()
    )
    WITH CHECK (
        public.get_auth_user_role() = 'super_admin'
        OR empresa_id = public.get_auth_user_empresa_id()
        OR id = auth.uid()
    );

-- Políticas para: leads
CREATE POLICY "leads_super_and_tenant_policy" ON public.leads
    FOR ALL
    TO authenticated
    USING (
        public.get_auth_user_role() = 'super_admin'
        OR empresa_id = public.get_auth_user_empresa_id()
    )
    WITH CHECK (
        public.get_auth_user_role() = 'super_admin'
        OR empresa_id = public.get_auth_user_empresa_id()
    );

-- Políticas para: agendamentos
CREATE POLICY "agendamentos_super_and_tenant_policy" ON public.agendamentos
    FOR ALL
    TO authenticated
    USING (
        public.get_auth_user_role() = 'super_admin'
        OR empresa_id = public.get_auth_user_empresa_id()
    )
    WITH CHECK (
        public.get_auth_user_role() = 'super_admin'
        OR empresa_id = public.get_auth_user_empresa_id()
    );
