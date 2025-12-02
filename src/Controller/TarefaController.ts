import readlineSync from 'readline-sync';
import { TarefaService } from '../Services/TarefaService';
import { CategoriaService } from '../Services/CategoriaService';
export class TarefaController {
    private service = new TarefaService();
    private categoriaService = new CategoriaService();

    async criar(usuario_id: number) {
        console.log("\n--- Nova Tarefa ---");
        const titulo = readlineSync.question("Titulo: ");
        const descricao = readlineSync.question("Descricao: ");

        try {
            const tarefa = await this.service.criarTarefa({
                usuario_id,
                titulo,
                descricao,
                status: 'pendente'
            });
            console.log(`✅ Tarefa "${tarefa.titulo}" criada com sucesso!`);
        } catch (error) {
            console.error("Erro ao criar tarefa.");
        }
    }

    async listar(usuario_id: number) {
        console.log("\n--- Suas Tarefas ---");
        const tarefas = await this.service.listarTarefas(usuario_id);

        if (tarefas.length === 0) {
            console.log("Nenhuma tarefa encontrada.");
        } else {
            console.table(tarefas.map((t: any) => ({
                ID: t.id,
                Titulo: t.titulo,
                Status: t.status,
                Categoria: t.categoria_nome || 'Sem Categoria'
            })));
        }
    }

    async concluir(usuario_id: number) {
        const lista = await this.service.listarTarefas(usuario_id);
        if (lista.length === 0) {
            console.log("Nenhuma tarefa para concluir.");
            return;
        }
        console.log("\n--- Concluir Tarefa ---");
        await this.listar(usuario_id);
        const id = readlineSync.questionInt("\nDigite o ID da tarefa para concluir: ");

        try {
            const sucesso = await this.service.concluirTarefa(usuario_id, id);
            if (!sucesso) {
                console.log("❌ Falha ao concluir a tarefa. Verifique o ID informado.");
                return;
            }
            console.log("✅ Tarefa marcada como concluída!");
        } catch (error: any) {
            console.error("Erro ao atualizar tarefa: ", error.message || error);
        }
    }

    async excluir(usuario_id: number) {
        const lista = await this.service.listarTarefas(usuario_id);
        if (lista.length === 0) {
            console.log("Nenhuma tarefa para excluir.");
        }
        console.log("\n--- Excluir Tarefa ---");
        await this.listar(usuario_id);
        const id = readlineSync.questionInt("\nDigite o ID da tarefa para excluir: ");
        try {
            const sucesso = await this.service.excluirTarefa(usuario_id, id);
            if (!sucesso) {
                console.log("❌ Falha ao excluir a tarefa. Verifique o ID informado.");
                return;
            }
            console.log("🗑️ Tarefa excluída com sucesso!");
        } catch (error: any) {
            console.error("Erro ao excluir tarefa: ", error.message || error);
        }

    }

    async vincularCategoria(usuario_id: number) {
        console.log("\n--- Vincular Categoria a Tarefa ---");

        console.log(">> Escolha a Tarefa:");
        await this.listar(usuario_id);
        if ((await this.service.listarTarefas(usuario_id)).length === 0) {
            console.log("⚠️ Nenhuma tarefa disponível para vincular. Crie uma tarefa primeiro.");
            return;
        }
        const tarefaId = readlineSync.questionInt("Digite o ID da Tarefa: ");

        console.log("\n>> Escolha a Categoria:");
        const categorias = await this.categoriaService.listar();

        if (categorias.length === 0) {
            console.log("⚠️ Nenhuma categoria cadastrada. Vá no menu de categorias e crie uma antes.");
            return;
        }

        console.table(categorias);
        const categoriaId = readlineSync.questionInt("Digite o ID da Categoria: ");

        try {
            await this.service.adicionarCategoria(tarefaId, categoriaId);
            console.log("✅ Categoria vinculada com sucesso!");
        } catch (error) {
            console.error("Erro ao vincular. Verifique se os IDs existem.");
        }
    }
}