var dashboardModel = require("../models/dashboardModel");

function participacao(req, res) {
    dashboardModel.participacao().then(function (resultado) {
        res.json(resultado);
    });
}

function conteudo(req, res) {
    dashboardModel.conteudo().then(function (resultado) {
        res.json(resultado);
    });
}

function guilda(req, res) {
    dashboardModel.guilda().then(function (resultado) {
        res.json(resultado);
    });
}

function veteranos(req, res) {
    dashboardModel.veteranos().then(function (resultado) {
        res.json(resultado);
    });
}

function classes(req, res) {
    dashboardModel.classes().then(function (resultado) {
        res.json(resultado);
    });
}

function faccao(req, res) {
    dashboardModel.faccao().then(function (resultado) {
        res.json(resultado);
    });
}

function role(req, res) {
    dashboardModel.role().then(function (resultado) {
        res.json(resultado);
    });
}

function versao(req, res) {
    dashboardModel.versao().then(function (resultado) {
        res.json(resultado);
    });
}

module.exports = {
    participacao,
    conteudo,
    guilda,
    veteranos,
    classes,
    faccao,
    role,
    versao
};
