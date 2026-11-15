var usuarioModel = require("../models/formularioModel");

function PuxarPergunta(req, res) {
        formularioModel.PuxarPergunta(num_pergunta)
            .then(
                function (resultadoPuxarPergunta) {
                    console.log(`\nResultados encontrados: ${resultadoPuxarPergunta.length}`);
                    console.log(`Resultados: ${JSON.stringify(resultadoPuxarPergunta)}`); // transforma JSON em String

                    if (resultadoAutenticar.length >= 1) {
                        for(let i = 0; i < resultadoAutenticar.length; i ++){
                            console.log(resultadoPuxarPergunta);
                        res.json({
                            enunciado: resultadoPuxarPergunta[i].enunciado,
                            titulo: resultadoPuxarPergunta[i].titulo
                        });
                        }
                        
                    }
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log("\nHouve um erro ao coletar as perguntas! Erro: ", erro.sqlMessage);
                    res.status(500).json(erro.sqlMessage);
                }
            );

}

function enviarResposta(req, res) {
    console.log('REQ.BODY cadastrar ->', req.body);
    // Crie uma variável que vá recuperar os valores do arquivo cadastro.html
    var nome = req.body.nomeServer;
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;
    // não usamos vínculo com empresas; ignora campos relacionados

    // Faça as validações dos valores
    if (nome == undefined) {
        res.status(400).send("Seu nome está undefined!");
    } else if (email == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else if (senha == undefined) {
        res.status(400).send("Sua senha está undefined!");
    } else {

        // Passe os valores como parâmetro e vá para o arquivo usuarioModel.js
        usuarioModel.cadastrar(nome, email, senha)
            .then(
                function (resultado) {
                    res.json(resultado);
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log(
                        "\nHouve um erro ao realizar o cadastro! Erro: ",
                        erro.sqlMessage
                    );
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }
}

module.exports = {
    autenticar,
    cadastrar
}
