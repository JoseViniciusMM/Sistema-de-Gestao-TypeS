import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

const DB_PATH = './atividade.db';

// DDL Corrigida (Erros de digitação removidos)
const DDL = `
    CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        senha TEXT NOT NULL,
        data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS categorias (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT UNIQUE NOT NULL
    );

    CREATE TABLE IF NOT EXISTS tarefas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario_id INTEGER NOT NULL,
        titulo TEXT NOT NULL,
        descricao TEXT,
        status TEXT DEFAULT 'pendente',
        data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS tarefas_categorias (
        tarefa_id INTEGER NOT NULL,
        categoria_id INTEGER NOT NULL,
        FOREIGN KEY (tarefa_id) REFERENCES tarefas(id) ON DELETE CASCADE,
        FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE CASCADE,
        PRIMARY KEY (tarefa_id, categoria_id)
    );

    CREATE TABLE IF NOT EXISTS logs_atividades (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario_id INTEGER NOT NULL,
        acao TEXT NOT NULL,
        data_acao DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    );
`;

let dbInstance: Database | null = null;

export async function getDatabaseInstance(): Promise<Database> {
    if (dbInstance) {
        return dbInstance;
    }
    
    dbInstance = await open({
        filename: DB_PATH,
        driver: sqlite3.Database
    });

    // Importante: Habilitar Foreign Keys no SQLite
    await dbInstance.exec('PRAGMA foreign_keys = ON;');
    await dbInstance.exec(DDL);

    // Seed de categorias básicas
    await dbInstance.run(`INSERT OR IGNORE INTO categorias (id, nome) VALUES (1, 'Trabalho'), (2, 'Pessoal'), (3, 'Urgente')`);

    return dbInstance;
}