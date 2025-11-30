import readlineSync from 'readline-sync';
import { TarefaService } from '../Services/TarefaService';

export class TarefaController {
    private service = new TarefaService();

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
            // Mapeia para mostrar apenas o necessário na tabela
            console.table(tarefas.map((t: any) => ({ 
                ID: t.id, 
                Titulo: t.titulo, 
                Status: t.status 
            })));
        }
    }

    async concluir(usuario_id: number) {
        const id = readlineSync.questionInt("Digite o ID da tarefa para concluir: ");
        try {
            await this.service.concluirTarefa(usuario_id, id);
            console.log("✅ Tarefa marcada como concluída!");
        } catch (error) {
            console.error("Erro ao atualizar tarefa.");
        }
    }

    async excluir(usuario_id: number) {
        const id = readlineSync.questionInt("Digite o ID da tarefa para excluir: ");
        try {
            await this.service.excluirTarefa(usuario_id, id);
            console.log("🗑️ Tarefa removida com sucesso.");
        } catch (error) {
            console.error("Erro ao excluir tarefa.");
        }
    }
}