var questModel = require("../models/questModel");

function listar(req, res) {
    var idUsuario = req.params.idUsuario;

    questModel.listar(idUsuario).then(function (resultado) {
        res.json(resultado);
    });
}

function cadastrar(req, res) {
    var titulo = req.body.tituloServer;
    var descricao = req.body.descricaoServer;
    var idUsuario = req.body.idUsuarioServer;

    questModel.cadastrar(titulo, descricao, idUsuario).then(function (resultado) {
        res.json(resultado);
    });
}

function atualizar(req, res) {
    var idQuest = req.params.idQuest;
    var concluida = req.body.concluidaServer;

    questModel.atualizar(idQuest, concluida).then(function (resultado) {
        res.json(resultado);
    });
}

function deletar(req, res) {
    var idQuest = req.params.idQuest;

    questModel.deletar(idQuest).then(function (resultado) {
        res.json(resultado);
    });
}

module.exports = {
    listar,
    cadastrar,
    atualizar,
    deletar
};
