import { getDatabaseInstance } from './Database';
import { Tarefa, TarefaInput } from '../Models/Tarefa';

export class TarefaRepository {
    async save(tarefa: TarefaInput): Promise<Tarefa> {
        const db = await getDatabaseInstance();
        const result = await db.run(
            `INSERT OR IGNORE INTO tarefas (usuario_id, titulo, descricao, status, data_criacao) VALUES (?, ?, ?, ?, datetime('now'))`,
            [tarefa.usuario_id, tarefa.titulo, tarefa.descricao || '', tarefa.status || 'pendente']
        );
        const tarefaId = result.lastID;
        const { categorias = [] } = tarefa

        // Relacionar categorias (N:N)
        for (const catId of categorias) {
            await db.run(
                `INSERT OR IGNORE INTO tarefas_categorias (tarefa_id, categoria_id)
                VALUES (?, ?)`,
                [tarefaId, catId]
            );
        }

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
    // LISTAR TAREFA + CATEGORIAS
    async listarComCategorias(usuario_id: number) {
        const db = await getDatabaseInstance();

        const tarefas = await db.all(
            `
      SELECT 
        t.id,
        t.titulo,
        t.descricao,
        t.status,
        t.data_criacao,
        GROUP_CONCAT(c.nome, ', ') AS categorias
      FROM tarefas t
      LEFT JOIN tarefas_categorias tc ON tc.tarefa_id = t.id
      LEFT JOIN categorias c ON c.id = tc.categoria_id
      WHERE t.usuario_id = ?
      GROUP BY t.id
      ORDER BY t.data_criacao DESC
      `,
            [usuario_id]
        );

        return tarefas;
    }

    async updateStatus(id: number, status: string): Promise<boolean> {
        const db = await getDatabaseInstance();
        const result = await db.run('UPDATE tarefas SET status = ? WHERE id = ?', [status, id]);
        return (result.changes || 0) > 0;
    }

    async editarTarefa(tarefa_id: number, dados: {titulo?: string, descricao?: string}) {
        const db = await getDatabaseInstance();

        const campos: string[] = [];
        const valores: any[] = [];

        if (dados.titulo !== undefined) {
            campos.push("titulo = ?");
            valores.push(dados.titulo);
        }

        if (dados.descricao !== undefined) {
            campos.push("descricao = ?");
            valores.push(dados.descricao);
        }

        if (campos.length === 0) {
            return { error: "Nenhum campo informado para atualização." };
        }

        valores.push(tarefa_id);

        const sql = `UPDATE tarefas SET ${campos.join(", ")} WHERE id = ?`;

        const result = await db.run(sql, valores);

        return result.changes > 0;
    }


    async delete(id: number): Promise<boolean> {
        const db = await getDatabaseInstance();
        // Precisa apagar relações da tabela N:N antes
        await db.run(`DELETE FROM tarefas_categorias WHERE tarefa_id = ?`, [id]);
        const result = await db.run('DELETE FROM tarefas WHERE id = ?', [id]);
        return (result.changes || 0) > 0;
    }
}