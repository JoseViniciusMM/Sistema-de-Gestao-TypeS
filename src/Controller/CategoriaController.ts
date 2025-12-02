import readlineSync from 'readline-sync';
import { CategoriaService } from '../Services/CategoriaService';

export class CategoriaController {
    private service = new CategoriaService();
 
    async menu() {
        console.log("\n--- Gestão de Categorias ---");
        console.log("1. Listar Categorias");
        console.log("2. Criar Nova Categoria");
        console.log("3. Excluir Categoria");
        console.log("0. Voltar");

        const opcao = readlineSync.question("Opcao: ");

        switch (opcao) {
            case '1':
                await this.listar();
                break;
            case '2':
                const nome = readlineSync.question("Nome da Categoria: ");
                await this.service.criar(nome);
                console.log("✅ Categoria criada! ✅");
                break;
            case '3':
                await this.listar();
                const id = readlineSync.questionInt("ID para excluir: ");
                if (id <= 3) {
                    console.log("❌ Não é possível excluir categorias básicas! ❌");
                    break;
                } else {
                    await this.service.excluir(id);
                    console.log("🗑️ Categoria excluída. 🗑️");
                }
                break;
            case '0':
                return;
            default:
                console.log("Opção inválida.");
        }
    }

    async listar() {
        const categorias = await this.service.listar();
        console.table(categorias);
    }
}