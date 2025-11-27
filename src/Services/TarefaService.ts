import { TarefaRepository } from '../Repositories/TarefaRepository';
import { LogRepository } from '../Repositories/LogRepository';
import { TarefaInput, Tarefa } from '../Models/Tarefa';

export class TarefaService {
    private tarefaRepo = new TarefaRepository();
    private logRepo = new LogRepository();

    async criarTarefa(input: TarefaInput): Promise<Tarefa> {
        const tarefa = await this.tarefaRepo.save(input);
        // Regra de Negócio: Registrar Log Automático
        await this.logRepo.registrar(input.usuario_id, `Criou tarefa ID: ${tarefa.id} - ${tarefa.titulo}`);
        return tarefa;
    }

    async listarTarefas(usuario_id: number): Promise<Tarefa[]> {
        return await this.tarefaRepo.findAllByUsuario(usuario_id);
    }

    async concluirTarefa(usuario_id: number, tarefa_id: number): Promise<void> {
        const sucesso = await this.tarefaRepo.updateStatus(tarefa_id, 'concluida');
        if (sucesso) {
            await this.logRepo.registrar(usuario_id, `Concluiu tarefa ID: ${tarefa_id}`);
        }
    }

    async excluirTarefa(usuario_id: number, tarefa_id: number): Promise<void> {
        const sucesso = await this.tarefaRepo.delete(tarefa_id);
        if (sucesso) {
            await this.logRepo.registrar(usuario_id, `Excluiu tarefa ID: ${tarefa_id}`);
        }
    }
}