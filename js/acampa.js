// ======================================================
// CONFIGURAÇÕES
// ======================================================

const VALOR_INSCRICAO = 250;


// ======================================================
// ELEMENTOS
// ======================================================

const btnMais = document.getElementById("mais");
const btnMenos = document.getElementById("menos");

const spanQuantidade = document.getElementById("quantidade");
const valorTotal = document.getElementById("valor-total");

const nome = document.getElementById("nome");
const telefone = document.getElementById("telefone");
const email = document.getElementById("email");
const campus = document.getElementById("campus");

const btnApadrinhar = document.getElementById("btn-apadrinhar");


// ======================================================
// VARIÁVEIS
// ======================================================

let quantidade = 1;


// ======================================================
// FUNÇÕES
// ======================================================

function atualizarTotal() {

    spanQuantidade.textContent = quantidade;

    valorTotal.textContent =
        (quantidade * VALOR_INSCRICAO)
        .toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });

}


function emailValido(emailDigitado) {

    if (emailDigitado.trim() === "")
        return true;

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailDigitado);

}


function aplicarMascaraTelefone(valor) {

    valor = valor.replace(/\D/g, "");

    if (valor.length > 11)
        valor = valor.slice(0,11);

    if (valor.length > 10){

        return valor.replace(
            /(\d{2})(\d{5})(\d{4})/,
            "($1) $2-$3"
        );

    }

    if(valor.length > 6){

        return valor.replace(
            /(\d{2})(\d{4})(\d+)/,
            "($1) $2-$3"
        );

    }

    if(valor.length > 2){

        return valor.replace(
            /(\d{2})(\d+)/,
            "($1) $2"
        );

    }

    return valor;

}


// ======================================================
// VALIDAÇÃO
// ======================================================

function validarFormulario(){

    if(nome.value.trim() === ""){

        alert("Informe seu nome.");

        nome.focus();

        return false;

    }

    if(telefone.value.trim().length < 14){

        alert("Informe um telefone válido.");

        telefone.focus();

        return false;

    }

    if(!emailValido(email.value)){

        alert("Informe um e-mail válido.");

        email.focus();

        return false;

    }

    if(campus.value === ""){

        alert("Selecione seu campus.");

        campus.focus();

        return false;

    }

    return true;

}


// ======================================================
// PERSISTÊNCIA
// ======================================================

function salvarDados(){

    const dados = {

        nome: nome.value.trim(),

        telefone: telefone.value.trim(),

        email: email.value.trim(),

        campus: campus.value,

        quantidade,

        valorUnitario: VALOR_INSCRICAO,

        valorTotal: quantidade * VALOR_INSCRICAO

    };

    localStorage.setItem(
        "apadrinhamentoAcampa",
        JSON.stringify(dados)
    );

}


// ======================================================
// NAVEGAÇÃO
// ======================================================

function abrirPagamento(){

    window.location.href = "/pages/pagto-acampa.html";

}


// ======================================================
// EVENTOS
// ======================================================

btnMais.addEventListener("click",()=>{

    quantidade++;

    atualizarTotal();

});


btnMenos.addEventListener("click",()=>{

    if(quantidade>1){

        quantidade--;

        atualizarTotal();

    }

});


telefone.addEventListener("input",(e)=>{

    e.target.value =
        aplicarMascaraTelefone(e.target.value);

});


btnApadrinhar.addEventListener("click",()=>{

    if(!validarFormulario())
        return;

    salvarDados();

    abrirPagamento();

});


// ======================================================
// INICIALIZAÇÃO
// ======================================================

atualizarTotal();