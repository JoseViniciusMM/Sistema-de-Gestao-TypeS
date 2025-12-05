import { TarefaRepository } from '../Repositories/TarefaRepository';
import { LogRepository } from '../Repositories/LogRepository';
import { Prioridade, TarefaInput, Tarefa } from '../Models/Tarefa';

export class TarefaService {
    private tarefaRepo = new TarefaRepository();
    private logRepo = new LogRepository();

    async criarTarefa(input: TarefaInput): Promise<Tarefa> {
        // --- VALIDAÇÃO DE DATA ---
        if (input.data_vencimento) {
            const dataPrazo = new Date(input.data_vencimento);
            const hoje = new Date();
            hoje.setHours(0,0,0,0); // Zera hora para comparar apenas o dia

            if (dataPrazo < hoje) {
                throw new Error("A data de vencimento não pode ser no passado.");
            }
        }

        // --- VALIDAÇÃO DE PRIORIDADE ---
        if (input.prioridade === Prioridade.ALTA) {
            if (!input.descricao || input.descricao.trim() === "") {
                throw new Error("Tarefas de Prioridade ALTA obrigam ter uma descrição detalhada.");
            }
        }

        const tarefa = await this.tarefaRepo.salvar(input);
        await this.logRepo.registrar(input.usuario_id, `Criou tarefa ID: ${tarefa.id} (Prioridade: ${input.prioridade})`);
        return tarefa;
    }

    async listarTarefas(usuario_id: number): Promise<Tarefa[]> {
        // CORREÇÃO: Nome em português
        return await this.tarefaRepo.buscarPorUsuario(usuario_id);
    }

    async concluirTarefa(usuario_id: number, tarefa_id: number): Promise<void> {
        // CORREÇÃO: Nome em português e removido o 'usuario_id' do parâmetro do repo
        const sucesso = await this.tarefaRepo.atualizarStatus(tarefa_id, 'concluida');
        
        if (sucesso) {
            await this.logRepo.registrar(usuario_id, `Concluiu tarefa ID: ${tarefa_id}`);
        } else {
            throw new Error(`Não foi possível concluir. A tarefa ID ${tarefa_id} não existe.`);
        }
    }

    async excluirTarefa(usuario_id: number, tarefa_id: number): Promise<void> {
        // CORREÇÃO: Nome em português (excluir) e apenas 1 parâmetro
        const sucesso = await this.tarefaRepo.excluir(tarefa_id);
        
        if (sucesso) {
            await this.logRepo.registrar(usuario_id, `Excluiu tarefa ID: ${tarefa_id}`);
        } else {
            throw new Error(`Não foi possível excluir. A tarefa ID ${tarefa_id} não existe.`);
        }
    }

    async adicionarCategoria(tarefaId: number, categoriaId: number): Promise<void> {
        // CORREÇÃO: Nome em português (associarCategoria) e removido usuario_id
        await this.tarefaRepo.associarCategoria(tarefaId, categoriaId);
    }
}