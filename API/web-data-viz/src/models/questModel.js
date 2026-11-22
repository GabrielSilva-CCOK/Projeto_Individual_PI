var database = require("../database/config");

function listar(idUsuario) {
    var instrucaoSql = `
        SELECT idQuest, titulo, descricao, concluida FROM quest WHERE fk_usuario = ${idUsuario} ORDER BY idQuest;
    `;
    return database.executar(instrucaoSql);
}

function cadastrar(titulo, descricao, idUsuario) {
    var instrucaoSql = `
        INSERT INTO quest (titulo, descricao, fk_usuario) VALUES ('${titulo}', '${descricao}', ${idUsuario});
    `;
    return database.executar(instrucaoSql);
}

function atualizar(idQuest, concluida) {
    var instrucaoSql = `
        UPDATE quest SET concluida = ${concluida} WHERE idQuest = ${idQuest};
    `;
    return database.executar(instrucaoSql);
}

function deletar(idQuest) {
    var instrucaoSql = `
        DELETE FROM quest WHERE idQuest = ${idQuest};
    `;
    return database.executar(instrucaoSql);
}

module.exports = {
    listar,
    cadastrar,
    atualizar,
    deletar
};
