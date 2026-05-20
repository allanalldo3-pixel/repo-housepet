# 🐾 House Pet — Plataforma de Adoção Responsável

[![Status](https://img.shields.io/badge/status-prot%C3%B3tipo%20funcional-success)]()
[![Front-end](https://img.shields.io/badge/front--end-HTML%20%7C%20CSS%20%7C%20JS-blue)]()
[![License](https://img.shields.io/badge/uso-acad%C3%AAmico-orange)]()

Plataforma web para adoção responsável de animais em **Palmas/TO** e região, desenvolvida como Atividade Multidisciplinar Integradora do 3º período do curso de **Tecnologia em Análise e Desenvolvimento de Sistemas** da **UNITINS — Campus Palmas**.

---

## 📖 Sobre o Projeto

O **House Pet** surge da observação de um problema concreto na região de Palmas: a divulgação de animais para adoção ocorre de forma fragmentada, espalhada em diversos grupos de redes sociais, dificultando o acompanhamento e a localização dos pets disponíveis.

A solução proposta é um **Portal de Adoção e Conectividade Animal** que centraliza essas informações em uma vitrine digital organizada, com filtros inteligentes, autenticação segura e fluxo de manifestação de interesse que respeita a LGPD através do consentimento explícito sobre os canais de contato.

### 🎯 Objetivo

Conectar protetores independentes, ONGs e cidadãos interessados na adoção consciente de animais, promovendo o bem-estar animal e a posse responsável através da tecnologia.

---

## 🛠️ Tecnologias Utilizadas

| Camada | Tecnologia |
|--------|------------|
| Marcação | HTML5 |
| Estilização | CSS3 (design responsivo Mobile-First) |
| Lógica | JavaScript ES6+ (Vanilla) |
| Persistência | localStorage (simulação de banco de dados) |
| Prototipagem | Figma |
| Modelagem | BPMN, UML (Diagrama de Casos de Uso), DER |

> **Nota:** O escopo desta entrega é o **Front-end** com simulação de persistência via `localStorage`, conforme escolha permitida pelas instruções da atividade. A modelagem do banco MySQL e a configuração da infraestrutura (Máquina Virtual Ubuntu + Apache) estão documentadas separadamente no documento `Visão Geral House Pet`.

---

## 🚀 Como Executar Localmente

A aplicação é 100% client-side e não exige instalação de dependências, banco de dados ou servidor.

### Opção 1: Abrir diretamente no navegador

```bash
# Clone o repositório
git clone https://github.com/SEU-USUARIO/house-pet.git
cd house-pet

# Abra o index.html no navegador de sua preferência
# (duplo clique no arquivo ou arraste para o navegador)
```

### Opção 2: Executar com servidor local (recomendado)

Para evitar problemas com algumas funcionalidades em navegadores mais restritivos, é recomendado servir os arquivos via servidor HTTP local.

**Com Python (já instalado na maioria dos sistemas):**
```bash
cd house-pet
python3 -m http.server 8000
# Acesse http://localhost:8000 no navegador
```

**Com Node.js:**
```bash
cd house-pet
npx http-server -p 8000
# Acesse http://localhost:8000 no navegador
```

**Com VSCode:** instale a extensão "Live Server" e clique com botão direito no `index.html` → "Open with Live Server".

### 👤 Credenciais para Teste

Para facilitar a demonstração, há um usuário pré-cadastrado:

- **E-mail:** `demo@housepet.com`
- **Senha:** `demo1234`

Ou crie sua própria conta clicando em **"Entrar"** → **"Cadastre-se"**.

---

## ✨ Funcionalidades Implementadas

Todos os Requisitos Funcionais (RF) e Não Funcionais (RNF) estão mapeados no documento `Visão Geral House Pet`. Esta versão front-end implementa:

### Gestão de Usuários
- ✅ **RF01** — Cadastro com captura de preferências de contato (LGPD)
- ✅ **RF02** — Login/Logout com adaptação dinâmica da interface
- ⏳ **RF03** — Edição de perfil (planejado para próxima iteração)

### Gestão de Pets
- ✅ **RF04** — Cadastro estruturado com status clínico (vacinado/castrado)
- ✅ **RF05** — Edição/exclusão de pets pelo tutor (implementado nesta versão)
- ✅ **RF06** — Dashboard com vitrine em grid responsivo
- ✅ **RF07** — Visualização imersiva de detalhes em modal

### Busca e Filtros
- ✅ **RF08** — Filtragem multicritério combinada (tipo, idade, porte, localização)
- ✅ **RF09** — Busca textual em tempo real (on-input)

### Interação e Adoção
- ✅ **RF10** — Manifestação de interesse formal ("Quero Adotar!")
- ✅ **RF11** — Exibição dos dados de contato do tutor conforme preferências LGPD

### Qualidades Não Funcionais
- ✅ **RNF02** — Design responsivo Mobile-First
- ✅ **RNF06** — Comunicação descentralizada (sem chat interno)

---

## 📁 Estrutura do Projeto

```
house-pet/
├── index.html              # Página principal com todas as telas (modais)
├── assets/
│   ├── css/
│   │   └── style.css       # Estilização e responsividade
│   └── js/
│       └── script.js       # Lógica de negócio e interações
├── docs/
│   ├── DOCUMENTACAO.md     # Documentação técnica detalhada
│   └── REQUISITOS.md       # Lista completa de RF e RNF
└── README.md
```

---

## 🖼️ Telas do Sistema

| Tela | Descrição |
|------|-----------|
| **Dashboard** | Vitrine principal com cards dos pets disponíveis |
| **Login** | Autenticação com e-mail e senha |
| **Cadastro de Usuário** | Registro com preferências de contato (WhatsApp/Ligação) |
| **Cadastro de Pet** | Formulário para tutores cadastrarem animais |
| **Detalhes do Pet** | Modal imersivo com todas as informações |
| **Solicitação de Adoção** | Manifestação de interesse com exibição dos dados do tutor |

---

## 🗺️ Roadmap (Próximas Etapas)

- [ ] Implementação do back-end (PHP + MySQL)
- [ ] Integração com banco de dados real
- [x] Edição e exclusão de pets pelo tutor (RF05)
- [ ] Edição de perfil do usuário (RF03)
- [ ] Módulo de animais perdidos
- [ ] Aplicativo mobile nativo

---

## 👥 Equipe

| Integrante | E-mail Institucional |
|------------|----------------------|
| Alan Aldo do Vale | — |
| Adriel Carvalho Leite | — |
| Andreia Alves Marques | — |
| Eduardo dos Santos Silva | — |
| Ester Moraes de Siqueira | — |

**Curso:** Tecnologia em Análise e Desenvolvimento de Sistemas (TADS)
**Instituição:** Universidade Estadual do Tocantins — UNITINS
**Campus:** Palmas/TO
**Período:** 3º Período — 2026.1

### Disciplinas Integradas
- Engenharia de Requisitos
- Banco de Dados I
- Redes de Computadores I
- Programação para Web I

---

## 📄 Licença

Este projeto foi desenvolvido para fins acadêmicos como parte da Atividade Multidisciplinar Integradora da UNITINS. Os arquivos de mídia (fotos de pets) são exemplos de domínio público obtidos do Unsplash.

---

<p align="center">
  Feito com 🐾 em Palmas/TO
</p>
