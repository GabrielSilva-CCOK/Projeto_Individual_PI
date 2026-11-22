var express = require("express");
var router = express.Router();

var dashboardController = require("../controllers/dashboardController");

router.get("/participacao", function (req, res) {
    dashboardController.participacao(req, res);
});

router.get("/conteudo", function (req, res) {
    dashboardController.conteudo(req, res);
});

router.get("/guilda", function (req, res) {
    dashboardController.guilda(req, res);
});

router.get("/veteranos", function (req, res) {
    dashboardController.veteranos(req, res);
});

router.get("/classes", function (req, res) {
    dashboardController.classes(req, res);
});

router.get("/faccao", function (req, res) {
    dashboardController.faccao(req, res);
});

router.get("/role", function (req, res) {
    dashboardController.role(req, res);
});

router.get("/versao", function (req, res) {
    dashboardController.versao(req, res);
});

module.exports = router;
