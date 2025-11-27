import * as bcrypt from 'bcrypt';
import { UsuarioRepository } from '../Repositories/UsuarioRepository';
import { LogRepository } from '../Repositories/LogRepository';
import { Usuario, UsuarioInput } from '../Models/Usuario';

export class AuthService {
    private usuarioRepo = new UsuarioRepository();
    private logRepo = new LogRepository();

    async cadastrar(input: UsuarioInput): Promise<Usuario> {
        const existente = await this.usuarioRepo.findByEmail(input.email);
        if (existente) throw new Error("Email já cadastrado.");

        const hashSenha = await bcrypt.hash(input.senha, 10);
        const novoUsuario = await this.usuarioRepo.save({ ...input, senha: hashSenha });
        
        await this.logRepo.registrar(novoUsuario.id, `Usuário criado: ${novoUsuario.email}`);
        return novoUsuario;
    }

    async login(email: string, senha: string): Promise<Usuario | null> {
        const usuario = await this.usuarioRepo.findByEmail(email);
        if (!usuario) return null;

        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) return null;

        await this.logRepo.registrar(usuario.id, "Login realizado");
        return usuario;
    }
}