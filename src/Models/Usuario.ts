export interface Usuario {
    id: number;
    nome: string;
    email: string;
    senha: string;
    data_criacao: Date;
}

export interface UsuarioInput {
    nome: string;
    email: string;
    senha: string;
}