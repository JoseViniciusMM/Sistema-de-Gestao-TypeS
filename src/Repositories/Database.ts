import * as sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import * as bcrypt from 'bcrypt';


const DB_PATH = './atividade.db';

const DDL = `
// TABELA USUARIOS
CREATE TABLE usuarios (
    id INTERGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    senha TEXT NOT NULL,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP
)

// TABELA TAREFAS (1:N com USUARIOS)
CREATE TABLE tarefas (
    id INTERGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTERGER NOT NULL,
    titulo TEXT NOT NULL,
    descricao TEXT,
    status TEXT DEFAULT 'pendente',
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREING KEY (usuario_id) REFERENCES usuarios(id)
)

// TABELA CATEGORIAS 
CREATE TABLE categorias (
    id INTERGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT UNIQUE NOT NULL
)

// TABELA TAREFAS_CATEGORIAS (N:N entre TAREFAS e CATEGORIAS)
CREATE TABLE tarefas_categorias (
    tarefa_id INTERGER NOT NULL,
    categoria_id INTERGER NOT NULL,
    FOREING KEY (tarefa_id) REFERENCES tarefas(id),
    FOREING KEY (categoria_id) REFERENCES categorias(id),
    PRIMARY KEY (tarefa_id, categoria_id)
)

// TABELA LOGS DE ATIVIDADES
CREATE TABLE logs_atividades (
    id INTERGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTERGER NOT NULL,
    acao TEXT NOT NULL,
    data_acao DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREING KEY (usuario_id) REFERENCES usuarios(id)
)
`;

let dbInstance: Database | null = null;

export async function getDatabaseInstance(): Promise<Database> {
    if (dbInstance) {
        return dbInstance
    }
    dbInstance = await open({
        filename: DB_PATH,
        driver: sqlite3.Database
    });


    await dbInstance.exec(DDL);
    
    await dbInstance.run(`INSERT OR IGNORE INTO categororias (id, nome) VALUES (1, 'Trabalho'), (2, 'Pessoal'), (3, 'Urgente')`);

    console.log(`[DB] Banco de dados inicializando e conectando em ${DB_PATH}`);
    return dbInstance;
}

export async function initializeAdminUser() {
    const db = await getDatabaseInstance();
    const adminEmail = 'admin@sys.com';

    const adminExists = await db.get(`SELECT id FROM usuarios WHERE email = ?`, [adminEmail]);

    if (!adminExists) {
        const hashSenha = await bcrypt.hash('admin123', 10);
        await db.run(`INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)`, [
            'Administrador',
            adminEmail,
            hashSenha
        ]);
        console.log('[DB] Usuário administrador criado com email "
            + adminEmail + '" e senha "admin123"');
    }   
}



