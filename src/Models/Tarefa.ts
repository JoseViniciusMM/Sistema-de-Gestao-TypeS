export interface Tarefa {
    id: number;
    usuario_id: number;
    titulo: string;
    descricao?: string;
    status: 'pendente' | 'concluida'; 
    data_criacao: Date;
    categoria_nome?: string;
}

export interface TarefaInput {
    usuario_id: number;
    titulo: string;
    descricao?: string;
    status?: 'pendente' | 'concluida';
}