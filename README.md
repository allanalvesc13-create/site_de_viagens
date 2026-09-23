# AlvesViagens

Sistema web de viagens desenvolvido com React + Vite no frontend e Django no backend.

O projeto simula uma plataforma de viagens com páginas de destinos, passagens, ofertas, serviços e informações institucionais. A aplicação também utiliza a API pública do IBGE para trabalhar com estados e municípios.

## Tecnologias

### Frontend

* React
* Vite
* React Router
* JavaScript
* HTML
* CSS

### Backend

* Python
* Django

### Integrações

* API do IBGE

## Funcionalidades

* Página inicial
* Página de destinos
* Página de passagens
* Página de ofertas
* Página de serviços
* Página sobre a empresa
* Sistema de cadastro e login
* Comunicação entre frontend e backend
* Consulta de estados e municípios

## Estrutura do projeto

```text
site_de_viagens/
├── m/
│   ├── manage.py
│   ├── accounts/
│   └── trips/
├── meu-frontend/
│   ├── src/
│   └── package.json
└── README.md
```

### Backend (`m/`)

Responsável pelo servidor Django, autenticação e regras da aplicação.

### Frontend (`meu-frontend/`)

Responsável pela interface desenvolvida em React.

## Rotas

| Rota         | Descrição       |
| ------------ | --------------- |
| `/`          | Página inicial  |
| `/destinos`  | Destinos        |
| `/passagens` | Passagens       |
| `/ofertas`   | Ofertas         |
| `/servicos`  | Serviços        |
| `/sobre`     | Sobre a empresa |

## Como executar

### Pré-requisitos

* Node.js
* Python 3
* Django

### Backend

```bash
cd m
python manage.py migrate
python manage.py runserver
```

### Frontend

```bash
cd meu-frontend
npm install
npm run dev
```

## Objetivo

Este projeto foi desenvolvido para अभ्यास em desenvolvimento web full-stack, com foco em frontend, backend, API e organização de aplicação com múltiplas páginas.

## Autor

Allan Alves
GitHub: https://github.com/allanalvesc13-create

