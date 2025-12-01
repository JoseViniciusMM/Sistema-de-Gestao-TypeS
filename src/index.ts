import readlineSync from 'readline-sync';
import { AuthService } from './Services/AuthService';
import { TarefaController } from './Controller/TarefaController';
import { CategoriaController } from './Controller/CategoriaController';
import { Usuario } from './Models/Usuario';

const authService = new AuthService();
const tarefaController = new TarefaController();
const categoriaController = new CategoriaController();

let usuarioLogado: Usuario | null = null;

async function main() {
    console.clear();
    console.log("=== SISTEMA DE GESTÃO DE TAREFAS (MVC) ===");

    while (true) {
        if (!usuarioLogado) {
            await menuLogin();
        } else {
            await menuPrincipal();
        }
    }
}

async function menuLogin() {
    console.log("\n--- ÁREA DE LOGIN ---");
    console.log("1. Login");
    console.log("2. Cadastrar Novo Usuário");
    console.log("3. Sair");
    const opcao = readlineSync.question("Escolha: ");

    try {
        if (opcao === '1') {
            const email = readlineSync.question("Email: ");
            const senha = readlineSync.question("Senha: ", { hideEchoBack: true });
            
            usuarioLogado = await authService.login(email, senha);
            
            if (!usuarioLogado) {
                console.log("❌ Email ou senha inválidos.");
            } else {
                console.clear();
                console.log(`✅ Bem-vindo, ${usuarioLogado.nome}!`);
            }
        } 
        else if (opcao === '2') {
            const nome = readlineSync.question("Nome: ");
            const email = readlineSync.question("Email: ");
            const senha = readlineSync.question("Senha: ", { hideEchoBack: true });
            
            await authService.cadastrar({ nome, email, senha });
            console.log("✅ Cadastro realizado com sucesso! Faça login para continuar.");
        } 
        else if (opcao === '3') {
            console.log("Saindo do sistema...");
            process.exit(0);
        }
    } catch (error: any) {
        console.error("Erro na operação:", error.message);
    }
}

async function menuPrincipal() {
    if (!usuarioLogado) return;

    console.log(`\n--- Painel de ${usuarioLogado.nome} ---`);
    console.log("1. Nova Tarefa");
    console.log("2. Listar Minhas Tarefas");
    console.log("3. Concluir Tarefa");
    console.log("4. Excluir Tarefa");
    console.log("-----------------------");
    console.log("5. Vincular Tarefa a uma Categoria"); 
    console.log("6. Gerenciar Categorias");
    console.log("-----------------------");
    console.log("0. Logout");
    
    const opcao = readlineSync.question("Opcao: ");

    try {
        switch (opcao) {
            case '1':
                await tarefaController.criar(usuarioLogado.id);
                break;
            case '2':
                await tarefaController.listar(usuarioLogado.id);
                break;
            case '3':
                await tarefaController.concluir(usuarioLogado.id);
                break;
            case '4':
                await tarefaController.excluir(usuarioLogado.id);
                break;
            case '5':
                await tarefaController.vincularCategoria(usuarioLogado.id);
                break;
            case '6':
                await categoriaController.menu();
                break;
            case '0':
                usuarioLogado = null;
                console.clear();
                break;
            default:
                console.log("Opção inválida.");
        }
    } catch (error) {
        console.error("Erro inesperado no sistema.");
    }
}

main();