var prompt = require('prompt-sync')();
import { AuthService } from './Services/AuthService';
import { TarefaService } from './Services/TarefaService';
import { Usuario } from './Models/Usuario';

const authService = new AuthService();
const tarefaService = new TarefaService();
let usuarioLogado: Usuario | null = null;

async function main() {
    console.clear();
    console.log("=== SISTEMA DE GESTÃO DE TAREFAS ===");

    while (true) {
        if (!usuarioLogado) {
            await menuLogin();
        } else {
            await menuPrincipal();
        }
    }
}

async function menuLogin() {
    const opcao = prompt("Escolha: ");
    console.log("\n1. Login");
    console.log("2. Cadastrar");
    console.log("3. Sair");

    try {
        switch (opcao.tostring()) {
            case '1':
                const logemail: string = prompt("Email: ");
                const logsenha: string = prompt("Senha: ", { hideEchoBack: true });
                usuarioLogado = await authService.login(logemail, logsenha);
                const logado: string = usuarioLogado ? `✅ Bem-vindo, ${usuarioLogado.nome}!` : "❌ Email ou senha inválidos.";
                break;
            ;
            case '2':
                const nome = prompt("Nome: ");
                const email = prompt("Email: ");
                const senha = prompt("Senha: ", { hideEchoBack: true });
                const confirmSenha = prompt("Confirme a Senha: ", { hideEchoBack: true });
                if (senha !== confirmSenha) {
                    console.log("❌ As senhas não coincidem.");
                    break;
                }
                await authService.cadastrar({ nome, email, senha });
                break;
            case '3':
                console.log("Saindo...");
                process.exit(0);
            default:
                console.log("Opção inválida.");
                break;
        }
        // if (opcao === '1') {
        //     const email = prompt("Email: ");
        //     const senha = prompt("Senha: ", { hideEchoBack: true });
        //     usuarioLogado = await authService.login(email, senha);
        //     if (!usuarioLogado) console.log("❌ Email ou senha inválidos.");
        //     else console.log(`✅ Bem-vindo, ${usuarioLogado.nome}!`);
        // } 
        // else if (opcao === '2') {
        //     const nome = prompt("Nome: ");
        //     const email = prompt("Email: ");
        //     const senha = prompt("Senha: ", { hideEchoBack: true });
        //     await authService.cadastrar({ nome, email, senha });
        //     console.log("✅ Cadastro realizado! Faça login.");
        // } 
        // else if (opcao === '3') {
        //     process.exit(0);
        // }
    } catch (error: any) {
        console.error("Erro:", error.message);
    }
}

async function menuPrincipal() {
    if (!usuarioLogado) return;

    console.log(`\n--- Painel de ${usuarioLogado.nome} ---`);
    console.log("1. Nova Tarefa");
    console.log("2. Listar Minhas Tarefas");
    console.log("3. Concluir Tarefa");
    console.log("4. Excluir Tarefa");
    console.log("0. Logout");
    
    const opcao = prompt("Opcao: ");

    try {
        switch (opcao) {
            case '1':
                console.log("\n--- Criar Nova Tarefa ---\n");
                const titulo = prompt("Titulo: ");
                const desc = prompt("Descricao: ");
                await tarefaService.criarTarefa({
                    usuario_id: usuarioLogado.id,
                    titulo: titulo,
                    descricao: desc,
                    status: 'pendente'
                });
                console.log("✅ Tarefa criada!");
                break;
            case '2':
                const tarefas = await tarefaService.listarTarefas(usuarioLogado.id);
                // Correção do erro do 't' (implicit any)
                console.table(tarefas.map((t: any) => ({ id: t.id, titulo: t.titulo, status: t.status })));
                break;
            case '3':
                const idConcluir = prompt("ID da tarefa para concluir: ");
                await tarefaService.concluirTarefa(usuarioLogado.id, idConcluir);
                console.log("✅ Tarefa atualizada.");
                break;
            case '4':
                const idExcluir = prompt("ID da tarefa para excluir: ");
                await tarefaService.excluirTarefa(usuarioLogado.id, idExcluir);
                console.log("🗑️ Tarefa removida.");
                break;
            case '0':
                usuarioLogado = null;
                console.clear();
                break;
            default:
                console.log("Opção inválida.")
                break;
        }
    } catch (error) {
        console.error("Erro na operação.");
    }
}

main();