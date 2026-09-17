# AlvesViagens

Parte visual do sistema de viagens AlvesViagens. A aplicação usa React, Vite e React Router, com uma API Django executada separadamente.

## Requisitos

- Node.js e npm instalados
- Python 3.10 ou superior
- Django instalado no ambiente Python do servidor

## Estrutura

```text
viagens/
├── m/                  # Servidor Django
│   ├── manage.py
│   ├── accounts/       # Login e cadastro
│   └── trips/          # Viagens e API de viagens
└── meu-frontend/       # Parte visual React + Vite
    ├── src/
    └── package.json
```

## Instalação da parte visual

No PowerShell, entre na pasta do frontend e instale as dependências:

```powershell
cd "C:\Users\allan\OneDrive\Documentos\viagens\meu-frontend"
npm.cmd install
```

## Como executar

Abra dois terminais: um para o servidor e outro para a parte visual.

### Servidor Django

```powershell
cd "C:\Users\allan\OneDrive\Documentos\viagens\m"
python manage.py migrate
python manage.py runserver
```

O servidor ficará disponível em `http://127.0.0.1:8000/`.

### Site React

```powershell
cd "C:\Users\allan\OneDrive\Documentos\viagens\meu-frontend"
npm.cmd run dev -- --host 127.0.0.1
```

Abra `http://127.0.0.1:5173/` no navegador. O terminal do Vite precisa continuar aberto enquanto o site estiver sendo usado.

## Páginas do site

- `/` - início
- `/destinos` - destinos
- `/passagens` - passagens disponíveis
- `/ofertas` - ofertas
- `/servicos` - serviços
- `/sobre` - informações sobre a empresa

## Comandos úteis

```powershell
npm.cmd run build   # gera a versão de produção
npm.cmd run lint    # verifica problemas de lint
npm.cmd run preview # visualiza a versão compilada
```

## Observações

- No PowerShell, use `npm.cmd` caso `npm` seja bloqueado pela política de execução de scripts.
- A parte visual consulta a API Django em `http://127.0.0.1:8000/`.
- O site também consulta a API pública do IBGE para carregar estados e municípios.
- O servidor de desenvolvimento do Vite para quando o terminal ou o VS Code é fechado. Para acessá-lo novamente, execute o comando de desenvolvimento outra vez.
