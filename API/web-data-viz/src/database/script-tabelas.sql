-- Arquivo de apoio, caso você queira criar tabelas como as aqui criadas para a API funcionar.
-- Você precisa executar os comandos no banco de dados para criar as tabelas,
-- ter este arquivo aqui não significa que a tabela em seu BD estará como abaixo!

/*
comandos para mysql server
*/
CREATE USER 'API'@'localhost' IDENTIFIED BY 'ApiInsert100#';
GRANT INSERT, SELECT, UPDATE, DELETE ON azeroth.* TO 'API'@'localhost';
FLUSH PRIVILEGES;
CREATE DATABASE azeroth;
USE azeroth;
CREATE TABLE usuario(
id INT PRIMARY KEY AUTO_INCREMENT, 
nome VARCHAR(255), 
email VARCHAR(255)NOT NULL UNIQUE, 
senha VARCHAR(255)NOT NULL);

CREATE TABLE pergunta(
idPergunta INT PRIMARY KEY AUTO_INCREMENT,
enunciado VARCHAR(255) NOT NULL);

CREATE TABLE alternativa(
idAlternativa INT PRIMARY KEY AUTO_INCREMENT,
titulo VARCHAR(255) NOT NULL,
fk_pergunta INT,
CONSTRAINT consFk_pergunta
FOREIGN KEY (fk_pergunta)
REFERENCES pergunta(idPergunta));

CREATE TABLE usuario_pergunta(
id_usuario INT NOT NULL,
id_pergunta INT NOT NULL,
id_alternativa INT NOT NULL,
PRIMARY KEY (id_usuario, id_pergunta, id_alternativa),
FOREIGN KEY (id_usuario)
        REFERENCES usuario(id),
FOREIGN KEY (id_pergunta)
        REFERENCES pergunta(idPergunta),
FOREIGN KEY (id_alternativa)
        REFERENCES alternativa(idAlternativa)
);
CREATE TABLE quest (
    idQuest INT PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(255) NOT NULL,
    descricao VARCHAR(255),
    concluida TINYINT(1) DEFAULT 0,
    fk_usuario INT NOT NULL,
    CONSTRAINT fk_quest_usuario
        FOREIGN KEY (fk_usuario)
        REFERENCES usuario(id)
);

INSERT INTO pergunta (enunciado) VALUES
('Qual é sua facção favorita em World of Warcraft?'),
('Qual é sua classe favorita para jogar?'),
('Qual função você mais gosta de desempenhar durante o jogo?'),
('Qual versão de World of Warcraft você prefere jogar?'),
('Qual conteúdo PvE você mais gosta de jogar?'),
('Há quantos anos você joga World of Warcraft?'),
('Você participa de alguma guilda?');

INSERT INTO alternativa (titulo, fk_pergunta) VALUES
-- 01. Facção favorita
('Horda', 1),
('Aliança', 1),

-- 02. Classe favorita
('Cavaleiro da Morte', 2),
('Caçador de Demônios', 2),
('Druida', 2),
('Evocador', 2),
('Caçador', 2),
('Mago', 2),
('Monge', 2),
('Paladino', 2),
('Sacerdote', 2),
('Ladino', 2),
('Xamã', 2),
('Bruxo', 2),
('Guerreiro', 2),

-- 03. Função favorita
('DPS', 3),
('Tank', 3),
('Healer', 3),

-- 04. Versão preferida
('Retail', 4),
('Classic', 4),
('Ambas', 4),

-- 05. Conteúdo PvE
('Raids', 5),
('Mítica+', 5),
('Imersões', 5),
('Mundo aberto', 5),
('Masmorras', 5),
('Coleções', 5),

-- 06. Anos de experiência
('Menos de 1 ano', 6),
('De 1 a 2 anos', 6),
('De 3 a 4 anos', 6),
('De 5 a 7 anos', 6),
('De 8 a 10 anos', 6),
('Mais de 10 anos', 6),
-- guilds 
('Sim, participo ativamente', 7),
('Sim, mas participo pouco', 7),
('Não', 7);

SELECT
	p.idPergunta,
    p.enunciado,
    a.titulo AS alternativa
FROM pergunta AS p
JOIN alternativa AS a
    ON p.idPergunta = a.fk_pergunta;


-- 0. Usuários cadastrados, formulários respondidos e participação
CREATE VIEW vwUsuariosCadastrados AS
SELECT
    COUNT(*) AS total_usuarios,
    (SELECT COUNT(DISTINCT id_usuario)
     FROM usuario_pergunta) AS formularios_respondidos,
    ROUND(
        (SELECT COUNT(DISTINCT id_usuario)
         FROM usuario_pergunta) * 100.0 / NULLIF(COUNT(*), 0),
        2
    ) AS porcentagem_participacao
FROM usuario;

-- 1. Facção favorita
CREATE VIEW vwPercFaccao AS
SELECT
    a.titulo AS faccao,
    COUNT(*) AS quantidade,
    ROUND(
        COUNT(*) * 100.0 /
        NULLIF(
            (SELECT COUNT(*)
             FROM usuario_pergunta
             WHERE id_pergunta = 1),
            0
        ),
        2
    ) AS porcentagem
FROM usuario_pergunta AS up
JOIN alternativa AS a
    ON a.idAlternativa = up.id_alternativa
   AND a.fk_pergunta = up.id_pergunta
WHERE up.id_pergunta = 1
GROUP BY a.idAlternativa, a.titulo
ORDER BY quantidade DESC;

-- 2. Classes favoritas
CREATE VIEW vwPercClass AS
SELECT
    a.titulo AS classe,
    COUNT(*) AS quantidade,
    ROUND(
        COUNT(*) * 100.0 /
        NULLIF(
            (SELECT COUNT(*)
             FROM usuario_pergunta
             WHERE id_pergunta = 2),
            0
        ),
        2
    ) AS porcentagem
FROM usuario_pergunta AS up
JOIN alternativa AS a
    ON a.idAlternativa = up.id_alternativa
   AND a.fk_pergunta = up.id_pergunta
WHERE up.id_pergunta = 2
GROUP BY a.idAlternativa, a.titulo
ORDER BY quantidade DESC;


-- 3. Roles favoritas
CREATE VIEW vwPercRole AS
SELECT
    a.titulo AS funcao,
    COUNT(*) AS quantidade,
    ROUND(
        COUNT(*) * 100.0 /
        NULLIF(
            (SELECT COUNT(*)
             FROM usuario_pergunta
             WHERE id_pergunta = 3),
            0
        ),
        2
    ) AS porcentagem
FROM usuario_pergunta AS up
JOIN alternativa AS a
    ON a.idAlternativa = up.id_alternativa
   AND a.fk_pergunta = up.id_pergunta
WHERE up.id_pergunta = 3
GROUP BY a.idAlternativa, a.titulo
ORDER BY quantidade DESC;

-- 4. Versão favorita
CREATE VIEW vwPercVersao AS
SELECT
    a.titulo AS versao,
    COUNT(*) AS quantidade,
    ROUND(
        COUNT(*) * 100.0 /
        NULLIF(
            (SELECT COUNT(*)
             FROM usuario_pergunta
             WHERE id_pergunta = 4),
            0
        ),
        2
    ) AS porcentagem
FROM usuario_pergunta AS up
JOIN alternativa AS a
    ON a.idAlternativa = up.id_alternativa
   AND a.fk_pergunta = up.id_pergunta
WHERE up.id_pergunta = 4
GROUP BY a.idAlternativa, a.titulo
ORDER BY quantidade DESC;

-- 5. Conteúdo PvE preferido
CREATE VIEW vwConteudoPreferido AS
SELECT
    a.titulo AS conteudo_preferido,
    COUNT(*) AS quantidade_votos,
    ROUND(
        COUNT(*) * 100.0 /
        NULLIF((SELECT COUNT(*) FROM usuario_pergunta WHERE id_pergunta = 5), 0),
        2
    ) AS porcentagem
FROM usuario_pergunta AS up
JOIN alternativa AS a
    ON a.idAlternativa = up.id_alternativa
   AND a.fk_pergunta = up.id_pergunta
WHERE up.id_pergunta = 5
GROUP BY a.idAlternativa, a.titulo
ORDER BY quantidade_votos DESC
LIMIT 1;

-- 6. Taxa de veteranos
CREATE VIEW vwTaxaVeteranos AS
SELECT
    COUNT(CASE WHEN a.titulo = 'Mais de 10 anos' THEN 1 END) AS total_veteranos,
    ROUND(
        COUNT(CASE WHEN a.titulo = 'Mais de 10 anos' THEN 1 END)
        * 100.0 / NULLIF(COUNT(*), 0),
        2
    ) AS porcentagem_veteranos
FROM usuario_pergunta AS up
JOIN alternativa AS a
    ON a.idAlternativa = up.id_alternativa
   AND a.fk_pergunta = up.id_pergunta
WHERE up.id_pergunta = 6;


-- 7. Jogadores que participam de guildas
CREATE VIEW vwJogadoresGuilda AS
SELECT
    COUNT(CASE WHEN a.titulo IN ('Sim, participo ativamente', 'Sim, mas participo pouco') THEN 1 END) AS jogadores_guilda,
    ROUND(
        COUNT(CASE WHEN a.titulo IN ('Sim, participo ativamente', 'Sim, mas participo pouco') THEN 1 END)
        * 100.0 / NULLIF(COUNT(*), 0),
        2
    ) AS porcentagem_guilda
FROM usuario_pergunta AS up
JOIN alternativa AS a
    ON a.idAlternativa = up.id_alternativa
   AND a.fk_pergunta = up.id_pergunta
WHERE up.id_pergunta = 7;











