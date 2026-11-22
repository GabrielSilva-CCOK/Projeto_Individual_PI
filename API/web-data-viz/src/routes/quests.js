var express = require("express");
var router = express.Router();

var questController = require("../controllers/questController");

router.get("/listar/:idUsuario", function (req, res) {
    questController.listar(req, res);
});

router.post("/cadastrar", function (req, res) {
    questController.cadastrar(req, res);
});

router.put("/atualizar/:idQuest", function (req, res) {
    questController.atualizar(req, res);
});

router.delete("/deletar/:idQuest", function (req, res) {
    questController.deletar(req, res);
});

module.exports = router;
