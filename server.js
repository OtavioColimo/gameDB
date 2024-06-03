const express = require('express');
var cors = require('cors')
const path = require('path');
const sql = require('mssql');
const bodyParser = require('body-parser');


const app = express();
const PORT = 3000;
let pool;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



const config = {
    user: 'otaviocolimo',
    password: 'Ot@12345678',
    server: 'xt66game-server.database.windows.net',
    database: 'fatec-projeto',
    options: {
        encrypt: true
    }
};

app.use(express.json());
app.use(cors())

async function connect() {
    try {
        let pool = await sql.connect(config);
        console.log('Conexão bem-sucedida!');
        return pool;
    } catch (err) {
        console.error('Erro ao conectar com o banco de dados: ', err);
        throw err;
    }
}

module.exports = {
    connect
};
app.use(express.static(path.join(__dirname)));



let user = '';
app.post('/login', async (req, res) => {
    console.log("Teste", req.body);
    const { username, password } = req.body;
    const queryLogin = `SELECT * FROM usuarios WHERE nome_usuario = @username AND senha_usuario = @password`;

    try {
        if (!pool) {
            return res.status(500).send('Conexão com o banco de dados não estabelecida');
        }

        const request = pool.request();
        request.input('username', sql.NVarChar, username);
        request.input('password', sql.NVarChar, password);

        const result = await request.query(queryLogin);

        if (result.recordset.length > 0) {
            res.sendFile(path.join(__dirname, '/index.html'));
        } else {
            res.status(401).send('Usuário ou senha incorretos.');
        }
    } catch (err) {
        console.error('Erro ao executar consulta:', err);
        res.status(500).send('Erro interno ao realizar o login');
    }
});

// Rota de cadastro
app.post('/cadastro', async (req, res) => {
    console.log("Teste", req.body);
    const { username, password } = req.body;
    const queryIfEquals = `SELECT * FROM usuarios WHERE nome_usuario = '${username}' AND senha_usuario = '${password}'`;
    const queryCadastro = `INSERT INTO usuarios (nome_usuario, senha_usuario) VALUES ('${username}',${password}'`;

    try {
        const request = pool.request();
        request.input('username', sql.NVarChar, username);
        request.input('password', sql.NVarChar, password);

        // Verifica se o usuário já existe
        const resultEquals = await request.query(queryIfEquals);

        if (resultEquals.recordset.length > 0) {
            // Alerta de igualdade
            res.write('<script>alert("Cadastro já realizado, tente outro usuário e senha");</script>');
            // Redirecionar para a tela de cadastro novamente
            res.write('<script>setTimeout(function() { window.location.href = "login.html"; }, 400);</script>');
            res.end();
        } else {
            // Realiza o cadastro
            const resultCadastro = await request.query(queryCadastro);
            res.write('<script>alert("Cadastro realizado com sucesso!");</script>');
            res.write('<script>setTimeout(function() { window.location.href = "/login.html"; }, 400);</script>');
            res.end();
        }
    } catch (err) {
        console.error('Erro ao executar consulta:', err);
        res.status(500).send('Erro interno ao realizar o cadastro');
    }
});



// Rota para atualizar a vida do herói e do vilão
app.post('/atualizarVida', async (req, res) => {
    const { vidaHeroi, vidaVilao } = req.body;

    try {
        await sql.connect(config);
        const request = new sql.Request();
        await request.query(`
      MERGE INTO Personagens AS target
      USING (VALUES ('heroi', ${vidaHeroi}), ('vilao', ${vidaVilao})) AS source (Nome, Vida)
      ON target.Nome = source.Nome
      WHEN MATCHED THEN
        UPDATE SET Vida = source.Vida
      WHEN NOT MATCHED THEN
        INSERT (Nome, Vida) VALUES (source.Nome, source.Vida);
      `);
        res.status(200).send('Vida do herói e do vilão atualizada com sucesso.');
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao atualizar a vida do herói e do vilão.');
    }
});

// Rota para fornecer os dados do herói e do vilão
app.get('/characters', async (req, res) => {
    try {
        await sql.connect(config);
        const request = new sql.Request();

        // Consulta para obter os dados do herói
        const heroResult = await request.query("SELECT * FROM Personagens WHERE Nome = 'heroi'");
        const heroi = heroResult.recordset[0];

        // Consulta para obter os dados do vilão
        const villainResult = await request.query("SELECT * FROM Personagens WHERE Nome = 'vilao'");
        const vilao = villainResult.recordset[0];

        res.json({ heroi, vilao });
    } catch (error) {
        console.error('Erro ao buscar dados do herói e do vilão:', error);
        res.status(500).json({ error: 'Erro ao buscar dados do herói e do vilão.' });
    }
});

app.post('/atualizaracao', async (req, res) => {
    const { acaoHeroi, nomeHeroi } = req.body;

    try {
        await sql.connect(config);
        const request = new sql.Request();
        await request.query(`
        MERGE INTO acao AS target
        USING (VALUES ('${acaoHeroi}', '${nomeHeroi}')) AS source (acao,nome)
        ON target.nome = source.nome
        WHEN MATCHED THEN
            UPDATE SET acao = source.acao
        WHEN NOT MATCHED THEN
            INSERT (acao,nome) VALUES (source.acao,source.nome);
        `);
        res.status(200).send('Acao do heroi atualizada.');
    } catch (error) {
        console.error('Erro ao executar a consulta:', error);
    }
});

app.post('/atualizaracaovilao', async (req, res) => {
    const { acaoVilao, nomeVilao } = req.body;

    try {
        await sql.connect(config);
        const request = new sql.Request();
        await request.query(`
        MERGE INTO acaoVilao AS target
        USING (VALUES ('${acaoVilao}', '${nomeVilao}')) AS source (acao,nome)
        ON target.nome = source.nome
        WHEN MATCHED THEN
            UPDATE SET acao = source.acao
        WHEN NOT MATCHED THEN
            INSERT (acao,nome) VALUES (source.acao,source.nome);
        `);
        res.status(200).send('Acao do heroi atualizada.');
    } catch (error) {
        console.error('Erro ao executar a consulta:', error);
    }
});

app.get('/return', async (req, res) => {
    try {
        await sql.connect(config);
        const request = new sql.Request();
        const heroResult = await request.query("SELECT * FROM acao WHERE acao IS NOT NULL;");
        const heroi = heroResult.recordset[0];



        res.json({ heroi});
        console.log("Atualizado!")
        
    } catch (error) {
        console.error('Erro ao buscar dados do herói :', error);
        res.status(500).json({ error: 'Erro ao buscar dados do herói .' });
    }
});

app.get('/returnVilao', async (req, res) => {
    try {
        await sql.connect(config);
        const request = new sql.Request();
        const vilaoResult = await request.query("SELECT * FROM acaoVilao WHERE acao IS NOT NULL;");
        const vilao = vilaoResult.recordset[0];



        res.json({ vilao});
        console.log("Atualizado!")
        
    } catch (error) {
        console.error('Erro ao buscar dados do Vilao :', error);
        res.status(500).json({ error: 'Erro ao buscar dados do vilao .' });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard.html'));
});

//video 

app.use('/jogo/*', (req,res, next)=>{
    if(req.session.username){
        next();
    }else{
        res.redirect('/login.html')
    }
})

app.listen(PORT, () => {
    console.log(`Servidor Express rodando na porta ${PORT}`);
});