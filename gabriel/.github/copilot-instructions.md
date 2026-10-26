# Instruções do projeto Reserva

## Requisitos
- Aplicação full stack de reserva de equipamentos. O administrador gerencia equipamentos; usuários gerenciam apenas suas reservas.
- Backend Node.js/Express em módulos ES, separando rotas, controllers, services, schemas e middleware.
- PostgreSQL com Prisma e `@prisma/client` obrigatoriamente fixados em `7.10.0`; manter schema e migrations no repositório.
- Autenticação JWT, hash de senha com bcryptjs, papéis `ADMIN` e `USER`, validação Zod e erros JSON em português.
- Regra central: não permitir períodos ativos sobrepostos para o mesmo equipamento; validar datas também no backend.
- Frontend React com Tailwind CSS e plugin Vite oficiais fixados em `4.3.0`. Integrar-se à API usando `VITE_API_URL`.
- Nunca versionar `.env`, segredos, senhas, tokens ou dados reais. Manter `.env.example` sem segredos.
- Atualizar o README e lockfiles ao alterar dependências ou comandos.

## Estrutura existente
- `backend/prisma`: schema, seed e migrations.
- `backend/src`: API MVC, serviços, validações e configuração do banco.
- `frontend/src`: interface, autenticação e integração HTTP.
- `README.md`: configuração, execução, rotas, segurança e deploy.

## Progresso da configuração inicial
- [x] Verificar e criar este arquivo de instruções.
- [x] Confirmar escopo, tecnologia e permissões do tema.
- [x] Criar estrutura full stack na raiz existente.
- [x] Implementar API, banco, autenticação, autorização e regra de conflito.
- [x] Implementar interface React responsiva com fluxos integrados à API.
- [x] Instalar dependências e manter os lockfiles.
- [x] Validar sintaxe do backend, gerar Prisma Client 7.10.0 e compilar frontend.
- [x] Documentar instalação, variáveis, banco, rotas e publicação no README.
- [x] Nenhuma extensão adicional é necessária para iniciar o projeto.
- [ ] Executar localmente após configurar PostgreSQL e `.env`; não iniciar sem confirmação do usuário.
- [ ] Publicar frontend, API e banco, então registrar URL pública no README.

## Execução
- Backend: copiar `backend/.env.example` para `backend/.env`, preencher valores locais e seguir a sequência do README.
- Frontend: copiar `frontend/.env.example` para `frontend/.env`, instalar dependências e usar os scripts descritos no README.
- Não declarar deploy ou testes de banco como concluídos sem executá-los em ambiente configurado.
