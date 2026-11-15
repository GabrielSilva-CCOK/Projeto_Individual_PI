-- Arquivo de apoio, caso você queira criar tabelas como as aqui criadas para a API funcionar.
-- Você precisa executar os comandos no banco de dados para criar as tabelas,
-- ter este arquivo aqui não significa que a tabela em seu BD estará como abaixo!

/*
comandos para mysql server
*/
CREATE USER 'API'@'localhost' IDENTIFIED BY 'API100#';
GRANT INSERT, SELECT ON azeroth.* TO 'API'@'localhost';

CREATE DATABASE azeroth;

USE azeroth;

CREATE TABLE usuario (
	id INT PRIMARY KEY AUTO_INCREMENT,
	nome VARCHAR(255),
	email VARCHAR(255) NOT NULL UNIQUE,
	senha VARCHAR(255) NOT NULL
);

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
