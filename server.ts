import { createServer } from 'node:http';
import { Router } from './router.ts';
import { customRequest } from './custom-request.ts';
import { customResponse } from './custom-response.ts';
import {
  criarCurso,
  criarAula,
  pegarCursos,
  pegarCurso,
  pegarAulas,
  pegarAula,
} from './database.ts';

const router = new Router();

router.post('/cursos', (req, res) => {
  const { slug, nome, descricao } = req.body;
  const criado = criarCurso({ slug, nome, descricao });
  if (criado) {
    res.status(201).json('curso criado');
  } else {
    res.status(400).json('erro ao criar curso');
  }
});

router.post('/aulas', (req, res) => {
  const { slug, nome, cursoSlug } = req.body;
  const criada = criarAula({ slug, nome, cursoSlug });
  if (criada) {
    res.status(201).json('aula criada');
  } else {
    res.status(400).json('erro ao criar aula');
  }
});

router.get('/cursos', (req, res) => {
  const cursos = pegarCursos();
  if (cursos && cursos.length) {
    res.status(200).json(cursos);
  } else {
    res.status(404).json('cursos não encontrados');
  }
});

router.get('/curso', (req, res) => {
  const slug = req.query.get('slug');
  const curso = pegarCurso(slug);
  if (curso) {
    res.status(200).json(curso);
  } else {
    res.status(404).json('curso não encontrado');
  }
});

router.get('/aulas', (req, res) => {
  const curso = req.query.get('curso');
  const aulas = pegarAulas(curso);
  if (aulas && aulas.length) {
    res.status(200).json(aulas);
  } else {
    res.status(404).json('aulas não encontradas');
  }
});

router.get('/aula', (req, res) => {
  const curso = req.query.get('curso');
  const slug = req.query.get('slug');
  const aula = pegarAula(curso, slug);
  if (aula) {
    res.status(200).json(aula);
  } else {
    res.status(404).json('aula não encontrada');
  }
});

const server = createServer(async (request, response) => {
  const req = await customRequest(request);
  const res = customResponse(response);

  const handler = router.find(req.method || '', req.pathname);
  if (handler) {
    handler(req, res);
  } else {
    res.status(404).end('Não encontrada');
  }
});

server.listen(3000, () => {
  console.log('Server: http://localhost:3000');
});
