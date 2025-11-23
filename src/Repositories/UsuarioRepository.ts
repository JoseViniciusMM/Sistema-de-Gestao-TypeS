import {getDatabaseInstance} from '../Database';
import {Usuario, UsuarioInput} from '../../Models/Usuario';

export class UsuarioRepository {
    private dbPromise = getDatabaseInstance();

    public async findByEmail(email: string): Promise<Usuario | null> {
        const db = await this.dbPromise;
        const sql = 'SELECT * FROM usuarios WHERE email = ?';
        return db.get<Usuario>(sql, [email]) || null;
    }

    public async save(usuarioData: UsuarioInput): Promise<Usuario> {
        const db = await this.dbPromise;
        const sql = `INSERT INTO usuarios (nome, email, senha, data_criacao)
                    VALUES (?, ?, ?, datetime('now'))`;

        const result = await db.run(sql, [
            usuarioData.nome,
            usuarioData.email,
            usuarioData.senha
        ]);

        