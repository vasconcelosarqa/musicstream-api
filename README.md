# 🎵 MusicStream API

Uma API REST de streaming de música construída com **Node.js + Express** e documentada com **Swagger**.

Ambiente controlado e estável para automação de testes com **Cypress**.

---

## 🚀 Quick Start

### Pré-requisitos
- Node.js v22+ (LTS)
- npm (vem com o Node.js)

### Instalação

```bash
# 1. Clone ou navegue até a pasta do projeto
cd musicstream-api

# 2. Instale as dependências
npm install

# 3. Inicie o servidor
npm start
```

Você deve ver algo como:
```
🎵 MusicStream API rodando!
Swagger UI  → http://localhost:3000/api-docs
Base URL    → http://localhost:3000/api/v1
Recursos disponíveis:
→ Artists   http://localhost:3000/api/v1/artists
→ Albums    http://localhost:3000/api/v1/albums
→ Users     http://localhost:3000/api/v1/users
Pressione CTRL+C para parar o servidor
```
---

## 📚 Acessar a API

### Swagger UI (Recomendado)
Abra no navegador: `http://localhost:3000/api-docs`

Lá você pode testar todos os endpoints de forma visual, sem precisar do Postman.

### Via Postman ou cURL
Base URL: `http://localhost:3000/api/v1`

Exemplo:
```bash
curl -X GET http://localhost:3000/api/v1/artists
```

---

## 🗂️ Recursos Disponíveis

### Artists (Artistas)
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/artists` | Listar todos os artistas |
| POST | `/artists` | Criar novo artista |
| GET | `/artists/{id}` | Buscar artista por ID |
| PUT | `/artists/{id}` | Atualizar artista |
| DELETE | `/artists/{id}` | Deletar artista |

**Exemplo de criação:**
```json
{
  "name": "Rammstein",
  "genre": "Industrial Metal",
  "country": "Germany",
  "active": true
}
```

---

### Albums (Álbuns)
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/albums` | Listar todos os álbuns |
| POST | `/albums` | Criar novo álbum |
| GET | `/albums/{id}` | Buscar álbum por ID |
| PUT | `/albums/{id}` | Atualizar álbum |
| DELETE | `/albums/{id}` | Deletar álbum |

**Exemplo de criação:**
```json
{
  "title": "Sehnsucht",
  "artistId": "1",
  "year": 1997,
  "genre": "Industrial Metal",
  "available": true
}
```

> ⚠️ O `artistId` deve corresponder a um artista existente, caso contrário retorna 404.

---

### Users (Usuários)
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/users` | Listar todos os usuários |
| POST | `/users` | Criar novo usuário |
| GET | `/users/{id}` | Buscar usuário por ID |
| PUT | `/users/{id}` | Atualizar usuário |
| DELETE | `/users/{id}` | Deletar usuário |

**Exemplo de criação:**
```json
{
  "username": "metalhead_2025",
  "email": "metal@musicstream.com",
  "plan": "premium",
  "active": true
}
```

> ⚠️ O campo `plan` aceita apenas: `"free"` ou `"premium"`. E-mails não podem ser duplicados.

---

## 📝 Notas Importantes

- **Banco de dados em memória:** Todos os dados são resetados quando você reinicia o servidor.
- **IDs gerados automaticamente:** Ao criar um recurso (POST), o ID é gerado com UUID v4.
- **Validações:** A API valida campos obrigatórios e tipos de dados. Tente enviar requests inválidas para testar cenários negativos.
- **CORS:** Por enquanto, não há restrição de CORS — qualquer origem pode fazer requisições.

---

## 📂 Estrutura do Projeto
```
musicstream-api/
├── .gitignore
├── package.json
├── server.js
└── README.md
```
---

## 🔧 Troubleshooting

**Erro: `npm: command not found`**
- Você precisa instalar o Node.js. Acesse: https://nodejs.org/

**Erro: `Port 3000 already in use`**
- Outra aplicação está usando a porta 3000. Você pode:
  - Fechar a aplicação que está usando a porta
  - Ou alterar a porta no `server.js` (linha que diz `const PORT = 3000`)

**Swagger não aparece**
- Certifique-se que o servidor está rodando (`npm start`)
- Acesse exatamente: `http://localhost:3000/api-docs`

---

**Criado para fins de educação em QA e automação de testes.**
