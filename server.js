const express = require('express');
const swaggerUi = require('swagger-ui-express');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.json());

// ─────────────────────────────────────────
// BANCO DE DADOS EM MEMÓRIA
// ─────────────────────────────────────────
let artists = [
  { id: '1', name: 'The Midnight', genre: 'Synthwave', country: 'USA', active: true },
  { id: '2', name: 'Daft Punk', genre: 'Electronic', country: 'France', active: false },
  { id: '3', name: 'Tame Impala', genre: 'Psychedelic Rock', country: 'Australia', active: true }
];

let albums = [
  { id: '1', title: 'Monsters', artistId: '1', year: 2022, genre: 'Synthwave', available: true },
  { id: '2', title: 'Random Access Memories', artistId: '2', year: 2013, genre: 'Electronic', available: true },
  { id: '3', title: 'Currents', artistId: '3', year: 2015, genre: 'Psychedelic Rock', available: true }
];

let users = [
  { id: '1', username: 'john_doe', email: 'john@musicstream.com', plan: 'premium', active: true },
  { id: '2', username: 'jane_doe', email: 'jane@musicstream.com', plan: 'free', active: true }
];

// ─────────────────────────────────────────
// SWAGGER — DEFINIÇÃO
// ─────────────────────────────────────────
const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'MusicStream API',
    version: '1.0.0',
    description: 'API de Streaming de Música — ambiente controlado para automação de testes.'
  },
  servers: [{ url: 'http://localhost:3000/api/v1', description: 'Local' }],
  tags: [
    { name: 'Artists', description: 'Gerenciamento de artistas' },
    { name: 'Albums', description: 'Gerenciamento de álbuns' },
    { name: 'Users', description: 'Gerenciamento de usuários' }
  ],
  paths: {
    '/artists': {
      get: {
        tags: ['Artists'],
        summary: 'Listar todos os artistas',
        parameters: [
          { name: 'genre', in: 'query', schema: { type: 'string' }, description: 'Filtrar por gênero' },
          { name: 'active', in: 'query', schema: { type: 'boolean' }, description: 'Filtrar por status ativo' }
        ],
        responses: {
          200: { description: 'Lista de artistas retornada com sucesso' },
          500: { description: 'Erro interno do servidor' }
        }
      },
      post: {
        tags: ['Artists'],
        summary: 'Cadastrar um novo artista',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'genre', 'country'],
                properties: {
                  name: { type: 'string', example: 'Rammstein' },
                  genre: { type: 'string', example: 'Industrial Metal' },
                  country: { type: 'string', example: 'Germany' },
                  active: { type: 'boolean', example: true }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'Artista criado com sucesso' },
          400: { description: 'Campos obrigatórios ausentes' }
        }
      }
    },
    '/artists/{id}': {
      get: {
        tags: ['Artists'],
        summary: 'Buscar artista por ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Artista encontrado' },
          404: { description: 'Artista não encontrado' }
        }
      },
      put: {
        tags: ['Artists'],
        summary: 'Atualizar artista',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  genre: { type: 'string' },
                  country: { type: 'string' },
                  active: { type: 'boolean' }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Artista atualizado com sucesso' },
          404: { description: 'Artista não encontrado' }
        }
      },
      delete: {
        tags: ['Artists'],
        summary: 'Deletar artista',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Artista deletado com sucesso' },
          404: { description: 'Artista não encontrado' }
        }
      }
    },
    '/albums': {
      get: {
        tags: ['Albums'],
        summary: 'Listar todos os álbuns',
        parameters: [
          { name: 'artistId', in: 'query', schema: { type: 'string' }, description: 'Filtrar por artista' },
          { name: 'available', in: 'query', schema: { type: 'boolean' }, description: 'Filtrar por disponibilidade' },
          { name: 'year', in: 'query', schema: { type: 'integer' }, description: 'Filtrar por ano' }
        ],
        responses: {
          200: { description: 'Lista de álbuns retornada com sucesso' }
        }
      },
      post: {
        tags: ['Albums'],
        summary: 'Cadastrar um novo álbum',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['title', 'artistId', 'year', 'genre'],
                properties: {
                  title: { type: 'string', example: 'Discovery' },
                  artistId: { type: 'string', example: '2' },
                  year: { type: 'integer', example: 2001 },
                  genre: { type: 'string', example: 'Electronic' },
                  available: { type: 'boolean', example: true }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'Álbum criado com sucesso' },
          400: { description: 'Campos obrigatórios ausentes' },
          404: { description: 'Artista não encontrado' }
        }
      }
    },
    '/albums/{id}': {
      get: {
        tags: ['Albums'],
        summary: 'Buscar álbum por ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Álbum encontrado' },
          404: { description: 'Álbum não encontrado' }
        }
      },
      put: {
        tags: ['Albums'],
        summary: 'Atualizar álbum',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  year: { type: 'integer' },
                  genre: { type: 'string' },
                  available: { type: 'boolean' }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Álbum atualizado com sucesso' },
          404: { description: 'Álbum não encontrado' }
        }
      },
      delete: {
        tags: ['Albums'],
        summary: 'Deletar álbum',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Álbum deletado com sucesso' },
          404: { description: 'Álbum não encontrado' }
        }
      }
    },
    '/users': {
      get: {
        tags: ['Users'],
        summary: 'Listar todos os usuários',
        parameters: [
          { name: 'plan', in: 'query', schema: { type: 'string' }, description: 'Filtrar por plano (free, premium)' },
          { name: 'active', in: 'query', schema: { type: 'boolean' }, description: 'Filtrar por status ativo' }
        ],
        responses: {
          200: { description: 'Lista de usuários retornada com sucesso' }
        }
      },
      post: {
        tags: ['Users'],
        summary: 'Criar um novo usuário',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['username', 'email', 'plan'],
                properties: {
                  username: { type: 'string', example: 'music_lover' },
                  email: { type: 'string', example: 'user@musicstream.com' },
                  plan: { type: 'string', enum: ['free', 'premium'], example: 'free' },
                  active: { type: 'boolean', example: true }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'Usuário criado com sucesso' },
          400: { description: 'Campos obrigatórios ausentes' }
        }
      }
    },
    '/users/{id}': {
      get: {
        tags: ['Users'],
        summary: 'Buscar usuário por ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Usuário encontrado' },
          404: { description: 'Usuário não encontrado' }
        }
      },
      put: {
        tags: ['Users'],
        summary: 'Atualizar usuário',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  username: { type: 'string' },
                  email: { type: 'string' },
                  plan: { type: 'string', enum: ['free', 'premium'] },
                  active: { type: 'boolean' }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Usuário atualizado com sucesso' },
          404: { description: 'Usuário não encontrado' }
        }
      },
      delete: {
        tags: ['Users'],
        summary: 'Deletar usuário',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Usuário deletado com sucesso' },
          404: { description: 'Usuário não encontrado' }
        }
      }
    }
  }
};

// ─────────────────────────────────────────
// SWAGGER UI
// ─────────────────────────────────────────
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
  customSiteTitle: 'MusicStream API',
  swaggerOptions: { defaultModelsExpandDepth: -1 }
}));

// ─────────────────────────────────────────
// ROTAS — ARTISTS
// ─────────────────────────────────────────
app.get('/api/v1/artists', (req, res) => {
  let result = [...artists];
  if (req.query.genre) result = result.filter(a => a.genre.toLowerCase() === req.query.genre.toLowerCase());
  if (req.query.active !== undefined) result = result.filter(a => a.active === (req.query.active === 'true'));
  res.status(200).json(result);
});

app.post('/api/v1/artists', (req, res) => {
  const { name, genre, country, active } = req.body;
  if (!name || !genre || !country) {
    return res.status(400).json({ code: 400, message: 'Campos obrigatórios ausentes: name, genre, country' });
  }
  const artist = { id: uuidv4(), name, genre, country, active: active !== undefined ? active : true };
  artists.push(artist);
  res.status(201).json(artist);
});

app.get('/api/v1/artists/:id', (req, res) => {
  const artist = artists.find(a => a.id === req.params.id);
  if (!artist) return res.status(404).json({ code: 404, message: 'Artista não encontrado' });
  res.status(200).json(artist);
});

app.put('/api/v1/artists/:id', (req, res) => {
  const idx = artists.findIndex(a => a.id === req.params.id);
  if (idx === -1) return res.status(404).json({ code: 404, message: 'Artista não encontrado' });
  artists[idx] = { ...artists[idx], ...req.body, id: req.params.id };
  res.status(200).json(artists[idx]);
});

app.delete('/api/v1/artists/:id', (req, res) => {
  const idx = artists.findIndex(a => a.id === req.params.id);
  if (idx === -1) return res.status(404).json({ code: 404, message: 'Artista não encontrado' });
  const deleted = artists.splice(idx, 1)[0];
  res.status(200).json({ code: 200, message: `Artista "${deleted.name}" deletado com sucesso` });
});

// ─────────────────────────────────────────
// ROTAS — ALBUMS
// ─────────────────────────────────────────
app.get('/api/v1/albums', (req, res) => {
  let result = [...albums];
  if (req.query.artistId) result = result.filter(a => a.artistId === req.query.artistId);
  if (req.query.year) result = result.filter(a => a.year === parseInt(req.query.year));
  if (req.query.available !== undefined) result = result.filter(a => a.available === (req.query.available === 'true'));
  res.status(200).json(result);
});

app.post('/api/v1/albums', (req, res) => {
  const { title, artistId, year, genre, available } = req.body;
  if (!title || !artistId || !year || !genre) {
    return res.status(400).json({ code: 400, message: 'Campos obrigatórios ausentes: title, artistId, year, genre' });
  }
  const artistExists = artists.find(a => a.id === artistId);
  if (!artistExists) return res.status(404).json({ code: 404, message: 'Artista não encontrado para o artistId informado' });
  const album = { id: uuidv4(), title, artistId, year, genre, available: available !== undefined ? available : true };
  albums.push(album);
  res.status(201).json(album);
});

app.get('/api/v1/albums/:id', (req, res) => {
  const album = albums.find(a => a.id === req.params.id);
  if (!album) return res.status(404).json({ code: 404, message: 'Álbum não encontrado' });
  res.status(200).json(album);
});

app.put('/api/v1/albums/:id', (req, res) => {
  const idx = albums.findIndex(a => a.id === req.params.id);
  if (idx === -1) return res.status(404).json({ code: 404, message: 'Álbum não encontrado' });
  albums[idx] = { ...albums[idx], ...req.body, id: req.params.id };
  res.status(200).json(albums[idx]);
});

app.delete('/api/v1/albums/:id', (req, res) => {
  const idx = albums.findIndex(a => a.id === req.params.id);
  if (idx === -1) return res.status(404).json({ code: 404, message: 'Álbum não encontrado' });
  const deleted = albums.splice(idx, 1)[0];
  res.status(200).json({ code: 200, message: `Álbum "${deleted.title}" deletado com sucesso` });
});

// ─────────────────────────────────────────
// ROTAS — USERS
// ─────────────────────────────────────────
app.get('/api/v1/users', (req, res) => {
  let result = [...users];
  if (req.query.plan) result = result.filter(u => u.plan === req.query.plan);
  if (req.query.active !== undefined) result = result.filter(u => u.active === (req.query.active === 'true'));
  res.status(200).json(result);
});

app.post('/api/v1/users', (req, res) => {
  const { username, email, plan, active } = req.body;
  if (!username || !email || !plan) {
    return res.status(400).json({ code: 400, message: 'Campos obrigatórios ausentes: username, email, plan' });
  }
  const emailExists = users.find(u => u.email === email);
  if (emailExists) return res.status(400).json({ code: 400, message: 'E-mail já cadastrado' });
  const validPlans = ['free', 'premium'];
  if (!validPlans.includes(plan)) {
    return res.status(400).json({ code: 400, message: 'Plano inválido. Use: free ou premium' });
  }
  const user = { id: uuidv4(), username, email, plan, active: active !== undefined ? active : true };
  users.push(user);
  res.status(201).json(user);
});

app.get('/api/v1/users/:id', (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ code: 404, message: 'Usuário não encontrado' });
  res.status(200).json(user);
});

app.put('/api/v1/users/:id', (req, res) => {
  const idx = users.findIndex(u => u.id === req.params.id);
  if (idx === -1) return res.status(404).json({ code: 404, message: 'Usuário não encontrado' });
  if (req.body.plan && !['free', 'premium'].includes(req.body.plan)) {
    return res.status(400).json({ code: 400, message: 'Plano inválido. Use: free ou premium' });
  }
  users[idx] = { ...users[idx], ...req.body, id: req.params.id };
  res.status(200).json(users[idx]);
});

app.delete('/api/v1/users/:id', (req, res) => {
  const idx = users.findIndex(u => u.id === req.params.id);
  if (idx === -1) return res.status(404).json({ code: 404, message: 'Usuário não encontrado' });
  const deleted = users.splice(idx, 1)[0];
  res.status(200).json({ code: 200, message: `Usuário "${deleted.username}" deletado com sucesso` });
});

// ─────────────────────────────────────────
// INICIALIZAÇÃO DO SERVIDOR
// ─────────────────────────────────────────
const PORT = 3000;
app.listen(PORT, () => {
  console.log('');
  console.log('  🎵 MusicStream API rodando!');
  console.log('');
  console.log(`  Swagger UI  → http://localhost:${PORT}/api-docs`);
  console.log(`  Base URL    → http://localhost:${PORT}/api/v1`);
  console.log('');
  console.log('  Recursos disponíveis:');
  console.log(`  → Artists   http://localhost:${PORT}/api/v1/artists`);
  console.log(`  → Albums    http://localhost:${PORT}/api/v1/albums`);
  console.log(`  → Users     http://localhost:${PORT}/api/v1/users`);
  console.log('');
  console.log('  Pressione CTRL+C para parar o servidor');
  console.log('');
});