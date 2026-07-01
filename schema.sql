-- Script de Criação de Tabelas e Políticas de RLS para o Hubly Pro (CRM SaaS Multi-Tenant)

-- Habilitar extensão para geração de UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =========================================================================
-- 1. CRIAÇÃO DAS TABELAS
-- =========================================================================

-- Tabela 1: empresas
CREATE TABLE IF NOT EXISTS public.empresas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome TEXT NOT NULL,
    plano TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

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

-- =========================================================================
-- 2. HABILITAR ROW LEVEL SECURITY (RLS)
-- =========================================================================

ALTER TABLE public.empresas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- =========================================================================
-- 3. FUNÇÃO DE SUPORTE SECURITY DEFINER
-- =========================================================================
-- Uma função security definer roda com privilégios de administrador (bypassing RLS).
-- Isso é crítico para evitar loops de recursão infinita ao consultar a tabela usuarios
-- de dentro da própria política de RLS da tabela usuarios.

CREATE OR REPLACE FUNCTION public.get_auth_user_empresa_id()
RETURNS UUID AS $$
    SELECT empresa_id FROM public.usuarios WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER SET search_path = public;

-- =========================================================================
-- 4. POLÍTICAS DE RLS (Tenant Separation)
-- =========================================================================

-- Políticas para: empresas
-- Permite leitura e escrita apenas para a empresa vinculada ao usuário autenticado.
CREATE POLICY "empresas_tenant_policy" ON public.empresas
    FOR ALL
    TO authenticated
    USING (id = public.get_auth_user_empresa_id())
    WITH CHECK (id = public.get_auth_user_empresa_id());

-- Políticas para: usuarios
-- Permite que o usuário acesse perfis da mesma empresa, além de permitir o acesso
-- ao seu próprio registro (útil na fase de registro inicial, antes do vinculo completo).
CREATE POLICY "usuarios_tenant_policy" ON public.usuarios
    FOR ALL
    TO authenticated
    USING (empresa_id = public.get_auth_user_empresa_id() OR id = auth.uid())
    WITH CHECK (empresa_id = public.get_auth_user_empresa_id() OR id = auth.uid());

-- Políticas para: leads
-- Garante que o usuário autenticado só possa interagir com os leads da sua própria empresa.
CREATE POLICY "leads_tenant_policy" ON public.leads
    FOR ALL
    TO authenticated
    USING (empresa_id = public.get_auth_user_empresa_id())
    WITH CHECK (empresa_id = public.get_auth_user_empresa_id());
