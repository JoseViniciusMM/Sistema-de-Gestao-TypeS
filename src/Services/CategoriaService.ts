import { CategoriaRepository } from '../Repositories/CategoriaRepository';
import { Categoria } from '../Models/Categoria';

export class CategoriaService {
    private repo = new CategoriaRepository();

    async criar(nome: string): Promise<Categoria> {
        
        const nomeLimpo = nome.trim();
        if (nomeLimpo.length > 15) {
            throw new Error("O nome da categoria deve ser curto (máximo 15 letras). Use a descrição da tarefa para detalhes.");
        }

        const regexApenasTexto = /^[A-Za-z0-9\s]+$/;
        if (!regexApenasTexto.test(nomeLimpo)) {
            throw new Error("O nome da categoria não pode conter símbolos especiais (@, #, !, etc). Use apenas letras e números.");
        }

        const todas = await this.repo.buscarTodas();
        const existe = todas.some(c => c.nome.toLowerCase() === nomeLimpo.toLowerCase());
        if (existe) {
            throw new Error("Já existe uma categoria com este nome.");
        }
        return await this.repo.salvar({ nome: nomeLimpo });
    }

    async listar() {
        return await this.repo.buscarTodas();
    }

    async excluir(id: number) {
        if (id <= 3) {
            throw new Error("Não é permitido excluir as categorias padrão do sistema (IDs 1, 2 e 3).");
        }
        
        const sucesso = await this.repo.excluir(id);

        if (!sucesso) {
            throw new Error(`Falha ao excluir. A categoria ID ${id} não existe.`);
        }
        return true;
    }
}