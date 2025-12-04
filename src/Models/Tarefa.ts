export enum Prioridade {
    BAIXA = 'Baixa',
    MEDIA = 'Media',
    ALTA =  'Alta'
}

export interface Tarefa {
    id: number;
    usuario_id: number;
    titulo: string;
    descricao?: string;
    status: 'pendente' | 'concluida';
    prioridade: Prioridade; 
    data_vencimento?: Date;
    data_criacao: Date;
    categoria_nome?: string;
}

export interface TarefaInput {
    usuario_id: number;
    titulo: string;
    descricao?: string;
    status?: 'pendente' | 'concluida';
    prioridade?: Prioridade;
    data_vencimento?: string; 
}