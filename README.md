# Cinefly

Plataforma de streaming front-end — filmes, séries e documentários.

**Slogan:** *Decole no universo do cinema*

## Como abrir

Abra `index.html` no navegador, ou sirva a pasta localmente:

```bash
# Python
python -m http.server 5500

# Node (npx)
npx serve .
```

Depois acesse `http://localhost:5500`.

## Estrutura

```
Projeto-Cinefly/
├── index.html          # Home / catálogo
├── login.html          # Login (usuário/e-mail + senha)
├── cadastro.html       # Cadastro (formulário + QR Code)
├── perfil.html         # Área do cliente / edição completa
├── favoritos.html      # Lista de favoritos
├── IDENTIDADE.md       # Brand book (cores, fontes, logo)
├── css/
│   └── style.css       # Design system + layout
├── js/
│   ├── data.js         # Catálogo mock
│   ├── auth.js         # Cadastro, login, perfil, favoritos
│   ├── script.js       # UI (busca, carrosséis, modal)
│   ├── login.js
│   ├── cadastro.js
│   └── perfil.js
└── assets/
    ├── logo.svg
    ├── logo-mark.svg
    └── favicon.svg
```

## Funcionalidades

- Hero cinematográfico + trilhas horizontais (estilo streaming)
- Busca ao vivo, categorias, favoritos
- Cadastro por formulário ou QR Code
- Login com usuário/e-mail e senha
- Perfil editável: dados, endereço, senha, avatar, exclusão de conta
- Dados salvos no `localStorage` (sem backend)

## Identidade

Ver [IDENTIDADE.md](IDENTIDADE.md) — paleta âmbar/teal sobre tinta cinema, tipografia Syne + Manrope.
