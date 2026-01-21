# Docefy

Docefy é um sistema web para precificação de doces, confeitaria e receitas, pensado para ajudar confeiteiros(as) e pequenos negócios a calcular custos, margens e preços de venda de forma simples, rápida e profissional.

## ✨ Funcionalidades

- Cadastro e login de usuários (autenticação via Supabase)
- Cadastro de ingredientes, embalagens e produtos finais
- Precificação detalhada de receitas, considerando insumos, mão de obra, custos extras e margem de lucro
- Visualização de cards de resumo (custo médio, preço sugerido, lucro líquido)
- Dashboard moderno e responsivo
- Interface amigável e intuitiva

## 🛠️ Tecnologias Utilizadas

- **Vite** — Build tool para projetos modernos em React
- **React** — Biblioteca para construção de interfaces web
- **TypeScript** — Tipagem estática para maior segurança e produtividade
- **Tailwind CSS** — Utilitário CSS para estilização rápida e responsiva
- **Supabase** — Backend as a Service (banco de dados PostgreSQL, autenticação, API)

## 📦 Estrutura de Pastas

```
src/
  components/    # Componentes reutilizáveis (Navbar, etc)
  pages/         # Telas principais (Home, Login, Cadastro, Dashboard, etc)
  lib/           # Configuração do Supabase e utilitários globais
  styles/        # CSS/Tailwind customizado
```

## 🚀 Como rodar o projeto

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/docefy.git
cd docefy/docefy
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis (pegue os valores no painel do Supabase):

```
VITE_SUPABASE_URL=https://<sua-instancia>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

### 4. Rode o projeto

```bash
npm run dev
```

O app estará disponível em [http://localhost:5173](http://localhost:5173)

---

## 📝 Observações

- O projeto utiliza autenticação e banco de dados do Supabase. Certifique-se de criar as tabelas conforme o modelo do projeto.
- As variáveis de ambiente podem ser colocadas em `.env` ou `.env.local` (ambos são ignorados pelo git).
- Para produção, configure as variáveis de ambiente na plataforma de deploy (Vercel, Netlify, etc).

---

## 📄 Licença

Este projeto é open-source e está sob a licença MIT.