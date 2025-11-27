import { getDatabaseInstance } from './Database';
import { Usuario, UsuarioInput } from '../Models/Usuario';

export class UsuarioRepository {
    public async findByEmail(email: string): Promise<Usuario | undefined> {
        const db = await getDatabaseInstance();
        return await db.get<Usuario>('SELECT * FROM usuarios WHERE email = ?', [email]);
    }

    public async save(usuario: UsuarioInput): Promise<Usuario> {
        const db = await getDatabaseInstance();
        const result = await db.run(
            `INSERT INTO usuarios (nome, email, senha, data_criacao) VALUES (?, ?, ?, datetime('now'))`,
            [usuario.nome, usuario.email, usuario.senha]
        );

        return {
            id: result.lastID!,
            nome: usuario.nome,
            email: usuario.email,
            senha: usuario.senha,
            data_criacao: new Date()
        };
    }
}