var express = require("express");
var router = express.Router();

var formularioController = require("../controllers/formularioController");

router.post("/resposta", function (req, res) {
    formularioController.enviarResposta(req, res);
})

router.post("/pergunta", function (req, res) {
    formularioController.puxarPergunta(req, res);
});

router.get("/perguntas", function (req, res) {
    formularioController.listarPerguntas(req, res);
});

module.exports = router;
