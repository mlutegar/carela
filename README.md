# Carela 🚗💕

App mobile-first para mulheres que têm carro mas não conhecem mecânica.

## Funcionalidades

- **Diagnóstico por foto**: tire uma foto do painel ou do problema e receba uma análise da IA (Groq)
- **Lembretes de manutenção**: troca de óleo, pneus, IPVA, seguro, revisões
- **Histórico de serviços**: registro de custos e oficinas
- **Mapa de mecânicos**: busca por cidade com avaliações
- **Multi-veículo**: cadastre quantos carros quiser

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Backend | Django 5.x + DRF + PostgreSQL |
| Frontend | React 18 + Vite + Tailwind CSS v3 |
| Auth | JWT (djangorestframework-simplejwt) |
| Storage | Cloudinary |
| IA | Groq API (llama-4-scout) |
| Deploy | Railway |

---

## Setup Local

### Pré-requisitos

- Python 3.11+
- Node.js 20+
- PostgreSQL (ou use SQLite no dev)

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env
# edite o .env com suas chaves

python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

O backend sobe em `http://localhost:8000`.

### Frontend

```bash
cd frontend
npm install

cp .env.example .env
# edite VITE_API_URL se necessário

npm run dev
```

O frontend sobe em `http://localhost:5173`.

---

## Variáveis de Ambiente

### Backend (`backend/.env`)

```
SECRET_KEY=sua-chave-secreta
DEBUG=True
DATABASE_URL=                      # vazio = SQLite em dev
DJANGO_SETTINGS_MODULE=carela.settings.development
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
GROQ_API_KEY=
CORS_ALLOWED_ORIGINS=http://localhost:5173
ALLOWED_HOSTS=localhost,127.0.0.1
```

### Frontend (`frontend/.env`)

```
VITE_API_URL=http://localhost:8000
```

---

## Deploy no Railway

### 1. Crie uma conta em railway.app

### 2. Crie o projeto

```bash
railway login
railway init
```

### 3. Adicione PostgreSQL

No dashboard Railway: **New Service → Database → PostgreSQL**

### 4. Deploy Backend

```bash
cd backend
railway up
```

Configure as variáveis de ambiente no dashboard:

```
SECRET_KEY=...
DEBUG=False
DATABASE_URL=${{Postgres.DATABASE_URL}}
DJANGO_SETTINGS_MODULE=carela.settings.production
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
GROQ_API_KEY=...
CORS_ALLOWED_ORIGINS=https://SEU-FRONTEND.up.railway.app
ALLOWED_HOSTS=SEU-BACKEND.up.railway.app
```

### 5. Deploy Frontend

```bash
cd frontend
railway up
```

Configure:

```
VITE_API_URL=https://SEU-BACKEND.up.railway.app
```

### 6. Migrações automáticas

O `Procfile` já inclui `migrate` e `collectstatic` no release phase.

---

## Estrutura de Pastas

```
carela/
├── backend/
│   ├── carela/           # configurações Django
│   │   └── settings/
│   │       ├── base.py
│   │       ├── development.py
│   │       └── production.py
│   └── apps/
│       ├── users/        # autenticação e perfil
│       ├── vehicles/     # veículos
│       ├── maintenance/  # lembretes e logs
│       ├── diagnostics/  # IA por foto
│       └── mechanics/    # mecânicos e reviews
└── frontend/
    └── src/
        ├── api/          # axios + endpoints
        ├── components/   # componentes reutilizáveis
        ├── pages/        # telas do app
        ├── hooks/        # custom hooks
        └── store/        # estado global (Zustand)
```

---

## API Endpoints

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/auth/register/` | Cadastro |
| POST | `/api/auth/login/` | Login |
| POST | `/api/auth/refresh/` | Refresh token |
| GET/PATCH | `/api/auth/me/` | Perfil |
| GET/POST | `/api/vehicles/` | Veículos |
| GET/PATCH/DELETE | `/api/vehicles/{id}/` | Veículo específico |
| GET/POST | `/api/maintenance/reminders/` | Lembretes |
| PATCH | `/api/maintenance/reminders/{id}/` | Atualizar lembrete |
| GET/POST | `/api/maintenance/logs/` | Histórico |
| POST/GET | `/api/diagnostics/` | Diagnósticos |
| GET | `/api/diagnostics/{id}/` | Diagnóstico específico |
| GET | `/api/mechanics/` | Buscar mecânicos |
| POST | `/api/mechanics/{id}/reviews/` | Avaliar mecânico |
| GET | `/api/health/` | Health check |

---

## Licença

MIT
