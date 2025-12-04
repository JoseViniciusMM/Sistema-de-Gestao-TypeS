import { getDatabaseInstance } from './Database';
import { Categoria, CategoriaInput } from '../Models/Categoria';

export class CategoriaRepository {
    async salvar(categoria: CategoriaInput): Promise<Categoria> {
        const db = await getDatabaseInstance();
        const result = await db.run(
            `INSERT INTO categorias (nome) VALUES (?)`,
            [categoria.nome]
        );
        return { id: result.lastID!, nome: categoria.nome };
    }

    async buscarTodas(): Promise<Categoria[]> {
        const db = await getDatabaseInstance();
        return await db.all<Categoria[]>('SELECT * FROM categorias');
    }

    async excluir(id: number): Promise<boolean> {
        const db = await getDatabaseInstance();
        const result = await db.run('DELETE FROM categorias WHERE id = ?', [id]);
        return (result.changes || 0) > 0;
    }
}