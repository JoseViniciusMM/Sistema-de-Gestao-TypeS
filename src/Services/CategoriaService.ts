import { CategoriaRepository } from '../Repositories/CategoriaRepository';
import { CategoriaInput, Categoria } from '../Models/Categoria';

export class CategoriaService {
    private repo = new CategoriaRepository();

    async criar(nome: CategoriaInput): Promise<Categoria> {
        return await this.repo.save(nome);
    }

    async listar(): Promise<Categoria[]> {
        return await this.repo.findAll();
    }

    async excluir(id: number): Promise<boolean> {
        return await this.repo.delete(id);
    }
}