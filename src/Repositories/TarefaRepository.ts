import { getDatabaseInstance } from './Database';
import { Tarefa, TarefaInput, Prioridade } from '../Models/Tarefa';

export class TarefaRepository {

    async salvar(tarefa: TarefaInput): Promise<Tarefa> {
        const db = await getDatabaseInstance();
        const result = await db.run(
            `INSERT INTO tarefas (usuario_id, titulo, descricao, status, prioridade, data_vencimento, data_criacao) 
             VALUES (?, ?, ?, ?, ?, ?, datetime('now'))`,
            [
                tarefa.usuario_id, 
                tarefa.titulo, 
                tarefa.descricao || '', 
                tarefa.status || 'pendente',
                tarefa.prioridade || 'Baixa', 
                tarefa.data_vencimento || null
            ]
        );
        
        return { 
            ...tarefa, 
            id: result.lastID!, 
            prioridade: tarefa.prioridade || Prioridade.BAIXA, 
            data_criacao: new Date() 
        } as Tarefa;
    }

    async buscarPorUsuario(usuario_id: number): Promise<Tarefa[]> {
        const db = await getDatabaseInstance();
        const sql = `
            SELECT t.*, GROUP_CONCAT(c.nome, ', ') as categoria_nome 
            FROM tarefas t
            LEFT JOIN tarefas_categorias tc ON t.id = tc.tarefa_id
            LEFT JOIN categorias c ON tc.categoria_id = c.id
            WHERE t.usuario_id = ?
            GROUP BY t.id
        `;
        return await db.all<Tarefa[]>(sql, [usuario_id]);
    }

    async atualizarStatus(id: number, status: string): Promise<boolean> {
        const db = await getDatabaseInstance();
        const result = await db.run('UPDATE tarefas SET status = ? WHERE id = ?', [status, id]);
        return (result.changes || 0) > 0;
    }

    async excluir(id: number): Promise<boolean> {
        const db = await getDatabaseInstance();
        const result = await db.run('DELETE FROM tarefas WHERE id = ?', [id]);
        return (result.changes || 0) > 0;
    }

    async associarCategoria(tarefaId: number, categoriaId: number): Promise<void> {
        const db = await getDatabaseInstance();
        await db.run(
            `INSERT OR IGNORE INTO tarefas_categorias (tarefa_id, categoria_id) VALUES (?, ?)`,
            [tarefaId, categoriaId]
        );
    }
}