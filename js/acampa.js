// ======================================================
// SUPABASE
// ======================================================

import { supabase } from "./supabase.js";


// ======================================================
// CONFIGURAÇÕES
// ======================================================

const VALOR_INSCRICAO = 500;


// ======================================================
// ELEMENTOS DA PÁGINA
// ======================================================

const elementos = {

    btnMais: document.getElementById("mais"),
    btnMenos: document.getElementById("menos"),

    quantidade: document.getElementById("quantidade"),
    valorTotal: document.getElementById("valor-total"),

    nome: document.getElementById("nome"),
    telefone: document.getElementById("telefone"),
    email: document.getElementById("email"),
    campus: document.getElementById("campus"),

    btnApadrinhar: document.getElementById("btn-apadrinhar")

};


// ======================================================
// ESTADO
// ======================================================

let quantidade = 1;


// ======================================================
// ATUALIZAÇÃO DE VALORES
// ======================================================

function atualizarTotal(){

    elementos.quantidade.textContent = quantidade;

    elementos.valorTotal.textContent =
        (quantidade * VALOR_INSCRICAO)
        .toLocaleString("pt-BR",{
            style:"currency",
            currency:"BRL"
        });

}


// ======================================================
// MÁSCARA TELEFONE
// ======================================================

function aplicarMascaraTelefone(valor){

    valor = valor.replace(/\D/g,"");

    if(valor.length > 11){
        valor = valor.slice(0,11);
    }


    if(valor.length > 10){

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

function emailValido(email){

    if(email.trim() === ""){
        return true;
    }

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

}



function validarFormulario(){

    if(elementos.nome.value.trim() === ""){

        alert("Informe seu nome.");
        elementos.nome.focus();

        return false;

    }


    if(elementos.telefone.value.length < 14){

        alert("Informe um telefone válido.");
        elementos.telefone.focus();

        return false;

    }


    if(!emailValido(elementos.email.value)){

        alert("Informe um e-mail válido.");
        elementos.email.focus();

        return false;

    }


    if(elementos.campus.value === ""){

        alert("Selecione seu campus.");
        elementos.campus.focus();

        return false;

    }


    return true;

}


// ======================================================
// SUPABASE - GRAVAÇÃO
// ======================================================

async function salvarControleAcampa(){


    const dados = {

        nome: elementos.nome.value.trim(),

        telefone: elementos.telefone.value.trim(),

        email: elementos.email.value.trim(),

        campus: elementos.campus.value,

        quantidade_criancas: quantidade,

        status: "pendente"

    };


    const { error } = await supabase
        .from("controle_acampa")
        .insert([dados]);


    /*if(error){

        console.error("Erro Supabase:", error);

        alert(
            "Não foi possível salvar sua inscrição."
        );

        return false;

    } */

    if(error){

    console.error("Erro Supabase completo:", error);

    console.log("Mensagem:", error.message);
    console.log("Detalhes:", error.details);
    console.log("Hint:", error.hint);
    console.log("Código:", error.code);

    alert(
        "Erro: " + error.message
    );

    return null;

    }


    return true;


}


// ======================================================
// LOCAL STORAGE
// ======================================================

function salvarDadosPagamento(registro){


    const dadosPagamento = {


        id: registro.id,

        nome: elementos.nome.value.trim(),

        telefone: elementos.telefone.value.trim(),

        email: elementos.email.value.trim(),

        campus: elementos.campus.value,


        quantidade: quantidade,

        valorUnitario: VALOR_INSCRICAO,

        valorTotal:
            quantidade * VALOR_INSCRICAO

    };


    localStorage.setItem(
        "apadrinhamentoAcampa",
        JSON.stringify(dadosPagamento)
    );


}


// ======================================================
// NAVEGAÇÃO
// ======================================================

function irParaPagamento(){

   window.location.href = "/pagamento";
  /* window.location.href = "./pagto-acampa.html";*/ 

}


// ======================================================
// EVENTOS
// ======================================================


elementos.btnMais.addEventListener("click",()=>{

    quantidade++;

    atualizarTotal();

});



elementos.btnMenos.addEventListener("click",()=>{


    if(quantidade > 1){

        quantidade--;

        atualizarTotal();

    }

});



elementos.telefone.addEventListener(
    "input",
    (evento)=>{

        evento.target.value =
            aplicarMascaraTelefone(evento.target.value);

    }
);



elementos.btnApadrinhar.addEventListener(
    "click",
    async ()=>{


        if(!validarFormulario()){
            return;
        }


        const registro =
            await salvarControleAcampa();


        if(!registro){
            return;
        }


        salvarDadosPagamento(registro);


        irParaPagamento();


    }
);


// ======================================================
// INICIALIZAÇÃO
// ======================================================

atualizarTotal();