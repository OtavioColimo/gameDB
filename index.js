const { createApp } = Vue
const API_URL = 'http://localhost:3000';
createApp({
    data() {
        return {
            heroi: { vida: 100, pocao: 3, critico: 3, escudo: false, defender: 4, acao:0, nome:1},
            vilao: { vida: 100, vidaAnteriorVilao: 100, critico: 0, acao:0 , nome:1},
            game: { ativo: false },
            log: [],
            mostrarBotao: false

        }
    },
    methods: {
        atacar(isHeroi) {
            if (!this.game.ativo) {
                if (isHeroi) {
                    this.acaoVilao();
                    this.vilao.vidaAnteriorVilao = this.vilao.vida
                    this.heroi.acao="atacou!"
                    this.log.push("Herói " + this.heroi.acao)
                    this.vilao.vida -= 12
                    this.atualizarAcaoNoBancoDeDados(this.heroi.acao, this.heroi.nome);
                    this.atualizarVidaNoBancoDeDados(this.heroi.vida, this.vilao.vida)
                } 
                else {
                    if (this.heroi.escudo == false) {
                        this.log.push("Vilão atacou!")
                        this.heroi.vida -= 10
                        this.atualizarVidaNoBancoDeDados(this.vilao.vida, this.heroi.vida);
                        this.vilao.acao="Atacou"
                        this.atualizarAcaoVilaoNoBancoDeDados(this.vilao.acao, this.vilao.nome)
                    }
                    else if (this.heroi.escudo == true) {
                        this.log.push("Vilão atacou")
                        this.log.push("Heroi defendeu o ataque!")
                        this.heroi.escudo = false
                        this.atualizarVidaNoBancoDeDados(this.vilao.vida, this.heroi.vida);
                    }
                }
                this.vitoriaHeroi()
            }
            this.limpandoLog()
        },
        async atualizarVidaNoBancoDeDados(vidaHeroi, vidaVilao) {
            try {
                const response = await fetch(`${API_URL}/atualizarVida`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ vidaHeroi, vidaVilao })
                });
                if (!response.ok) {
                    throw new Error('Erro ao atualizar a vida no banco de dados.');
                }
                console.log('Vida do herói e do vilão atualizada com sucesso.');
            } catch (error) {
                console.error('Erro ao atualizar a vida no banco de dados:', error);
            }
        },
        async atualizarAcaoNoBancoDeDados(acaoHeroi,nomeHeroi) {
            try {
                const response = await fetch(`${API_URL}/atualizaracao`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({acaoHeroi, nomeHeroi})
                });
                if (!response.ok) {
                    throw new Error('Erro ao atualizar a acao no banco de dados.');
                }
                console.log('acao do herói atualizada com sucesso:' + acaoHeroi + nomeHeroi  );
            } catch (error) {
                console.error('Erro ao atualizar a acao no banco de dados:', error);
            }
        },
        async atualizarAcaoVilaoNoBancoDeDados(acaoVilao,nomeVilao) {
            try {
                const response = await fetch(`${API_URL}/atualizaracaovilao`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({acaoVilao, nomeVilao})
                });
                if (!response.ok) {
                    throw new Error('Erro ao atualizar a acao no banco de dados.');
                }
                console.log('acao do vilao atualizada com sucesso:' + nomeVilao + nomeVilao  );
            } catch (error) {
                console.error('Erro ao atualizar a acao no banco de dados:', error);
            }
        },


        defender(isHeroi) {
            if (!this.game.ativo) {
                if (isHeroi) {
                    if (this.heroi.defender > 0) {
                        this.heroi.defender -= 1
                        this.heroi.escudo = true
                        this.log.push("O herói se prepara para bloquear o próximo ataque do vilão")
                        this.heroi.acao="Defendeu"
                        this.acaoVilao()
                        this.atualizarAcaoNoBancoDeDados(this.heroi.acao, this.heroi.nome)
                    }
                    else if (this.heroi.defender <= 0) {
                        this.log.push("Heroi não tem mais escudo!")
                        this.acaoVilao()
                    }



                } else {

                    this.vilao.vida = this.vilao.vidaAnteriorVilao
                    this.log.push("Vilão defendeu!")
                    this.vilao.acao="defendeu"
                    this.atualizarAcaoVilaoNoBancoDeDados(this.vilao.acao, this.vilao.nome)


                }
                this.vitoriaHeroi()
            }
            this.limpandoLog()
        },


        usarPocao(isHeroi) {
            if (!this.game.ativo) {
                if (isHeroi) {

                    if (this.heroi.pocao > 0 & this.heroi.vida < 85) {
                        this.heroi.pocao -= 1
                        this.heroi.vida += 20

                        this.log.push("O herói utilizou uma poção, recuperando 15 pontos de vida.")
                        this.heroi.acao="Curou"
                        this.acaoVilao();
                        this.atualizarVidaNoBancoDeDados(this.heroi.vida, this.vilao.vida);
                        this.atualizarAcaoNoBancoDeDados(this.heroi.acao, this.heroi.nome)



                    }



                    else if (this.heroi.pocao > 3) {
                        this.log.push("Impossível se curar, o herói utilizou todas as poções!")
                        this.acaoVilao()

                    }

                    else if (this.heroi.vida > 85) {
                        this.log.push("Impossível herói curar com a vida acima de 85%!")
                        this.acaoVilao()

                    }


                } else {

                    if (this.vilao.vida < 85) {
                        this.vilao.vida += 5
                        this.log.push("O Vilão utilizou uma poção, recuperando 5 pontos de vida!")
                        this.atualizarVidaNoBancoDeDados(this.heroi.vida, this.vilao.vida);
                        this.vilao.acao="Curou"
                        this.atualizarAcaoVilaoNoBancoDeDados(this.vilao.acao, this.vilao.nome)


                    }

                    else {
                        this.log.push("Impossível vilão curar com a vida acima de 85%!")

                    }


                }
                this.vitoriaHeroi()

            }
            this.limpandoLog()
        },


        critico(isHeroi) {
            if (!this.game.ativo) {
                if (isHeroi) {

                    if (this.heroi.critico > 0) {
                        this.heroi.critico -= 1
                        this.vilao.vidaAnteriorVilao = this.vilao.vida
                        this.log.push("Herói conseguiu um acerto crítico!!!")
                        this.vilao.vida -= 30
                        this.acaoVilao();
                        if (this.vilao.vida <= 0) {
                            this.vilao.vida = 0

                        }
                        this.heroi.acao="Critou"
                        this.atualizarVidaNoBancoDeDados(this.heroi.vida, this.vilao.vida);
                        this.atualizarAcaoNoBancoDeDados(this.heroi.acao, this.heroi.nome)
                        

                    }
                    else {

                        this.log.push("Herói não possui mais chance de crítico!.")
                        this.acaoVilao();

                    }


                } else {

                    if (this.heroi.escudo == false) {
                        this.log.push("Vilão CRITOU!!")
                        this.heroi.vida -= 24
                        this.vilao.acao="Critou"
                        this.atualizarAcaoVilaoNoBancoDeDados(this.vilao.acao, this.vilao.nome)

                    }
                    else if (this.heroi.escudo == true) {
                        this.log.push("Vilão CRITOU!!")
                        this.log.push("Heroi defendeu o CRITICO!")
                        this.heroi.escudo = false
                    }

                    this.atualizarVidaNoBancoDeDados(this.heroi.vida, this.vilao.vida);
                }
                this.vitoriaHeroi()
            }
            this.limpandoLog()
        },


        acaoVilao() {
            setTimeout(() => {
                const acoes = ['atacar', 'defender', 'usarPocao', 'critico'];
                const acaoAleatoria = acoes[Math.floor(Math.random() * acoes.length)];
                this[acaoAleatoria](false);
                this.vitoriaVilao()
                this.atualizarVidaNoBancoDeDados(this.heroi.vida, this.vilao.vida);
            }, 1400)


        },
        vitoriaHeroi() {

            if (this.vilao.vida <= 0) {
                this.vilao.vida = 0
                this.game.ativo = true
                this.mostrarBotao = true
                setTimeout(() => { alert('HEROI GANHOU!') }, 500)


            }
        },
        vitoriaVilao() {
            if (this.heroi.vida <= 0) {
                this.heroi.vida = 0
                this.game.ativo = true
                this.mostrarBotao = true
                setTimeout(() => { alert('VILÃO GANHOU!') }, 500)

            }
        },
        limpandoLog() {
            if (this.log.length > 6) {
                this.log.shift();
            }
        },

        resetGame() {
            this.heroi = { vida: 100, pocao: 3, critico: 3, escudo: false, defender: 4 };
            this.vilao = { vida: 100, vidaAnteriorVilao: 100, critico: 0 };
            this.game.ativo = false;
            this.log = [];
            this.mostrarBotao = false
            this.atualizarVidaNoBancoDeDados(this.heroi.vida, this.vilao.vida);
        }
    }
}).mount("#app");