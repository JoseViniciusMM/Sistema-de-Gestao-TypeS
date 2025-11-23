import { getDatabaseInstance } from './Database';

export class LogRepository {
    private dbPromise = getDatabaseInstance();

    public async registrar(usuario_id: number | null, acao: string): Promise<void> {
        const db = await this.dbPromise;
        
        const userId = usuario_id ?? 0; 

        const sql = `INSERT INTO logs_atividades (usuario_id, acao, data_acao)
                    VALUES (?, ?, datetime('now'))`;

        await db.run(sql, [userId, acao]);
    }
}
