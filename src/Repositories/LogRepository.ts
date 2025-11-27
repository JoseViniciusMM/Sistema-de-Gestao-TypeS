import { getDatabaseInstance } from './Database';

export class LogRepository {
    public async registrar(usuario_id: number, acao: string): Promise<void> {
        const db = await getDatabaseInstance();
        await db.run(
            `INSERT INTO logs_atividades (usuario_id, acao, data_acao) VALUES (?, ?, datetime('now'))`,
            [usuario_id, acao]
        );
    }
}