// produto-model.js

class Produto {
	constructor(id, nome, preco, qtd) {
		this.id = id;
		this.nome = nome;
		this.preco = preco;
		this.qtd = qtd;
	}
}

class Armazem {
	constructor() {
		// Carrega a lista de produtos do LocalStorage ou inicia vazia
		this.produtos = JSON.parse(localStorage.getItem("produtos")) || [];

		// Define o contador de IDs baseado no maior ID existente para evitar duplicados
		if (this.produtos.length > 0) {
			let maxId = 0;
			for (let i = 0; i < this.produtos.length; i++) {
				if (this.produtos[i].id > maxId) {
					maxId = this.produtos[i].id;
				}
			}
			this.contadorId = maxId + 1;
		} else {
			this.contadorId = 1;
		}
	}

	// Valida se os campos estão preenchidos corretamente
	validaProduto(nome, preco, qtd) {
		if (!nome || nome.trim() === "") return "O nome é obrigatório!";
		if (preco <= 0) return "O preço deve ser maior que 0";
		if (qtd <= 0) return "A quantidade deve ser maior que 0";
		if (this.produtos.some((produto) => produto.nome === nome))
			return "Já esxiste outro produto com este nome";
		return null;
	}

	seExiste(novoProduto) {
		return this.produtos.some(
			(produto) => produto.nome.toLowerCase() === novoProduto.nome.toLowerCase()
		);
	}
	// Adiciona um novo produto com ID único
	adicionarProduto(nome, preco, qtd) {
		const erro = this.validaProduto(nome, preco, qtd);
		if (erro != null) return { erro: erro };
		/*const jaExiste = this.produtos.some(
			(p) => p.nome.toLowerCase() === nome.trim().toLowerCase()
		);
		if (jaExiste()) {
			return { erro: "Já esxiste outro produto com este nome" };
		}*/

		let prod = new Produto(this.contadorId, nome, Number(preco), Number(qtd));
		this.contadorId++;
		this.produtos.push(prod);
		this.salvar();
		return { prod: prod };
	}

	// Atualiza um produto existente percorrendo a lista pelo ID
	atualizarProduto(id, nome, preco, qtd) {
		/*const duplicado = this.produtos.some(
			(p) => p.nome.toLowerCase() === nome.toLowerCase() && p.id !== id
		);
		if (duplicado()) {
			return { erro: "Já esxiste outro produto com este nome" };
		}*/
		for (let i = 0; i < this.produtos.length; i++) {
			if (this.produtos[i].id === id) {
				this.produtos[i].nome = nome;
				this.produtos[i].preco = Number(preco);
				this.produtos[i].qtd = Number(qtd);
				this.salvar();
				//break;
				return { sucesso: true };
			}
		}
	}

	// Remove um produto filtrando a lista
	removerProduto(id) {
		let novaLista = [];
		for (let i = 0; i < this.produtos.length; i++) {
			if (this.produtos[i].id !== id) {
				novaLista.push(this.produtos[i]);
			}
		}
		this.produtos = novaLista;
		this.salvar();
	}

	// Persiste os dados no navegador
	salvar() {
		localStorage.setItem("produtos", JSON.stringify(this.produtos));
	}
}
