//----------------Chamada da funcao ao clicar no botao START-----------

function start() { 
    $("#inicio").hide(); 
    $("footer").hide();

    //inserir <div> dentro do documento HTML

    $("#fundoGame").append("<div id = 'jogador' class ='anima-1'></div>");
    $("#fundoGame").append("<div id = 'et' class = 'anima-2'></div>");
    $("#fundoGame").append("<div id = 'inimigo-1' class = 'anima-3'></div>");
    $("#fundoGame").append("<div id = 'inimigo-2' class = 'anima-3'></div>");  

    $("#fundoGame").append("<div id = 'placar'></div>");    
    $("#fundoGame").append("<div id='energia'></div>");

//-----------------Chamada arquivos sonoros - HTML--------------------

/*usado codigo JS - jquery imcompatibilidade com alguns arquivos de som
  var = metodo(arquivo som HTML) */  

    var somDisparo = document.getElementById("somDisparo");
    var somExplosao = document.getElementById("somExplosao");
    var musica  = document.getElementById("musica");
    var somGameover = document.getElementById("somGameover");
    var somPerdido = document.getElementById("somPerdido");
    var somResgate = document.getElementById("somResgate");

    //add var.evento (quando a musica acabar, toque novamente) 
    musica.addEventListener("ended", function(){ musica.currentTime = 0; musica.play(); }, false);
    musica.play();

//----------------Variaveis globais------------------------------------

    var jogo = {};
    jogo.pressionou = [];
    jogo.timer = setInterval(loop,30); 
    
    var TECLA = { up: 38, dw: 40, sp: 32 } //array teclas

    var velocidade =5; //velocidade inimigo1
    var eixo_Y = parseInt(Math.random() * 250); //conversaoInt(funcao-Math.random)retorna um valor entre 0 e 250(limite movimento #fundoGame) = posicionamento diferente no eixo Y  

    var atirar = true;

    var fimdeJogo = false; //impede que o inimigo-2 apareca novamente apos msg de fim de jogo

    var pontos = 0; //colisao disparos: inimigo-1 = 100 pontos, inimigo-2 = 50 pontos 
    var salvos = 0;//salvar amigo: salvos++ = (salvo + 1) 
    var perdidos = 0;//colisao et/inimigo-2: perdidos++

    var energiaAtual = 3; //qtt totais de vidas --> perde nas colisoes com inimigos e amigos perdidos
    

//----------------Verificar se o usuario pressionou ou nao a tecla-------------------

    $(document).keydown(function(e){
        jogo.pressionou[e.which] = true;
    });
        
    $(document).keyup(function(e){
        jogo.pressionou[e.which] = false;
    });

//----------------Chamada das outras funcoes para o looping - principal-------------------

    function loop() { 
        
        moveFundo(); 
        moveJogador(); 
        moveInimigo1();
        moveInimigo2();
        moveEt();
        colisao();
        placar();    
        energia()
       
    }

//----------------Movimento imagens de fundo: Body e fundoGame---------   

    function moveFundo() { 

        //posicao atual da div -> movimento div por px

        esquerdaBody = parseInt($("body").css("background-position"));      
        ($("body").css("background-position", esquerdaBody -1)); 
        
        esquerdaGame = parseInt($("#fundoGame").css("background-position"));      
        ($("#fundoGame").css("background-position", esquerdaGame -1));         
    }

//-----------------Movimento Elementos (imagens)---------------------------

//Jogador

    function moveJogador() { 

        /*se keydown (tecla pressionada (up/dw/sp))
          var = recebe o valor (conversaoInt) da proriedade "top" do css, da #div
          var = var movimenta (cima ou baixo) +/- 10 px */ 

        //cima  
        if (jogo.pressionou[TECLA.up]) { 
            var topo = parseInt($("#jogador").css("top")); 
            $("#jogador").css("top",topo - 10); 

            //limite de movimento na div #fundoGame para cima
            if (topo <= 25) {
                $("#jogador").css("top",topo + 10);
            }
        }
        //baixo
        if (jogo.pressionou[TECLA.dw]) { 
            var topo = parseInt($("#jogador").css("top"));
            $("#jogador").css("top",topo + 10);

            //limite de movimento na div #fundoGame para baixo
            if (topo >= 550) {	
                $("#jogador").css("top",topo - 10);		
            }
        }
        //disparo
        if (jogo.pressionou[TECLA.sp]) { 
            disparo(); //chama a funcao disparo(true)
        }
    }

//Inimigo-1

    function moveInimigo1() {

        /* var eixo X1 = recebe o valor (conversaoInt) da proriedade "left" do css, da #div
           var eixo X1 = var movimenta (esquerda) - (5px) 
           var eixo Y = posicao no eixo Y, pela funcao Math.randow() */ 
            
        eixo_X1 = parseInt($("#inimigo-1").css("left"));
        $("#inimigo-1").css("left", eixo_X1 - velocidade);
        $("#inimigo-1").css("top", eixo_Y);

            /*limite eixo X1 = 0 
              recriar var eixo Y = gerar valor randomico novamente
              atualizar posicionamento inicial do eixo X1 e Y na div #fundoGame*/

            if(eixo_X1 <= 500) { 
                eixo_Y = parseInt(Math.random() * 250);
                $("#inimigo-1").css("left", 1100);
                $("#inimigo-1").css("top", eixo_Y);
            }
    }

 //Inimigo-2

    function moveInimigo2() {

        /* var eixo X2 = recebe o valor (conversaoInt) da proriedade "left" do css, da #div
           var eixo X2 = var movimenta (esquerda) - (velocidade = 4) */ 

        eixo_X2 = parseInt($("#inimigo-2").css("left"));
        $("#inimigo-2").css("left", eixo_X2 - 4);

            //limite esquerda #div fundoGame = 0 -> volta a posicao inicial "left"
            if(eixo_X2 <= 300) { 
                $("#inimigo-2").css("left", 1100);
            }
    }

//ET

    function moveEt() {

        /* var eixo X3 = recebe o valor (conversaoInt) da proriedade "left" do css, da #div
           var eixo X3 = var movimenta (direita) + (1px) */ 

        eixo_X3 = parseInt($("#et").css("left"));
        $("#et").css("left", eixo_X3 + 1);

            //limite direita #div fundoGame = 775 -> volta a posicao inicial "left"
            if(eixo_X3 > 950) {
                $("#et").css("left", 350);
            }

    }

//disparo 

    function disparo() {
        
        if(atirar == true) {

            atirar = false; //usuario so podera realizar um novo tiro, enquanto a funcao disparo estiver em execucao

            somDisparo.play;

            /*saber as posicoes iniciais do jogador (top e left) --> somar (direita) width e height do jogador = 130 e 90 (valores aproximados)*/

            topoJ = parseInt($("#jogador").css("top"))
            eixo_X4 = parseInt($("#jogador").css("left"))
            tiroX = eixo_X4 + 80;
            topoTiro = topoJ + 40;
            //tem que ser dentro da funcao disparo
            $("#fundoGame").append("<div id='disparo'></div");
                //posicionar a div com o valores das var encontradas = valor inicial do disparo
                $("#disparo").css("top",topoTiro);
                $("#disparo").css("left",tiroX);    
                        
            //var = comando de tempo = chama a funcao moveDisparo + tempo
            var tempoDisparo = window.setInterval(moveDisparo, 30);
        }
            function moveDisparo() {

                //posicao atual disparo --> movimenta + 15
                eixo_x5 = parseInt($("#disparo").css("left"));
                $("#disparo").css("left", eixo_x5 + 15);

                    if(eixo_x5 >= 1100) { //limite direita fundoGame
                        
                        window.clearInterval(tempoDisparo); //remover a var 
                        tempoDisparo = null; //zerar var
                        $("#disparo").remove(); //remove a div = disparo "desaparece"
                        atirar = true; //usuario pode atirar novamente
                    }
            }

    }

//colisoes 

    function colisao() {
        //usar jquery.collision - colisao com o inimigos - executa diversas funcoes do framework quando a var estiver preenchida
        
        //identifica a colisao entre as #divs = var preenchida
        var colisao1 = ($("#jogador").collision($("#inimigo-1"))); 
        var colisao2 = ($("#jogador").collision($("#inimigo-2"))); 
        var colisao3 = ($("#disparo").collision($("#inimigo-1"))); 
        var colisao4 = ($("#disparo").collision($("#inimigo-2"))); 
        var colisao5 = ($("#jogador").collision($("#et"))); 
        var colisao6 = ($("#inimigo-2").collision($("#et"))); 
             

    //inimigo-1

        if (colisao1.length > 0) { //se o tamanho da var > 0, ou seja, se estiver preencida = houve colisao

            energiaAtual--; //cada colisao = vida -1

            //indica posicoes do inimigo-1 -> 
            inimigo1_X = parseInt($("#inimigo-1").css("left"));
            inimigo1_Y = parseInt($("#inimigo-1").css("top"));
            explosao1(inimigo1_X, inimigo1_Y); //chama a funcao explosao na posicao da colisao

            //inimigo-1 volta a posicao inicial = left/top/movimento 
            eixo_Y = parseInt(Math.random() * 250);
                $("#inimigo-1").css("left", 950);
                $("#inimigo-1").css("top", eixo_Y);            
        }  
    //inimigo-2

        if (colisao2.length > 0) { 

            energiaAtual--;
            
            inimigo2_X = parseInt($("#inimigo-2").css("left"));
            inimigo2_Y = parseInt($("#inimigo-2").css("top"));
            explosao2(inimigo2_X, inimigo2_Y);  
        
        //por causa de alguns browsers, so funciona com o chamado de outra funcao(reposicionaInimigo2()), fora da funcao colisao
            $("#inimigo-2").remove(); //remove div inimigo-2

            reposicionaInimigo2(); //chamada de funcao = posicionamento inicial
    
        }
    //disparo ate o inimigo-1

        if (colisao3.length > 0) { 

            pontos = pontos + 100; //soma da qtt de disparos acertados no inimigo-1 
            velocidade = velocidade + 0.3; //aumenta a velocidade a cada "abate" - aumento dificuldade game
            
            //usar novamente a funcao da explosao1 - posicao inimigo1
            inimigo1_X = parseInt($("#inimigo-1").css("left"));
            inimigo1_Y = parseInt($("#inimigo-1").css("top"));
            explosao1(inimigo1_X, inimigo1_Y);  

            //reposiciona o disparo
            $("#disparo").css("left", 730); //limite #fundoGame

            //reposiciona inimigo-1
            eixo_Y = parseInt(Math.random() * 250);
                $("#inimigo-1").css("left", 730);
                $("#inimigo-1").css("top", eixo_Y);          
    
        }    
    //disparo ate o inimigo-2

        if (colisao4.length > 0) { 

            pontos = pontos + 50;

            //usar novamente a funcao da explosao2 - posicao inimigo2
            inimigo2_X = parseInt($("#inimigo-2").css("left"));
            inimigo2_Y = parseInt($("#inimigo-2").css("top")); 

            $("#inimigo-2").remove(); //remove div inimigo-2

            explosao2(inimigo2_X, inimigo2_Y); //chamada funcao explosao2 com a posicao do inimigo2
            $("#disparo").css("left", 775); //reposiciona disparo 

            reposicionaInimigo2(); //chamada de funcao
        }

    //jogador e ET
    
        if (colisao5.length > 0) {

            salvos++;
            somResgate.play();

            reposicionaAmigo(); //colisao = chamada da funcao (et volta a posicao inicial)
            
            $("#et").remove(); //et desaparece e chama a funcao reposicionaAmigo
        }

    //et e inimigo-2

    if (colisao6.length > 0) {

        perdidos++; //qtt amigos perdidos tela fundoGame = max = 3
        energiaAtual--; //qtt vida = 3            

        //var = posicao atual da div et
        amigoX = parseInt($("#et").css("left"));
        amigoY = parseInt($("#et").css("top"));

        explosao3(amigoX, amigoY); //chamada da funcao com os parametros acima

        $("#et").remove(); //remove a div et

        reposicionaAmigo(); //chamada da funcao = et volta a posicao inicial
    }


}
      
//explosao1

    function explosao1(inimigo1_X, inimigo1_Y) {

        somExplosao.play();

        $("#fundoGame").append("<div id = 'explosao1'></div>"); //add div explosao1 no HTML
        $("#explosao1").css("background-image", "url(img/explosao.png)"); //add img da div no css - tem que ser criada no JS por conta de outros browsers
        
        var div = $("#explosao1"); 
        div.css("top", inimigo1_Y); //posicao Y da colisao
        div.css("left", inimigo1_X);//posicao X da colisao

        /*  animate = funcao jquery:
            width: aumenta tamanho da img
            opacity: img vai desaparecendo 
            slow: velocidade da animacao */

        div.animate({width: 200, opacity: 0}, "medium"); 
                        
        //chama a funcao removeExplosao + tempo
        var tempoExplosao = window.setInterval(removeExplosao, 1000);

            function removeExplosao() { 
                
                div.remove(); //remove a explosao1
                window.clearInterval(tempoExplosao); // remove a var
                tempoExplosao = null; //zera a var
            }
    }

//reposiciona inimigo-2

    function reposicionaInimigo2() {
        
        var tempoColisao4 = window.setInterval(reposiciona4, 6000);
    
            function reposiciona4() {
            window.clearInterval(tempoColisao4);
            tempoColisao4 = null;
    
                if (fimdeJogo == false) {
                $("#fundoGame").append("<div id=inimigo-2></div");
                }
            }	
        } 

//explosao2

    function explosao2(inimigo2_X, inimigo2_Y) {

        somExplosao.play();

        $("#fundoGame").append("<div id = 'explosao2'></div>"); 
        $("#explosao2").css("background-image", "url(img/explosao.png)"); 

        var div2 = $("#explosao2"); 
        div2.css("top", inimigo2_Y); 
        div2.css("left", inimigo2_X);

        div2.animate({width: 200, opacity: 0}, "medium"); 
           
        var tempoExplosao2 = window.setInterval(removeExplosao2, 1000);

            function removeExplosao2() { 
                
                div2.remove(); //remove a explosao1
                window.clearInterval(tempoExplosao2); // remove a var
                tempoExplosao2 = null; //zera a var
            }

    }

//reposiciona ET

    function reposicionaAmigo() {

        //funcao tempo = reposiciona o et na posicao inicial 3 sgs apos a colisao com o jogador 
        
            var tempoAmigo = window.setInterval(reposiciona6, 3000);
            
            function reposiciona6() {
                window.clearInterval(tempoAmigo);
                tempoAmigo = null;

                if (fimdeJogo == false) { //somente se o jogo nao chegou ao final

                    $("#fundoGame").append("<div id ='et' class = 'anima-2'></div>");//cria novamente a div et --> tempoAmigo
                }
            }

    }

//explosao3

    function explosao3(amigoX, amigoY) {

        somPerdido.play();

        //cria a div explosao3 = aparece a et vermelho qdo ocorre a colisao com o inimigo-2 na posicao da colisao dos dois
        $("#fundoGame").append("<div id= 'explosao3' class = 'anima-4'> </div>");
        $("#explosao3").css("top", amigoY);
        $("#explosao3").css("left", amigoX);

        var tempoExplosao3 = window.setInterval(resetaExplosao3, 1000); //apos 1 sg, a funcao explosao3 eh apagada pela chamada da funcao resetaExplosao3

            function resetaExplosao3() {

                $("#explosao3").remove();
                window.clearInterval(tempoExplosao3);
                tempoExplosao3 = null;
            }
    }
//--------------------------PLACAR----------------------------

    function placar() {
        //sempre ira atualizar o a div placar durante o jogo, ja que esta dentro da funcao loop        
           
       $("#placar").html("<h2> Pontos: " + pontos + " Salvos: " + salvos  + " Perdidos: " + perdidos + "</h2>");

    }

//----------------------------ENERGIA------------------------------

    function energia() {
    /*atualiza qtt de vidas jogador com a var energia
    atual 
        chamada na funcao loop + add img na div se for a condicao chamada*/

        if (energiaAtual == 3) {
            $("#energia").css("background-image", "url(img/cor3.png)");
        }

        if (energiaAtual == 2) {
            $("#energia").css("background-image", "url(img/cor2.png)");
        }

        if (energiaAtual == 1) {
            $("#energia").css("background-image", "url(img/cor1.png)");
        }

        if (energiaAtual == 0) {
            $("#energia").css("background-image", "url(img/cor0.png)");  
            
        //total de vidas = 0, logo, finaliza o jogo - chamada da funcao gameover
            gameOver();
        }
        
    }

//---------------------------GAME OVER---------------------------------
    
    function gameOver() { 
        
        fimdeJogo = true; //evita reposicionamento do et na tela ao acabar as vidas do jogador
        musica.pause(); //pausar musica do jogo
        somGameover.play(); //iniciar a musica do placar final

        window.clearInterval(jogo.timer); //para a funcao loop (principal do jogo)
        jogo.timer = null; //zera a var

        //remocao dos elementos da  tela
        $("#jogador").remove();
        $("#inimigo-1").remove();
        $("#inimigo-2").remove();
        $("#et").remove();
        $("#energia").remove();
        $("#placar").remove();                

        //add nova div do placar final       

        $("#fundoGame").append("<div id = 'placarFinal'></div>");

        //add texto placar final + div reiniciar ao clicar 
        $("#placarFinal").html("<h1> Game Over <i class='fas fa-meteor'> </i></h1>" + "<h3><b> Total de pontos: </b></h3>" + pontos + "<h3><b> Amigos salvos: </b></h3>" + salvos + "<p><button role ='button' id = 'reinicia' onClick= 'reiniciaJogo()' <font color = red> Jogar Novamente <i class = 'fas fa-gamepad'> </i></font></p> </button></p>");       

    }   


}
//----------------------------------REINICIAR JOGO-----------------------------------

function reiniciaJogo() { //fora da funcao start, se nao nao funciona
        
    somGameover.pause(); //para a musica gameOver
    $("#placarFinal").remove(); //div placar final desaparece
    start(); //jogo volta para a funcao principal e reinicia o jogo
    

}
    


    


