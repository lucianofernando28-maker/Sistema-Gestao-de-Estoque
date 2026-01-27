// produto-controller.js

let loja = new Armazem();
let tabela = document.getElementById("tabelaProdutos");
let forma = document.getElementById("formulario");

// --- CRIAÇÃO DO OVERLAY PARA CAIXAS DE DIÁLOGO ---
let overlay = document.createElement("div");
overlay.id = "custom-modal-overlay";
// Estilo fixo para cobrir a tela
overlay.style.cssText =
	"position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.7); display:none; z-index:2000; justify-content:center; align-items:center;";
document.body.appendChild(overlay);

// Fecha qualquer modal aberto
window.fecharModais = function () {
	overlay.style.display = "none";
	overlay.innerHTML = "";
};

// --- MODAL DE CONFIRMAÇÃO  ---
window.exibirConfirmacao = function (mensagem) {
	overlay.style.display = "flex";
	overlay.innerHTML = `
        <div style="background-color: rgba(12, 189, 150, 0.95); padding: 30px; border-radius: 10px; text-align: center; max-width: 400px; width: 90%; border: 2px solid white;">
            <h2 style="color: #6b072b; margin-bottom: 15px; font-size: 1.8rem;">Sucesso</h2>
            <p style="font-weight: bold; margin-bottom: 20px; color: black;">${mensagem}</p>
            <button onclick="fecharModais()" style="background-color: rgb(5, 91, 102); color: white; padding: 10px 20px; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">OK</button>
        </div>
    `;
};

// --- MODAL DE ERRO ---
window.exibirErro = function (mensagem) {
	overlay.style.display = "flex";
	overlay.innerHTML = `
        <div style="background-color: #fff;; padding: 30px; border-radius: 10px; text-align: center; max-width: 400px; width: 90%; border: 2px solid white; border-top: 6px solid brown; box-shadow: 0 4px 15px rgba(0,0,0,0.3);">
            <h2 style="color:rgb(192, 7, 7); margin-bottom: 15px; font-size: 1.8rem;">Entrada inválida</h2>
            <p style="font-weight: bold; margin-bottom: 20px; color: black;">${mensagem}</p>
            <button onclick="fecharModais()" style="background-color: rgb(5, 91, 102); color: white; padding: 10px 20px; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; text-align: center;">OK</button>
        </div>
    `;
};
// --- MODAL DE ATUALIZAÇÃO---
window.abrirEdicao = function (id) {
	let p = null;
	for (let i = 0; i < loja.produtos.length; i++) {
		if (loja.produtos[i].id === id) {
			p = loja.produtos[i];
			break;
		}
	}

	if (p) {
		overlay.style.display = "flex";
		overlay.innerHTML = `
            <div style="background-color: rgb(206, 204, 203); padding: 25px; border-radius: 8px; border: 3px solid rgb(14, 137, 146); width: 350px;">
                <h2 style="color: #6b072b; text-align: center; margin-bottom: 15px; font-size: 1.5rem;">Atualizar Produto</h2>
                <input type="hidden" id="edit-id" value="${p.id}">
                <label style="font-weight:bold; display:block;">Nome:</label>
                <input type="text" id="edit-nome" value="${p.nome}" style="width:100%; padding:10px; margin: 5px 0 15px 0; border-radius: 5px; border: 1px solid #ccc;">
                <label style="font-weight:bold; display:block;">Preço:</label>
                <input type="number" id="edit-preco" value="${p.preco}" style="width:100%; padding:10px; margin: 5px 0 15px 0; border-radius: 5px; border: 1px solid #ccc;">
                <label style="font-weight:bold; display:block;">Quantidade:</label>
                <input type="number" id="edit-qtd" value="${p.qtd}" style="width:100%; padding:10px; margin: 5px 0 15px 0; border-radius: 5px; border: 1px solid #ccc;">
                <div style="display: flex; gap: 10px; justify-content: center;">
                    <button onclick="processarAtualizacao()" style="background: rgb(5, 91, 102); color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer; width: 45%; font-weight: bold;">Salvar</button>
                    <button onclick="fecharModais()" style="background: brown; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer; width: 45%; font-weight: bold;">Cancelar</button>
                </div>
            </div>
        `;
	}
};

window.processarAtualizacao = function () {
	let id = Number(document.getElementById("edit-id").value);
	let n = document.getElementById("edit-nome").value;
	let pr = Number(document.getElementById("edit-preco").value);
	let q = Number(document.getElementById("edit-qtd").value);

	/*let resultado = loja.atualizarProduto(id, n, pr, q);
	if (resultado && resultado.erro) {
		eexibirErro(resultado.erro);
	} else {*/
	loja.atualizarProduto(id, n, pr, q);
	fecharModais();
	AtualizaTabela();
	exibirConfirmacao("Produto atualizado!");
	//	}
};

// --- EVENTO ADICIONAR  ---
if (forma) {
	forma.addEventListener("submit", function (event) {
		event.preventDefault();

		let nome = document.getElementById("nome").value;
		let preco = document.getElementById("preco").value;
		let qtd = document.getElementById("quantidade").value;

		let resultado = loja.adicionarProduto(nome, preco, qtd);

		if (resultado.erro) {
			exibirErro(resultado.erro);
		} else {
			exibirConfirmacao("Produto adicionado com sucesso!");
			forma.reset();
			/*
			// Redireciona se estiver na página de formulário após 1.5s
			if (window.location.pathname.includes("formulario.html")) {
				setTimeout(function () {
					window.location.href = "tabelaProdutos.html";
				}, 1500);
			} else {
				AtualizaTabela();
			}*/
			AtualizaTabela();
		}
	});
}

function AtualizaTabela() {
	if (!tabela) return;
	tabela.innerHTML = "";
	for (let i = 0; i < loja.produtos.length; i++) {
		let p = loja.produtos[i];
		let row = document.createElement("tr"); // Corrigido para criar linha
		let total = Number(p.preco) * Number(p.qtd);

		row.innerHTML = `
            <td>${p.nome}</td>
            <td>${Number(p.preco).toLocaleString()} kz</td>
            <td>${p.qtd}</td>
            <td>${total.toLocaleString()} kz</td>
            <td style="text-align: center;">
                <button class ="btn btn-editar"  aria-label="Editar" onclick="abrirEdicao(${
									p.id
								})"><i class="fa-solid fa-pen-to-square"></i></button>
                <button onclick="removerItem(${
									p.id
								})" class ="btn btn-remover" aria-label="Eliminar">	<i class="fa-solid fa-trash-can"></i></button>
            </td>
        `;
		tabela.appendChild(row);
	}
}

// --- MODAL DE REMOVER PRODUTO ---
window.removerItem = function (id) {
	// Exibe o overlay (container fundo escuro)
	overlay.style.display = "flex";

	// Personaliza o conteúdo do modal com estilo baseado na tabela/perigo
	overlay.innerHTML = `
        <div style="background-color: #fff; padding: 30px; border-radius: 10px; border-top: 6px solid brown; text-align: center; max-width: 450px; width: 90%; box-shadow: 0 4px 15px rgba(0,0,0,0.3);">
            <h2 style="color: brown; margin-bottom: 15px; font-family: 'Segoe UI', Tahoma, Verdana;">Atenção!</h2>
            <p style="font-weight: bold; color: #333; margin-bottom: 25px; font-size: 1.1rem;">
                Deseja mesmo eliminar este produto? <br>
                <span style="font-weight: normal; font-size: 0.9rem; color: #666;">Esta ação não pode ser desfeita.</span>
            </p>
            <div style="display: flex; gap: 15px; justify-content: center;">
                <button onclick="executarRemocaoDefinitiva(${id})" style="background-color: brown; color: white; border: none; padding: 12px 25px; border-radius: 6px; cursor: pointer; font-weight: bold; width: 120px;">
                    Eliminar
                </button>
                <button onclick="fecharModais()" style="background-color: #6c757d; color: white; border: none; padding: 12px 25px; border-radius: 6px; cursor: pointer; font-weight: bold; width: 120px;">
                    Cancelar
                </button>
            </div>
        </div>
    `;
};
//Função botão voltar
const voltar = () => {
	window.location.href = "../index.html";
};

//Função botão novo (abrir formulário)
const novo = () => {
	window.location.href = "formulario.html";
};

//Função botão novo (abrir formulário)
const cancelar = () => {
	window.location.href = "tabelaProdutos.html";
};

// Função auxiliar para processar a remoção após o clique no modal personalizado
window.executarRemocaoDefinitiva = function (id) {
	loja.removerProduto(id); // Remove do armazém (LocalStorage)
	fecharModais(); // Fecha o container
	AtualizaTabela(); // Recarrega os dados na tela
	exibirConfirmacao("Produto removido com sucesso!");
};

// Menu Toggle Mobile
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");
if (menuToggle) {
	menuToggle.addEventListener("click", function () {
		navLinks.classList.toggle("active");
	});
}

document.addEventListener("DOMContentLoaded", AtualizaTabela);
