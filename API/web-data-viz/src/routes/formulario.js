var express = require("express");
var router = express.Router();

var formularioController = require("../controllers/formularioController");

//Recebendo os dados do html e direcionando para a função cadastrar de usuarioController.js
router.post("/resposta", function (req, res) {
    formularioController.enviarResposta(req, res);
})

router.post("/pergunta", function (req, res) {
    formularioController.PuxarPergunta(req, res);
});

module.exports = router;