import { getDatabaseInstance } from './Database';
import { Tarefa, TarefaInput } from '../Models/Tarefa';

export class TarefaRepository {

    async save(tarefa: TarefaInput): Promise<Tarefa> {
        const db = await getDatabaseInstance();
        const result = await db.run(
            `INSERT INTO tarefas (usuario_id, titulo, descricao, status, data_criacao) 
             VALUES (?, ?, ?, ?, datetime('now'))`,
            [tarefa.usuario_id, tarefa.titulo, tarefa.descricao || '', tarefa.status || 'pendente']
        );

        return {
            id: result.lastID!,
            ...tarefa,
            status: tarefa.status || 'pendente',
            data_criacao: new Date()
        } as Tarefa;
    }

    async findAllByUsuario(usuario_id: number): Promise<Tarefa[]> {
        const db = await getDatabaseInstance();

        const sql = `
            SELECT 
                t.*, 
                GROUP_CONCAT(c.nome, ', ') as categoria_nome 
            FROM tarefas t
            LEFT JOIN tarefas_categorias tc ON t.id = tc.tarefa_id
            LEFT JOIN categorias c ON tc.categoria_id = c.id
            WHERE t.usuario_id = ?
            GROUP BY t.id
        `;

        return await db.all<Tarefa[]>(sql, [usuario_id]);
    }

    async updateStatus(user_id: number, id: number, status: string): Promise<boolean> {
        const db = await getDatabaseInstance();
        const sql = 'UPDATE tarefas SET status = ? WHERE id = ?';
        const result = await db.run(sql, [status, id]);
        return (result.changes || 0) > 0;
    }

    async delete(user_id: number, id: number): Promise<boolean> {
        const db = await getDatabaseInstance();
        const sql = 'DELETE FROM tarefas WHERE usuario_id = ? AND id = ?';
        const result = await db.run(sql, [id, user_id]);
        return (result.changes || 0) > 0;
    }

    async associarCategoria(usuario_id: number, tarefaId: number, categoriaId: number): Promise<void> {
        const db = await getDatabaseInstance();
        const valida = await db.get(
            'SELECT id FROM tarefas WHERE id = ? AND usuario_id = ?',
            [tarefaId, usuario_id]
        );

        if (!valida) {
            throw new Error("Tarefa não pertence ao usuário");
        }

        await db.run(
            `INSERT OR IGNORE INTO tarefas_categorias (tarefa_id, categoria_id) VALUES (?, ?)`,
            [tarefaId, categoriaId]
        );

    }
}