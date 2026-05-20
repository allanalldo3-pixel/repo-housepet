# Documentação Técnica — House Pet

Esta documentação descreve a arquitetura, padrões de código e decisões técnicas do front-end do **House Pet**.

---

## 1. Arquitetura Geral

O projeto segue o princípio da **separação de responsabilidades** (*Separation of Concerns*), distribuído em três arquivos principais:

| Arquivo | Responsabilidade |
|---------|------------------|
| `index.html` | Estrutura semântica e marcação das telas (incluindo modais) |
| `assets/css/style.css` | Estilização visual, design system e responsividade |
| `assets/js/script.js` | Lógica de negócio, persistência simulada e interações dinâmicas |

### Por que uma única página com modais?

A escolha por **janelas modais sobrepostas** em vez de páginas separadas garante:

- **Navegação fluida** — o usuário não perde o contexto da vitrine ao realizar login
- **Performance** — sem requisições adicionais entre telas
- **Coerência mobile** — modais funcionam bem em qualquer resolução

---

## 2. Persistência de Dados (localStorage)

Durante a fase de prototipagem funcional do front-end, a persistência é simulada via `localStorage` do navegador. Três coleções são mantidas:

### `pets`
Lista de animais cadastrados.
```javascript
{
  id: "1",
  name: "Thor",
  type: "cachorro",        // cachorro | gato
  age: "adulto",           // filhote | adulto | idoso
  size: "grande",          // pequeno | medio | grande
  gender: "macho",         // macho | femea
  location: "Palmas - TO",
  image: "https://...",
  description: "...",
  vaccinated: true,
  neutered: true,
  ownerEmail: "tutor@exemplo.com"  // FK lógica para o usuário
}
```

### `users`
Lista de usuários cadastrados.
```javascript
{
  id: "1234567890",
  name: "Nome Completo",
  email: "email@exemplo.com",
  password: "senha",       // ⚠️ texto puro (apenas protótipo)
  phone: "(63) 90000-0000",
  acceptWhatsapp: true,    // Consentimento LGPD
  acceptCall: false,       // Consentimento LGPD
  createdAt: "ISO 8601"
}
```

### `adocoes`
Registro de solicitações de adoção (rastreabilidade).
```javascript
{
  id: "1234567890",
  petId: "1",
  petName: "Thor",
  adotanteEmail: "...",
  adotanteName: "...",
  tutorEmail: "...",
  status: "pendente",      // pendente | aprovado | recusado
  dataAdocao: "ISO 8601"
}
```

### `currentUser`
Sessão ativa (apenas quando logado).

> ⚠️ **Importante:** Esta abordagem é exclusiva da fase de prototipagem. Na próxima etapa, todos os dados serão migrados para o banco MySQL conforme modelo já documentado, com hash de senhas (bcrypt) e autenticação por token no servidor.

---

## 3. Mapeamento Tela ↔ Requisito

| Tela / Componente | Requisito Atendido |
|-------------------|---------------------|
| Modal de Cadastro com checkboxes de consentimento | RF01 |
| Modal de Login + adaptação do header | RF02 |
| Modal de Cadastro de Pet | RF04 |
| Modal de Edição de Pet & Botões de Ação do Dono | RF05 |
| Grid de cards na main | RF06 |
| Modal de Detalhes do Pet | RF07 |
| Grupo de filtros (selects + input) | RF08 |
| Input "Buscar por Nome" com listener `input` | RF09 |
| Botão "Quero Adotar!" no modal de detalhes | RF10 |
| Alert com dados do tutor após manifestação | RF11 |

---

## 4. Decisões de Design

### Identidade visual
- **Cor primária:** `#7c3aed` (roxo) — associada a confiança e cuidado
- **Cor de sucesso:** `#10b981` (verde) — usada no botão "Quero Adotar!"
- **Tipografia:** stack system fonts para performance e familiaridade

### Responsividade (RNF02)
- Grid de cards usa `auto-fill` com `minmax(300px, 1fr)` — adapta-se de 1 a N colunas conforme tamanho de tela
- Filtros usam `auto-fit` com `minmax(200px, 1fr)`
- Media query em `768px` reorganiza o header em coluna no mobile

### Acessibilidade
- Todos os campos de formulário têm `label` associado
- Botões usam tags `<button>` (não `<div>` clicáveis)
- Modais respeitam ordem de tab
- Contraste de cores segue WCAG AA

---

## 5. Fluxos Principais

### Fluxo de Cadastro e Login
```
1. Usuário clica em "Entrar"
2. Modal de Login abre
3. Clica em "Cadastre-se" → switch para modal de Registro
4. Preenche dados e marca preferências de contato (RF01)
5. Sistema valida (senha 6+ chars, e-mail único, senhas iguais)
6. Salva em localStorage e redireciona para Login (2s)
7. Usuário faz Login (RF02)
8. UI se adapta: oculta "Entrar", revela "Cadastrar Pet" e "Sair"
```

### Fluxo de Adoção
```
1. Visitante navega na vitrine (RF06)
2. Aplica filtros e/ou busca textual (RF08, RF09)
3. Clica em um card → modal de detalhes (RF07)
4. Clica em "Quero Adotar!"
   ├─ Se não está logado → vai para Login
   └─ Se está logado:
      ├─ Sistema registra adoção em localStorage (rastreabilidade)
      ├─ Busca dados do tutor (nome, telefone, preferências)
      └─ Exibe alert com canais de contato preferidos (RF11)
5. Contato externo via WhatsApp ou Ligação (RNF06)
```

---

## 6. Limitações Conhecidas

| Limitação | Razão | Solução planejada |
|-----------|-------|-------------------|
| Senhas em texto puro | Fase de prototipagem | Hash com bcrypt no back-end |
| Sem edição de perfil (RF03) | Fora do MVP | Implementação na próxima sprint |
| Dados perdidos ao limpar navegador | localStorage não é persistente | Migração para MySQL |
| Imagens dependem de URLs externas | Sem upload de arquivos | Upload + storage no back-end |

---

## 7. Testes Manuais Sugeridos

### Caminho feliz
1. ✅ Cadastrar novo usuário com WhatsApp marcado
2. ✅ Fazer login
3. ✅ Cadastrar um novo pet
4. ✅ Sair, fazer login com outro usuário
5. ✅ Manifestar interesse no pet cadastrado anteriormente
6. ✅ Verificar se o alert exibe os dados de contato corretos do tutor original

### Casos de validação
- Cadastrar com senhas diferentes → erro
- Cadastrar com senha < 6 caracteres → erro
- Cadastrar com e-mail já existente → erro
- Login com credenciais inválidas → erro
- Tentar adotar sem estar logado → redireciona para login
- Aplicar filtros que não retornam pets → exibe "Nenhum pet encontrado"

---

## 8. Convenções de Código

- **Identificadores HTML:** `camelCase` (ex: `petCard`, `loginBtn`)
- **Classes CSS:** `kebab-case` (ex: `pet-card`, `login-btn`)
- **Funções JS:** `camelCase` (ex: `renderPets`, `closeLoginModal`)
- **Constantes:** `camelCase` (ex: `initialPets`) — convenção do projeto
- **Comentários:** blocos `// ====` separam seções lógicas do código
