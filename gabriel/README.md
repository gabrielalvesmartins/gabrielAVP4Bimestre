# Reserva — Gestão de reservas de equipamentos

Aplicação full stack para instituições que compartilham equipamentos. O administrador cadastra equipamentos; usuários autenticados consultam o catálogo e gerenciam suas próprias reservas. A API bloqueia conflitos de horário para um mesmo equipamento.

## Tecnologias

- Backend: Node.js, Express 5, arquitetura MVC, Zod e PostgreSQL.
- Persistência: Prisma ORM e Prisma Client **7.10.0** (versões fixadas).
- Segurança: JWT, bcryptjs e autorização por perfil.
- Frontend: React 19, Vite 8 e Tailwind CSS **4.3.0** com integração oficial `@tailwindcss/vite` **4.3.0**.
- Banco relacional: PostgreSQL.

## Requisitos

Node.js 20.19+ (ou 22.12+) e PostgreSQL 14+. Crie um banco vazio chamado `reservas` ou ajuste a URL de conexão.

## Executar localmente

### 1. Backend

No terminal, entre em `backend` e instale as dependências:

```sh
cd backend
npm install
```

Copie `.env.example` para `.env` e defina os dados da sua instalação PostgreSQL, um `JWT_SECRET` forte e valores próprios para `ADMIN_NAME`, `ADMIN_EMAIL` e `ADMIN_PASSWORD`. Não compartilhe nem versione o `.env`.

```sh
npm run db:generate
npm run db:deploy
npm run db:seed
npm run dev
```

A API inicia em `http://localhost:3000`; teste `GET /api/health`. Para desenvolver o schema antes de criar uma migration versionada, use `npm run db:migrate -- --name nome-da-alteracao`.

### 2. Frontend

Em outro terminal, entre em `frontend` e instale as dependências:

```sh
cd frontend
npm install
```

Copie `frontend/.env.example` para `frontend/.env` (a URL padrão local é `http://localhost:3000/api`) e inicie o Vite:

```sh
npm run dev
```

Abra o endereço local mostrado no terminal. Para validar a versão de produção, execute `npm run build` e `npm run preview` dentro de `frontend`.

## Primeiro acesso

O seed promove/cria a conta administradora identificada por `ADMIN_EMAIL`; a senha é definida por `ADMIN_PASSWORD` no ambiente local. O cadastro público cria apenas usuários comuns. Preserve as credenciais em segredo e altere-as antes de publicar.

## Regras de acesso e negócio

- Qualquer usuário autenticado pode consultar equipamentos e criar/consultar/alterar/cancelar as próprias reservas.
- Administradores podem criar, consultar, atualizar e excluir equipamentos e consultar reservas de todos os usuários.
- A API rejeita períodos inválidos ou no passado e reservas em que o término não seja posterior ao início.
- Períodos são tratados como intervalos semiabertos: uma reserva conflitante existe quando `início existente < término solicitado` e `término existente > início solicitado`; portanto, horários adjacentes são permitidos.
- Uma reserva não pode se sobrepor a outra reserva ativa do mesmo equipamento (`409 Conflict`). Equipamentos com reservas futuras/ativas não podem ser excluídos.
- Cancelar uma reserva altera seu status; não apaga o histórico.

## Rotas principais

Todas as rotas usam prefixo `/api`. Exceto cadastro, login e health, enviar `Authorization: Bearer <token>`.

| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| GET | `/health` | Público | Verificação da API |
| POST | `/auth/register` | Público | Cadastro de usuário (`name`, `email`, `password`) |
| POST | `/auth/login` | Público | Login, devolve JWT e perfil |
| GET | `/auth/me` | Autenticado | Perfil da sessão |
| GET | `/equipments` | Autenticado | Lista equipamentos |
| GET | `/equipments/:id` | Autenticado | Consulta equipamento |
| POST | `/equipments` | Admin | Cadastra equipamento |
| PATCH | `/equipments/:id` | Admin | Atualiza equipamento |
| DELETE | `/equipments/:id` | Admin | Exclui equipamento sem reserva futura |
| GET | `/reservations` | Autenticado | Reservas próprias; admin vê todas |
| GET | `/reservations/:id` | Dono/Admin | Consulta reserva |
| POST | `/reservations` | Autenticado | Cria reserva (`equipmentId`, `startsAt`, `endsAt`, `purpose`) |
| PATCH | `/reservations/:id` | Dono/Admin | Atualiza reserva própria |
| DELETE | `/reservations/:id` | Dono/Admin | Cancela reserva |

Datas de reserva devem estar em ISO-8601, por exemplo `2027-04-20T13:00:00.000Z`. Respostas de validação incluem mensagens em português; acesso sem JWT retorna `401`, operação sem permissão `403`, conflito de horário `409`.

## Estrutura

- `backend/src/routes`: rotas HTTP.
- `backend/src/controllers`: adaptação de requisição/resposta.
- `backend/src/services`: regras e operações Prisma.
- `backend/src/middleware` e `backend/src/schemas`: autenticação/autorização, erros e validação.
- `backend/prisma/schema.prisma` e `backend/prisma/migrations`: modelagem e migrations.
- `frontend/src`: interface React e integração com a API.

## Publicação

Configure o backend em uma plataforma Node.js e disponibilize PostgreSQL gerenciado. Defina `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `FRONTEND_URL` e credenciais de seed somente no ambiente do servidor. Execute `npm run db:deploy` no deploy e rode o seed uma única vez para inicializar o admin. Publique o frontend como site estático, configurando `VITE_API_URL` para a URL pública da API terminada em `/api`; o valor é compilado no cliente e não deve conter segredos. Configure CORS no servidor para o domínio publicado. Não há endereço público de deploy ainda.

## Fontes e licenças

A interface, incluindo cartões, tabelas, navegação, formulários e modal, foi criada para este projeto e utiliza CSS próprio junto à integração oficial Tailwind CSS para Vite; nenhum componente externo de terceiros foi copiado. Google Fonts (DM Sans e Manrope) são carregadas pelo CSS para tipografia.
