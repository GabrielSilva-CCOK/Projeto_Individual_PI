var formularioModel = require("../models/formularioModel");

function puxarPergunta(req, res) {
    var numPergunta = req.body.numPergunta;
    if (numPergunta == undefined) {
        res.status(400).send("numPergunta está undefined!");
        return;
    }

    formularioModel.puxarPergunta(numPergunta).then(function (resultado) {
        if (resultado.length > 0) {
            const alternativas = resultado.map(row => ({ idAlternativa: row.idAlternativa, titulo: row.titulo }));
            res.status(200).json({
                idPergunta: resultado[0].idPergunta,
                enunciado: resultado[0].enunciado,
                alternativas: alternativas
            });
        } else {
            res.status(204).send("Nenhum resultado encontrado!");
        }
    }).catch(function (erro) {
        console.log(erro);
        console.log("\nHouve um erro ao coletar a pergunta! Erro: ", erro.sqlMessage);
        res.status(500).json(erro.sqlMessage);
    });
}

function listarPerguntas(req, res) {
    formularioModel.listarPerguntas().then(function (resultado) {
        if (resultado.length > 0) {
            const mapa = {};
            resultado.forEach(row => {
                const id = row.idPergunta;
                if (!mapa[id]) {
                    mapa[id] = { idPergunta: id, enunciado: row.enunciado, alternativas: [] };
                }
                mapa[id].alternativas.push({ idAlternativa: row.idAlternativa, titulo: row.titulo });
            });
            const perguntas = Object.values(mapa);
            res.status(200).json(perguntas);
        } else {
            res.status(204).send("Nenhum resultado encontrado!");
        }
    }).catch(function (erro) {
        console.log(erro);
        console.log("\nHouve um erro ao listar perguntas! Erro: ", erro.sqlMessage);
        res.status(500).json(erro.sqlMessage);
    });
}

function enviarResposta(req, res) {
    var idUsuario = req.body.id_usuario;
    var idPergunta = req.body.id_pergunta;
    var idAlternativa = req.body.id_alternativa;

    if (idUsuario == undefined) {
        res.status(400).send("id_usuario está undefined!");
    } else if (idPergunta == undefined) {
        res.status(400).send("id_pergunta está undefined!");
    } else if (idAlternativa == undefined) {
        res.status(400).send("id_alternativa está undefined!");
    } else {
        formularioModel.enviarResposta(idUsuario, idPergunta, idAlternativa)
            .then(function (resultado) {
                res.json(resultado);
            }).catch(function (erro) {
                console.log(erro);
                console.log("\nHouve um erro ao enviar a resposta! Erro: ", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            });
    }
}

module.exports = {
    puxarPergunta,
    listarPerguntas,
    enviarResposta
};
