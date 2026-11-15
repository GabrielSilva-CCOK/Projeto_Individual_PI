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
