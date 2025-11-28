
# 🧩 Tema: Sistema de Gestão de Atividades 

Desenvolver uma aplicação em **TypeScript** com **persistência de dados em SQLite**, aplicando os conceitos aprendidos na disciplina de *Linguagem de Programação* e seguindo **boas práticas de código**.

---

## 🧱 Requisitos Mínimos

### 🗄️ Banco de Dados
O sistema deve utilizar um banco **SQLite** com **no mínimo 5 tabelas**, incluindo:

- **usuarios**
  - `id`
  - `nome`
  - `email`
  - `senha` (criptografada)
  - `data_criacao`
- **logs**
  - responsável por registrar as operações realizadas (ex: criação, exclusão, atualização)
- **+3 tabelas relacionadas entre si**, representando as entidades do domínio escolhido

### 🔗 Relacionamentos
O banco deve conter pelo menos:

- Um relacionamento **1:N** (exemplo: um usuário pode ter várias tarefas)
- Um relacionamento **N:N** (exemplo: alunos matriculados em várias disciplinas)

---

## ⚙️ Funcionalidades

### 🧮 CRUD Completo
Implementar as operações **Create**, **Read**, **Update** e **Delete** para as entidades principais.

### 📝 Registro Automático de Logs
Cada operação relevante (ex: criação, exclusão, login, atualização) deve gerar um registro na tabela **logs**, contendo:

- `id` (gerado automaticamente)
- `usuario_id`
- `acao`
- `data_hora`

---

## 🧩 Arquitetura e Organização

A aplicação deve seguir o padrão em **camadas**, com a seguinte estrutura:

- **Model** → definição dos modelos de dados  
- **Repository** → código SQL e interação com o banco de dados  
- **Service** → regras de negócio  
- **Controller** → entrada e saída de dados  

---

## 💻 Interface

Implementar uma **interface CLI (Command Line Interface)** para interagir com a camada *Controller*.

---

> **Dica:** mantenha o código organizado, documentado e com boas práticas de formatação (nomes claros, tratamento de erros, modularização e versionamento no Git).
