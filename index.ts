import readlineSync from 'readline-sync';
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
    console.log("\n1. Login");
    console.log("2. Cadastrar");
    console.log("3. Sair");
    const opcao = readlineSync.question("Escolha: ");

    try {
        if (opcao === '1') {
            const email = readlineSync.question("Email: ");
            const senha = readlineSync.question("Senha: ", { hideEchoBack: true });
            usuarioLogado = await authService.login(email, senha);
            if (!usuarioLogado) console.log("❌ Email ou senha inválidos.");
            else console.log(`✅ Bem-vindo, ${usuarioLogado.nome}!`);
        } 
        else if (opcao === '2') {
            const nome = readlineSync.question("Nome: ");
            const email = readlineSync.question("Email: ");
            const senha = readlineSync.question("Senha: ", { hideEchoBack: true });
            await authService.cadastrar({ nome, email, senha });
            console.log("✅ Cadastro realizado! Faça login.");
        } 
        else if (opcao === '3') {
            process.exit(0);
        }
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
    
    const opcao = readlineSync.question("Opcao: ");

    try {
        switch (opcao) {
            case '1':
                const titulo = readlineSync.question("Titulo: ");
                const desc = readlineSync.question("Descricao: ");
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
                const idConcluir = readlineSync.questionInt("ID da tarefa para concluir: ");
                await tarefaService.concluirTarefa(usuarioLogado.id, idConcluir);
                console.log("✅ Tarefa atualizada.");
                break;
            case '4':
                const idExcluir = readlineSync.questionInt("ID da tarefa para excluir: ");
                await tarefaService.excluirTarefa(usuarioLogado.id, idExcluir);
                console.log("🗑️ Tarefa removida.");
                break;
            case '0':
                usuarioLogado = null;
                console.clear();
                break;
            default:
                console.log("Opção inválida.");
        }
    } catch (error) {
        console.error("Erro na operação.");
    }
}

main();