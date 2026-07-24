// ======================================================
// ELEMENTOS
// ======================================================

const btnPix = document.getElementById("btn-pix");
const btnCartao = document.getElementById("btn-cartao");

const areaPix = document.getElementById("area-pix");
const areaCartao = document.getElementById("area-cartao");


// ======================================================
// DADOS
// ======================================================

const dados = JSON.parse(
    localStorage.getItem("apadrinhamentoAcampa")
);


// ======================================================
// VALIDAÇÃO
// ======================================================

if(!dados){

    window.location.href="/pages/acampa.html";

}


// ======================================================
// FUNÇÕES
// ======================================================

function preencherResumo(){

    document.getElementById("quantidade").textContent =
        dados.quantidade +
        (dados.quantidade > 1 ? " inscrições" : " inscrição");

    document.getElementById("valor-total").textContent =
        dados.valorTotal.toLocaleString("pt-BR",{
            style:"currency",
            currency:"BRL"
        });

}


function mostrarPix(){

    btnPix.classList.add("ativa");
    btnCartao.classList.remove("ativa");

    areaPix.classList.remove("escondido");
    areaCartao.classList.add("escondido");

}


function mostrarCartao(){

    btnCartao.classList.add("ativa");
    btnPix.classList.remove("ativa");

    areaCartao.classList.remove("escondido");
    areaPix.classList.add("escondido");

}


function copiarChave(id){

    const texto =
        document.getElementById(id).innerText;

    navigator.clipboard.writeText(texto);

}


// ======================================================
// EVENTOS
// ======================================================

btnPix.addEventListener("click",mostrarPix);

btnCartao.addEventListener("click",mostrarCartao);


document.querySelectorAll(".btn-copiar")
.forEach(botao=>{

    botao.addEventListener("click",()=>{

        copiarChave(botao.dataset.chave);

        botao.textContent="Copiado!";

        setTimeout(()=>{

            botao.textContent="Copiar";

        },2000);

    });

});


// ======================================================
// INICIALIZAÇÃO
// ======================================================

preencherResumo();

mostrarPix();