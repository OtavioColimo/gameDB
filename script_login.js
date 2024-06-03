const login = {
    template: `
    <div class="container">
    <h1>Bem-vindo!</h1>
    <form id="login-form" action="/login" method = "post">
        <div class="form-group">
            <label for="username">Usuário</label>
            <input type="text" id="username" name="username" required>
        </div>
        <div class="form-group">
            <label for="password">Senha</label>
            <input type="password" id="password" name="password" required>
        </div>
        <button type="submit">Entrar</button>
        <p class="error-message" id="error-message"></p>
    </form>
    <div class="signup-link">
        <br>
        Não tem uma conta? <a href="#">Registre-se aqui</a>
    </div>
</div>
`,
    methods: {
        login() {
            // Função de login aqui
        }
    }
};

const Cadastro = {
    template: `
    <div class="container">
    <h1>Cadastro</h1>
    <form action="/cadastro" method = "post">
        <div class="form-group">
            <label for="name">Nome</label>
            <input type="text" id="name" name="name" required >
        </div>
        <div class="form-group">
            <label for="email">E-mail</label>
            <input type="email" id="email" name="email" required>
        </div>
        <div class="form-group">
            <label for="password">Senha</label>
            <input type="password" id="password" name="password" required>
        </div>
        <button type="submit">Cadastrar</button>
        
    </form>
    <div class="login-link">
    <br>
        Já tem uma conta? <a href="#">Faça login</a>
    </div>
</div>
`,
    methods: {
        cadastro() {
            // Função de cadastro aqui
        }
    }
};
const { createApp } = Vue;

createApp({
    data() {
        return {
            componenteAtual: "login"
        }
    },
    methods: {
        login() {
            if (this.componenteAtual == "Cadastro") {
                this.componenteAtual = "login"
            }

        },
        cadastro() {
            if (this.componenteAtual == "login") {
                this.componenteAtual = "Cadastro"
            }
        }
    },
    components: {
        login,
        Cadastro
    }
}).mount("#app")