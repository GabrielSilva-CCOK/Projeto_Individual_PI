var database = require("../database/config");

function PuxarPergunta(num_pergunta) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function entrar(): ", email, senha)
    var instrucaoSql = `
        SELECT p.enunciado, a.titulo FROM pergunta AS p
        JOIN alternativa AS a
        ON a.fk_pergunta = p.idPergunta
        WHERE p.idPergunta = ${num_pergunta};`;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}
function EnviarResposta(id_user, id_pergunta, id_alternativa) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrar():", nome, email, senha);
    
    var instrucaoSql = `
        INSERT INTO usuario_pergunta
        (id_usuario, id_pergunta, id_alternativa) VALUES ('${id_user}', '${id_pergunta}', '${id_alternativa}');
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    PuxarPergunta,
    EnviarResposta
};