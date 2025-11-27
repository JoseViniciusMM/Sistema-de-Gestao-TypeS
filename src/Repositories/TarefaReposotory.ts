import { getDatabaseInstance } from './Database';
import { Tarefa, TarefaInput } from '../Models/Tarefa';

export class TarefaRepository {
    async save(tarefa: TarefaInput): Promise<Tarefa> {
        const db = await getDatabaseInstance();
        const result = await db.run(
            `INSERT INTO tarefas (usuario_id, titulo, descricao, status, data_criacao) VALUES (?, ?, ?, ?, datetime('now'))`,
            [tarefa.usuario_id, tarefa.titulo, tarefa.descricao || '', tarefa.status || 'pendente']
        );
        
        // Retorna o objeto criado (mockado para evitar outra query)
        return {
            id: result.lastID!,
            ...tarefa,
            status: tarefa.status || 'pendente',
            data_criacao: new Date()
        } as Tarefa;
    }

    async findAllByUsuario(usuario_id: number): Promise<Tarefa[]> {
        const db = await getDatabaseInstance();
        return await db.all<Tarefa[]>('SELECT * FROM tarefas WHERE usuario_id = ?', [usuario_id]);
    }

    async updateStatus(id: number, status: string): Promise<boolean> {
        const db = await getDatabaseInstance();
        const result = await db.run('UPDATE tarefas SET status = ? WHERE id = ?', [status, id]);
        return (result.changes || 0) > 0;
    }

    async delete(id: number): Promise<boolean> {
        const db = await getDatabaseInstance();
        const result = await db.run('DELETE FROM tarefas WHERE id = ?', [id]);
        return (result.changes || 0) > 0;
    }
}