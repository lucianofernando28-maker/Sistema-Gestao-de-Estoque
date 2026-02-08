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
		return null;
	}

	// Adiciona um novo produto com ID único
	adicionarProduto(nome, preco, qtd) {
		const erro = this.validaProduto(nome, preco, qtd);
		if (erro != null) return { erro: erro };
		if (this.produtos.some((produto) => produto.nome === nome))
			return { erro: "Já existe outro produto cadastrado com este nome!" };

		let prod = new Produto(this.contadorId, nome, Number(preco), Number(qtd));
		this.contadorId++;
		this.produtos.push(prod);
		this.salvar();
		return { prod: prod };
	}

	atualizarProduto(id, nome, preco, qtd) {
		// 1. Validação de campos obrigatórios
		const erroValidacao = this.validaProduto(nome, preco, qtd);
		if (erroValidacao) return { erro: erroValidacao };

		// 2. Verificar duplicados (Apenas se o nome for alterado)
		// Buscamos se existe algum produto com o mesmo nome que NÃO tenha o ID atual
		const produtoDuplicado = this.produtos.find(
			(p) => p.nome.toLowerCase() === nome.trim().toLowerCase() && p.id !== id
		);

		if (produtoDuplicado) {
			return { erro: "Já existe outro produto cadastrado com este nome!" };
		}

		// 3. Processo de atualização
		for (let i = 0; i < this.produtos.length; i++) {
			if (this.produtos[i].id === id) {
				this.produtos[i].nome = nome.trim();
				this.produtos[i].preco = Number(preco);
				this.produtos[i].qtd = Number(qtd);
				this.salvar(); // Salva no LocalStorage
				return { sucesso: true };
			}
		}
		return { erro: "Produto não encontrado." };
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
