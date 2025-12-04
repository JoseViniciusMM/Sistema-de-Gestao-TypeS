import { TarefaRepository } from '../Repositories/TarefaRepository';
import { LogRepository } from '../Repositories/LogRepository';
import { Prioridade, TarefaInput } from '../Models/Tarefa'
export class TarefaService {
    private tarefaRepo = new TarefaRepository();
    private logRepo = new LogRepository();

    async criarTarefa(input: TarefaInput) {
    
    if (input.data_vencimento) {
        const dataPrazo = new Date(input.data_vencimento);
        const hoje = new Date();
        hoje.setHours(0,0,0,0);

        if (dataPrazo < hoje) {
            throw new Error("A data de vencimento não pode ser no passado.");
        }
    }

    if (input.prioridade === Prioridade.ALTA) {
        if (!input.descricao || input.descricao.trim() === "") {
            throw new Error("Tarefas de Prioridade ALTA obrigam ter uma descrição detalhada.");
        }
    }

    const tarefa = await this.tarefaRepo.salvar(input);
    await this.logRepo.registrar(input.usuario_id, `Criou tarefa ID: ${tarefa.id} (Prioridade: ${input.prioridade})`);
    return tarefa;
}

    async listarTarefas(usuario_id: number) {
        return await this.tarefaRepo.buscarPorUsuario(usuario_id);
    }

    async concluirTarefa(usuario_id: number, tarefa_id: number) {
        const sucesso = await this.tarefaRepo.atualizarStatus(tarefa_id, 'concluida');
        if (sucesso) {
            await this.logRepo.registrar(usuario_id, `Concluiu tarefa ID: ${tarefa_id}`);
        }
    }

    async excluirTarefa(usuario_id: number, tarefa_id: number) {
        const sucesso = await this.tarefaRepo.excluir(tarefa_id);
        if (sucesso) {
            await this.logRepo.registrar(usuario_id, `Excluiu tarefa ID: ${tarefa_id}`);
        }
    }

    async adicionarCategoria(tarefaId: number, categoriaId: number) {
        await this.tarefaRepo.associarCategoria(tarefaId, categoriaId);
    }
}