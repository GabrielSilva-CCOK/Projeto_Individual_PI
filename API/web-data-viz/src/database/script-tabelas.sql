-- Arquivo de apoio, caso você queira criar tabelas como as aqui criadas para a API funcionar.
-- Você precisa executar os comandos no banco de dados para criar as tabelas,
-- ter este arquivo aqui não significa que a tabela em seu BD estará como abaixo!

/*
comandos para mysql server
*/
CREATE USER 'API'@'localhost' IDENTIFIED BY 'ApiInsert100#';
GRANT INSERT, SELECT ON azeroth.* TO 'API'@'localhost';
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

INSERT INTO pergunta (enunciado) VALUES
('Qual é sua facção favorita em World of Warcraft?'),
('Qual é sua classe favorita para jogar?'),
('Qual função você mais gosta de desempenhar durante o jogo?'),
('Qual versão de World of Warcraft você prefere jogar?'),
('Com que frequência você costuma jogar World of Warcraft?'),
('Qual conteúdo PvE você mais gosta de jogar?'),
('Há quantos anos você joga World of Warcraft?'),
('Quantos personagens você possui atualmente?'),
('Em média, quantas horas por semana você dedica ao World of Warcraft?'),
('Atualmente, você participa de alguma guilda?');

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

-- 05. Frequência de jogo
('Todos os dias', 5),
('4 a 6 dias por semana', 5),
('2 a 3 dias por semana', 5),
('1 dia por semana', 5),
('Poucas vezes por mês', 5),
('Raramente', 5),

-- 06. Conteúdo PvE
('Raids', 6),
('Mítica+', 6),
('Imersões', 6),
('Mundo aberto', 6),
('Masmorras', 6),
('Coleções', 6),

-- 07. Anos de experiência
('Menos de 1 ano', 7),
('De 1 a 2 anos', 7),
('De 3 a 4 anos', 7),
('De 5 a 7 anos', 7),
('De 8 a 10 anos', 7),
('Mais de 10 anos', 7),

-- 08. Quantidade de personagens
('1 a 2 personagens', 8),
('3 a 5 personagens', 8),
('6 a 10 personagens', 8),
('11 a 15 personagens', 8),
('16 a 20 personagens', 8),
('Mais de 20 personagens', 8),

-- 09. Horas semanais
('Menos de 5 horas', 9),
('De 5 a 10 horas', 9),
('De 11 a 20 horas', 9),
('De 21 a 30 horas', 9),
('Mais de 30 horas', 9),

-- 10. Participação em guilda
('Sim, participo ativamente', 10),
('Sim, mas participo pouco', 10),
('Não participo de nenhuma guilda', 10);

SELECT
	p.idPergunta,
    p.enunciado,
    a.titulo AS alternativa
FROM pergunta AS p
JOIN alternativa AS a
    ON p.idPergunta = a.fk_pergunta;
    
SELECT
	up.id_usuario,
	u.nome,
    p.idPergunta,
	p.enunciado,
    a.titulo
FROM usuario_pergunta AS up
JOIN alternativa AS a
ON a.idAlternativa = up.id_alternativa
JOIN pergunta AS p
ON p.idPergunta = up.id_pergunta
JOIN usuario AS u
ON u.id = up.id_usuario
ORDER BY idPergunta;


-- total de usuarios que responderam o formulario --
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

-- Porcentagem entre facções --
CREATE VIEW vwPercFaccao AS
SELECT
    ROUND(
        (SELECT COUNT(*)
         FROM usuario_pergunta
         WHERE id_pergunta = 1 AND id_alternativa = 1
        ) * 100.0 /
        (SELECT COUNT(*)
         FROM usuario_pergunta
         WHERE id_pergunta = 1),
    2) AS perc_horda,
	ROUND(
        (SELECT COUNT(*)
         FROM usuario_pergunta
         WHERE id_pergunta = 1 AND id_alternativa = 1
        ) * 100.0 /
        (SELECT COUNT(*)
         FROM usuario_pergunta
         WHERE id_pergunta = 2),
    2) AS perc_alianca;
        
-- porcentagem de cada classe -- 
CREATE VIEW vwClassPercent AS
SELECT
    a.titulo AS classe,
    COUNT(*) AS quantidade,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) AS porcentagem
FROM usuario_pergunta AS up
JOIN alternativa AS a
    ON up.id_alternativa = a.idAlternativa
WHERE up.id_pergunta = 2
GROUP BY a.idAlternativa, a.titulo
ORDER BY quantidade DESC;

-- Porcentagem DPS, Tank Ou Healer --
CREATE VIEW vwRolePercent AS
SELECT
	a.titulo AS 'função',
    COUNT(*) AS quantidade,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) AS porcentagem
FROM usuario_pergunta AS up
JOIN alternativa AS a
    ON up.id_alternativa = a.idAlternativa
WHERE up.id_pergunta = 3
GROUP BY a.idAlternativa, a.titulo
ORDER BY quantidade DESC;

-- Porcentagem Retail, Classic Ou ambas --
CREATE VIEW vwVersionPercent AS
SELECT
	a.titulo AS 'Versão',
    COUNT(*) AS quantidade,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) AS porcentagem
FROM usuario_pergunta AS up
JOIN alternativa AS a
    ON up.id_alternativa = a.idAlternativa
WHERE up.id_pergunta = 4
GROUP BY a.idAlternativa, a.titulo
ORDER BY quantidade DESC;

-- Media anos jogados --
CREATE VIEW vwMediaAnos AS
SELECT
    ROUND(AVG(
        CASE
            WHEN a.titulo = 'Menos de 1 ano' THEN 0.5
            WHEN a.titulo = 'De 1 a 2 anos' THEN 2
            WHEN a.titulo = 'De 3 a 4 anos' THEN 4
            WHEN a.titulo = 'De 5 a 7 anos' THEN 6
            WHEN a.titulo = 'De 8 a 10 anos' THEN 9
            WHEN a.titulo = 'Mais de 10 anos' THEN 12
        END
    ), 2) AS media_anos_jogados
FROM usuario_pergunta AS up
JOIN alternativa AS a
    ON up.id_alternativa = a.idAlternativa
WHERE up.id_pergunta = 7;


SELECT
    ROUND(AVG(
        CASE
            WHEN a.titulo = 'Menos de 1 ano' THEN 0.5
            WHEN a.titulo = 'De 1 a 2 anos' THEN 2
            WHEN a.titulo = 'De 3 a 4 anos' THEN 4
            WHEN a.titulo = 'De 5 a 7 anos' THEN 6
            WHEN a.titulo = 'De 8 a 10 anos' THEN 9
            WHEN a.titulo = 'Mais de 10 anos' THEN 12
        END
    ), 2) AS media_anos_jogados
FROM usuario_pergunta AS up
JOIN alternativa AS a
    ON up.id_alternativa = a.idAlternativa
WHERE up.id_pergunta = 7;

