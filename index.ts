import { Core } from "./core/core.ts";
import {
  criarCurso,
  criarAula,
  pegarCursos,
  pegarCurso,
  pegarAulas,
  pegarAula,
} from "./core/database.ts";

const core = new Core();

core.router.get("/curso/:slug", (req, res) => {
  const { slug } = req.params;
  const curso = pegarCurso(slug);
  if (curso) {
    res.status(200).json(curso);
  } else {
    res.status(404).json("curso não encontrado");
  }
});

core.router.get("/", (req, res) => {
    res.status(200).json("Success");
});

core.router.get("/curso/:curso/pegar", (req, res) => {
    res.status(200).json("Success");
});

core.router.get("/curso/:curso/delete", (req, res) => {
    res.status(200).json("Success");
});

core.router.get("/aula/:aula", (req, res) => {
    res.status(200).json("Aula");
});



core.init();
