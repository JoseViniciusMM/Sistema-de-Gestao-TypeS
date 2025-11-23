import { Database } from './Database';
import { Tarefa, TarefaInput } from '../Models/Tarefa';

const db = Database.getInstance();

export class TarefaRepository {

    async save(tarefaData: TarefaInput): Promise<Tarefa> {
        const sql = `INSERT INTO tarefas (usuario_id, titulo, descricao, status, data_criacao) 
                    VALUES (?, ?, ?, ?, datetime('now'))`;

        const result = await db.run(sql, [
            tarefaData.usuario_id,
            tarefaData.titulo,
            tarefaData.descricao || null,
            tarefaData.status || 'pendente'
        ]);

        return {
            ...tarefaData, 
            id: result.lastID,
            data_criacao: new Date().toDateString
        } as Tarefa;                   
    }

    async findAll(usuario_id: number): Promise<Tarefa[]> {
        const sql = `SELECT usuario_id, titulo, descricao, status, data_criacao FROM tarefas WHERE usuario_id = ?`;
        
        return await db.all(sql, [usuario_id]); as Tarefa[];
    }

    async updateStatus(id: number, status: 'pendente' | 'em progresso' | 'concluida'): Promise<boolean> {
        const sql = `UPDATE tarefas SET status = ? WHERE id = ?`;
        const result = await db.run(sql, [status, id]);
        return result.changes > 0;
    }

    async delete(id: number): Promise<boolean> {
        const sql = `DELETE FROM tarefas WHERE id = ?`;
        const result = await db.run(sql, [id]);
        return result.changes > 0;
    }
}
