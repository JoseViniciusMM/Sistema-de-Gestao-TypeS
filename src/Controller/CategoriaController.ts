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
                console.log("\n(Regra: Máximo 15 letras, sem símbolos)");
                const nome = readlineSync.question("Nome da Categoria: ");
                
                try {
                    await this.service.criar(nome); 
                    console.log("✅ Categoria criada!");
                } catch (error: any) {
                    console.error("❌ Erro:", error.message);
                }
                break;

            case '3':
                await this.listar();
                const id = readlineSync.questionInt("ID para excluir: ");
                try {
                    await this.service.excluir(id);
                    console.log("🗑️ Categoria excluída.");
                } catch (error: any) {
                    console.log(`❌ Erro: ${error.message}`);
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
        if (categorias.length === 0) {
            console.log("Nenhuma categoria encontrada.");
        } else {
            console.table(categorias);
        }
    }
}