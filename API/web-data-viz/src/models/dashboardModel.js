var database = require("../database/config");

function participacao() {
    var instrucaoSql = `SELECT * FROM vwUsuariosCadastrados;`;
    return database.executar(instrucaoSql);
}

function conteudo() {
    var instrucaoSql = `SELECT * FROM vwConteudoPreferido;`;
    return database.executar(instrucaoSql);
}

function guilda() {
    var instrucaoSql = `SELECT * FROM vwJogadoresGuilda;`;
    return database.executar(instrucaoSql);
}

function veteranos() {
    var instrucaoSql = `SELECT * FROM vwTaxaVeteranos;`;
    return database.executar(instrucaoSql);
}

function classes() {
    var instrucaoSql = `SELECT * FROM vwPercClass;`;
    return database.executar(instrucaoSql);
}

function faccao() {
    var instrucaoSql = `SELECT * FROM vwPercFaccao;`;
    return database.executar(instrucaoSql);
}

function role() {
    var instrucaoSql = `SELECT * FROM vwPercRole;`;
    return database.executar(instrucaoSql);
}

function versao() {
    var instrucaoSql = `SELECT * FROM vwPercVersao;`;
    return database.executar(instrucaoSql);
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
