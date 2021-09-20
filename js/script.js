function start() {
    $("#inicio").hide();

    $("#fundoGame").append("<div id='jogador' class='anima1'></div>");
    $("#fundoGame").append("<div id='inimigo1' class='anima2'></div>");
    $("#fundoGame").append("<div id='inimigo2' class=''></div>");
    $("#fundoGame").append("<div id='amigo' class='anima3'></div>");
    $("#fundoGame").append("<div id='placar'></div>");
    $("#fundoGame").append("<div id='energia'></div>");
    
    //Principais variáveis do jogo

    var jogo = {}
    var TECLAS = {
        W: 87,
        S: 83,
        D: 68
    }
    var velocidade= 5;
    var posicaoY = parseInt(Math.random() * 334);
    var podeAtirar = true;
    var fimDeJogo = false;
    var pontos = 0;
    var salvos = 0;
    var perdidos = 0;
    var energiaAtual = 3;

    var somDisparo = document.getElementById("somDisparo");
    var somExplosao = document.getElementById("somExplosao");
    var musica = document.getElementById("musica");
    var somGameOver = document.getElementById("somGameOver");
    var somPerdido = document.getElementById("somPerdido");
    var somResgate = document.getElementById("somResgate");

    musica.addEventListener("ended", function(){musica.currentTime = 0; musica.play();}, false);
    musica.play();

    jogo.pressionou = [];

    //Verifica se o usuário pressionou alguma tecla
    $(document).keydown(function(e){
        jogo.pressionou[e.which] = true;
    });

    $(document).keyup(function(e){
        jogo.pressionou[e.which] = false;
    });

    //Game loop

    jogo.timer = setInterval(loop,30);

    function loop() {
        moveFundo();
        moveJogador();
        moveInimigo1();
        moveInimigo2();
        moveAmigo();
        colisao();
        placar();
        energia();
    } //Fim da função loop

    //Função que movimenta o fundo do jogo
    function moveFundo() {
        esquerda = parseInt($("#fundoGame").css("background-position"));
        $("#fundoGame").css("background-position", esquerda -1);
    } //Fim da função moveFundo

    function moveJogador() {
        if(jogo.pressionou[TECLAS.W]){
            var topo = parseInt($("#jogador").css("top"));
            $("#jogador").css("top", topo -10);

            if(topo <= 0){
                $("#jogador").css("top", + 10);
            }
        }

        if(jogo.pressionou[TECLAS.S]){
            var topo = parseInt($("#jogador").css("top"));
            $("#jogador").css("top", topo + 10);

            if(topo >= 434){
                $("#jogador").css("top", topo - 10);
            }
        }

        if(jogo.pressionou[TECLAS.D]){
            
            //chama função Disparo
            disparo();
        } 
    } //Fim da função moveJogador

    function moveInimigo1() {
        posicaoX = parseInt($("#inimigo1").css("left"));
        $("#inimigo1").css("left", posicaoX - velocidade);
        $("#inimigo1").css("top", posicaoY);

        if(posicaoX <= 0){
            posicaoY = parseInt(Math.random() * 334);
            $("#inimigo1").css("left", 694);
            $("#inimigo1").css("top", posicaoY);
        }
    } //Fim da função moveInimigo1

    function moveInimigo2() {
        posicaoX = parseInt($("#inimigo2").css("left"));
        $("#inimigo2").css("left", posicaoX - 3);

        if(posicaoX <= 0){
            $("#inimigo2").css("left", 775);
        }
    } //Fim da função moveInimigo2

    function moveAmigo() {
        posicaoX = parseInt($("#amigo").css("left"));
        $("#amigo").css("left", posicaoX + 1);

        if(posicaoX >= 906){
            $("#amigo").css("left", 10);
        }
    } //Fim da função moveAmigo

    function disparo() {
        if(podeAtirar == true){
            somDisparo.play();
            podeAtirar = false;

            topo = parseInt($("#jogador").css("top"));
            posicaoX = parseInt($("#jogador").css("left"));
            tiroX = posicaoX + 190;
            topoTiro = topo + 37;
            $("#fundoGame").append("<div id='disparo'></div>");
            $("#disparo").css("top", topoTiro);
            $("#disparo").css("left", tiroX);

            var tempoDisparo = window.setInterval(executaDisparo, 30);
        } //Fecha if pode atirar

        function executaDisparo() {
            posicaoX = parseInt($("#disparo").css("left"));
            $("#disparo").css("left", posicaoX + 15);

            if(posicaoX > 900){
                window.clearInterval(tempoDisparo);
                tempoDisparo = null;
                $("#disparo").remove();
                podeAtirar = true;
            }
        } //Fim da função executaDisparo
    } //Fim da função disparo

    function colisao() {
        var colisao1 = ($("#jogador").collision($("#inimigo1")));
        var colisao2 = ($("#jogador").collision($("#inimigo2")));
        var colisao3 = ($("#disparo").collision($("#inimigo1")));
        var colisao4 = ($("#disparo").collision($("#inimigo2")));
        var colisao5 = ($("#jogador").collision($("#amigo")));
        var colisao6 = ($("#inimigo2").collision($("#amigo")));
        
        //Jogador com inimigo1
        if(colisao1.length > 0){
            energiaAtual--;
            somExplosao.play();

            inimigo1X = ($("#inimigo1").css("left"));
            inimigo1Y = ($("#inimigo1").css("top"));
            explosao1(inimigo1X, inimigo1Y);

            posicaoY = parseInt(Math.random() * 334);
            $("#inimigo1").css("left", 694);
            $("#inimigo1").css("top", posicaoY);
        }

        //Jogador com inimigo2
        if(colisao2.length > 0) {
            energiaAtual--;
            somExplosao.play();

            inimigo2X = ($("#inimigo2").css("left"));
            inimigo2Y = ($("#inimigo2").css("top"));
            explosao2(inimigo2X, inimigo2Y);

            $("#inimigo2").remove();
            reposicionaInimigo2();
        }

        //Disparo com inimigo1
        if(colisao3.length > 0){
            pontos += 100;
            velocidade += 0.3;
            somExplosao.play();

            inimigo1X = ($("#inimigo1").css("left"));
            inimigo1Y = ($("#inimigo1").css("top"));
            
            explosao1(inimigo1X, inimigo1Y);
            $("#disparo").css("left", 950);

            posicaoY = parseInt(Math.random() * 334);
            $("#inimigo1").css("left", 694);
            $("#inimigo1").css("top", posicaoY);
        }

        //Disparo com inimigo2
        if(colisao4.length > 0){
            pontos += 50;
            somExplosao.play();

            inimigo2X = ($("#inimigo2").css("left"));
            inimigo2Y = ($("#inimigo2").css("top"));
            
            explosao2(inimigo2X, inimigo2Y);
            $("#disparo").css("left", 950);

            $("#inimigo2").remove();
            reposicionaInimigo2();
        }

        //Jogador com amigo
        if(colisao5.length > 0){
            salvos++;
            pontos += 30;
            somResgate.play();

            $("#amigo").remove();
            reposicionaAmigo();            
        }

        //Inimigo2 com amigo
        if(colisao6.length > 0){
            perdidos++;
            somPerdido.play();

            amigoX = ($("#amigo").css("left"));
            amigoY = ($("#amigo").css("top"));
            explosao3(amigoX, amigoY);

            $("#amigo").remove();
            reposicionaAmigo();
        }

    } //Fim da função colisao

    function explosao1(inimigo1X, inimigo1Y) {
        $("#fundoGame").append("<div id='explosao1'></div>");
        $("#explosao1").css("background-image", "url(img/explosao.png)");
        var div = $("#explosao1");
        div.css("top", inimigo1Y);
        div.css("left", inimigo1X);
        div.animate({width: 200, opacity: 0}, "slow");

        var tempoExplosao = window.setInterval(removeExplosao, 1000);

        function removeExplosao() {
            div.remove();
            window.clearInterval(tempoExplosao);
            tempoExplosao = null;
        }
    } //Fim da function explosao1

    function explosao2(inimigo2X, inimigo2Y) {
        $("#fundoGame").append("<div id='explosao2'></div>");
        $("#explosao2").css("background-image", "url(img/explosao.png)");
        var div = $("#explosao2");
        div.css("top", inimigo2Y);
        div.css("left", inimigo2X);
        div.animate({width: 200, opacity: 0}, "slow");

        var tempoExplosao = window.setInterval(removeExplosao, 1000);

        function removeExplosao() {
            div.remove();
            window.clearInterval(tempoExplosao);
            tempoExplosao = null;
        }
    } //Fim da function explosao2

    function explosao3(amigoX, amigoY) {
        $("#fundoGame").append("<div id='explosao3' class='anima4'></div>");
        var div = $("#explosao3");
        div.css("top", amigoY);
        div.css("left", amigoX);
        
        var tempoExplosao3 = window.setInterval(resetaExplosao3, 1000);

        function resetaExplosao3() {
            div.remove();
            window.clearInterval(tempoExplosao3);
            tempoExplosao3 = null;
        }
    } //Fim da function explosao3

    function reposicionaInimigo2() {
        var tempoColisao4 = window.setInterval(reposiciona4, 5000);

        function reposiciona4() {
            window.clearInterval(tempoColisao4);
            tempoColisao4 = null;

            if(fimDeJogo == false){
                $("#fundoGame").append("<div id='inimigo2'></div>");
            }
        }
    } //Fim da função reposicionaInimigo2

    function reposicionaAmigo() {
        var tempoAmigo = window.setInterval(reposiciona6, 6000);

        function reposiciona6() {
            window.clearInterval(tempoAmigo);
            tempoAmigo = null;
            if(fimDeJogo == false){
                $("#fundoGame").append("<div id='amigo' class='anima3'></div>");
            }
        }                
    }

    function placar() {
        $("#placar").html("<h2>Pontos: " + pontos + " Salvos: " + salvos + " Perdidos: " + perdidos + "</h2>");
    }

    function energia() {
        if(energiaAtual == 3){
            $("#energia").css("background-image", "url(img/energia3.png)");
        }
        if(energiaAtual == 2){
            $("#energia").css("background-image", "url(img/energia2.png)");
        }
        if(energiaAtual == 1){
            $("#energia").css("background-image", "url(img/energia1.png)");
        }
        if(energiaAtual == 0){
            $("#energia").css("background-image", "url(img/energia0.png)");
            gameOver();
        }
    }

    function gameOver() {
        fimDeJogo = true;
        musica.pause();
        somGameOver.play();

        window.clearInterval(jogo.timer);
        jogo.timer = null;

        $("#jogador").remove();
        $("#inimigo1").remove();
        $("#inimigo2").remove();
        $("#amigo").remove();

        $("#fundoGame").append("<div id='fim'></div>");
        $("#fim").html("<h1>Game Over</h1><p>Sua pontuação foi: " + pontos + "</p> <div id='reinicia' onclick='reiniciaJogo()'><h3>Jogar novamente</h3></div>")
    }    

} //Fim da função start

function reiniciaJogo(){
    somGameOver.pause();
    $("#fim").remove();
    start();
}