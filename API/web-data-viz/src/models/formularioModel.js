var database = require("../database/config");

function puxarPergunta(questionId) {
    console.log("ACESSEI O formularioModel - puxarPergunta");
    var instrucaoSql = `
        SELECT p.idPergunta AS idPergunta, p.enunciado, a.idAlternativa AS idAlternativa, a.titulo
        FROM pergunta AS p
        JOIN alternativa AS a
            ON a.fk_pergunta = p.idPergunta
        WHERE p.idPergunta = ${questionId};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function listarPerguntas() {
    console.log("ACESSEI O formularioModel - listarPerguntas");
    var instrucaoSql = `
        SELECT p.idPergunta AS idPergunta, p.enunciado, a.idAlternativa AS idAlternativa, a.titulo
        FROM pergunta AS p
        JOIN alternativa AS a
            ON a.fk_pergunta = p.idPergunta
        ORDER BY p.idPergunta;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function enviarResposta(userId, questionId, alternativeId) {
    console.log("ACESSEI O formularioModel - enviarResposta", userId, questionId, alternativeId);
    var instrucaoDelete = `
        DELETE FROM usuario_pergunta
        WHERE id_usuario = ${userId} AND id_pergunta = ${questionId};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoDelete);
    return database.executar(instrucaoDelete).then(function (resultado) {
        var instrucaoInsert = `
            INSERT INTO usuario_pergunta (id_usuario, id_pergunta, id_alternativa) VALUES (${userId}, ${questionId}, ${alternativeId});
        `;
        console.log("Executando a instrução SQL: \n" + instrucaoInsert);
        return database.executar(instrucaoInsert);
    });
}

module.exports = {
    puxarPergunta,
    listarPerguntas,
    enviarResposta
};
