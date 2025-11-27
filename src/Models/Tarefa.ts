export interface Tarefa {
    id: number;
    usuario_id: number;
    titulo: string;
    descricao?: string;
    status: 'pendente' | 'em progresso' | 'concluida';
    data_criacao: Date;
}

export interface TarefaInput {
    usuario_id: number;
    titulo: string;
    descricao?: string;
    status?: 'pendente' | 'em progresso' | 'concluida';
}