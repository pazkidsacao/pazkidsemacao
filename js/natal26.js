import { supabase } from "./supabase.js";

// ======================================================
// CONFIGURAÇÕES
// ======================================================

const BUCKET_FOTOS = "fotos-criancas";

// ======================================================
// ELEMENTOS DA PÁGINA
// ======================================================

const elementos = {

 
// --------------------------------------------------
// GRID
// --------------------------------------------------

gridCriancas:
    document.getElementById("grid-criancas"),


// --------------------------------------------------
// MODAL DA CRIANÇA
// --------------------------------------------------

modal:
    document.getElementById("modal-crianca"),

fecharModal:
    document.getElementById("fechar-modal"),

modalFoto:
    document.getElementById("modal-foto"),

modalNome:
    document.getElementById("modal-nome"),

modalIdade:
    document.getElementById("modal-idade"),

modalApresentacao:
    document.getElementById("modal-apresentacao"),

modalApadrinhar:
    document.getElementById("modal-apadrinhar"),


// --------------------------------------------------
// MODAL DO FORMULÁRIO
// --------------------------------------------------

modalFormulario:
    document.getElementById("modal-formulario"),

fecharModalFormulario:
    document.getElementById(
        "fechar-modal-formulario"
    ),

formFotoCrianca:
    document.getElementById(
        "form-foto-crianca"
    ),

formNomeCrianca:
    document.getElementById(
        "form-nome-crianca"
    ),

formIdadeCrianca:
    document.getElementById(
        "form-idade-crianca"
    ),


// --------------------------------------------------
// FORMULÁRIO
// --------------------------------------------------

nome:
    document.getElementById("nome"),

telefone:
    document.getElementById("telefone"),

email:
    document.getElementById("email"),

campus:
    document.getElementById("campus"),

btnApadrinhar:
    document.getElementById(
        "btn-apadrinhar"
    )
 

};

// ======================================================
// ESTADO
// ======================================================

let criancaSelecionada = null;

// ======================================================
// URL DA FOTO
// ======================================================

function obterUrlFoto(nomeArquivo) {

 
if (!nomeArquivo) {

    return "";

}


if (
    nomeArquivo.startsWith("http://") ||
    nomeArquivo.startsWith("https://")
) {

    return nomeArquivo;

}


const { data } =
    supabase
        .storage
        .from(BUCKET_FOTOS)
        .getPublicUrl(nomeArquivo);


return data?.publicUrl || "";
 

}

// ======================================================
// CALCULAR IDADE
// ======================================================

function calcularIdade(dataNascimento) {

 
if (!dataNascimento) {

    return "";

}


const nascimento =
    new Date(dataNascimento);


const hoje =
    new Date();


let idade =
    hoje.getFullYear() -
    nascimento.getFullYear();


const diferencaMes =
    hoje.getMonth() -
    nascimento.getMonth();


if (
    diferencaMes < 0 ||
    (
        diferencaMes === 0 &&
        hoje.getDate() < nascimento.getDate()
    )
) {

    idade--;

}


return `${idade} anos`;
 

}

// ======================================================
// CARREGAR CRIANÇAS
// ======================================================

async function carregarCriancas() {

 
elementos.gridCriancas.innerHTML = `

    <p class="mensagem-carregando">
        Carregando crianças...
    </p>

`;


const { data, error } =

    await supabase

        .from("criancas_natal26")

        .select(`
            id,
            foto_url,
            nome,
            data_nascimento,
            serie_escolar,
            tamanho_blusa,
            tamanho_calca,
            tamanho_calcado,
            hobby
        `)

        .eq(
            "adotada",
            "Não"
        )

        .order(
            "nome"
        );


// --------------------------------------------------
// ERRO
// --------------------------------------------------

if (error) {

    console.error(
        "Erro ao carregar crianças:",
        error
    );


    elementos.gridCriancas.innerHTML = `

        <p class="mensagem-erro">
            Não foi possível carregar
            as crianças.
        </p>

    `;

    return;

}


// --------------------------------------------------
// NENHUMA CRIANÇA
// --------------------------------------------------

if (
    !data ||
    data.length === 0
) {

    elementos.gridCriancas.innerHTML = `

        <p class="mensagem-erro">
            No momento não há crianças
            disponíveis para apadrinhamento.
        </p>

    `;

    return;

}


// --------------------------------------------------
// LIMPA A GRID
// --------------------------------------------------

elementos.gridCriancas.innerHTML = "";


// --------------------------------------------------
// CRIA OS CARDS
// --------------------------------------------------

data.forEach(
    crianca => {

        const foto =
            obterUrlFoto(
                crianca.foto_url
            );


        const idade =
            calcularIdade(
                crianca.data_nascimento
            );


        const card =
            document.createElement(
                "div"
            );


        card.className =
            "card-crianca";


        card.innerHTML = `

            <img
                src="${foto}"
                alt="Foto de ${crianca.nome}"
                loading="lazy"
            >

            <div class="info-crianca">

                <h3>
                    ${crianca.nome}
                </h3>

                <p>
                    ${idade}
                </p>

            </div>

        `;


        card.addEventListener(
            "click",
            () => {

                abrirModal(
                    crianca
                );

            }
        );


        elementos.gridCriancas
            .appendChild(card);

    }
);
 

}

// ======================================================
// ABRIR MODAL DA CRIANÇA
// ======================================================

function abrirModal(crianca) {

 
criancaSelecionada =
    crianca;


const foto =
    obterUrlFoto(
        crianca.foto_url
    );


elementos.modalFoto.src =
    foto;


elementos.modalFoto.alt =
    `Foto de ${crianca.nome}`;


elementos.modalNome.textContent =
    crianca.nome;


elementos.modalIdade.textContent =
    calcularIdade(
        crianca.data_nascimento
    );


const idade =
    calcularIdade(
        crianca.data_nascimento
    );


const serie =
    crianca.serie_escolar ||
    "não informada";


const blusa =
    crianca.tamanho_blusa ||
    "não informado";


const calca =
    crianca.tamanho_calca ||
    "não informado";


const calcado =
    crianca.tamanho_calcado ||
    "não informado";


const hobby =
    crianca.hobby ||
    "brincar";


elementos.modalApresentacao.innerHTML = `

    <p>

        Olá, meu nome é
        <strong>${crianca.nome}</strong>,

        tenho
        <strong>${idade}</strong>

        e estou cursando
        <strong>${serie}</strong>.

    </p>


    <p>

        Uso blusa tamanho
        <strong>${blusa}</strong>,

        calça tamanho
        <strong>${calca}</strong>

        e calçado tamanho
        <strong>${calcado}</strong>.

    </p>


    <p>

        Meu hobby predileto é brincar de
        <strong>${hobby}</strong>.

    </p>

`;


elementos.modal.classList.add(
    "aberto"
);
 

}

// ======================================================
// FECHAR MODAL DA CRIANÇA
// ======================================================

function fecharModal() {

 
elementos.modal.classList.remove(
    "aberto"
);
 

}

// ======================================================
// ABRIR MODAL DO FORMULÁRIO
// ======================================================

function abrirModalFormulario() {

 
if (!criancaSelecionada) {

    return;

}


const foto =
    obterUrlFoto(
        criancaSelecionada.foto_url
    );


const idade =
    calcularIdade(
        criancaSelecionada.data_nascimento
    );


elementos.formFotoCrianca.src =
    foto;


elementos.formFotoCrianca.alt =
    `Foto de ${criancaSelecionada.nome}`;


elementos.formNomeCrianca.textContent =
    criancaSelecionada.nome;


elementos.formIdadeCrianca.textContent =
    idade;


elementos.modalFormulario
    .classList.add(
        "aberto"
    );
 

}

// ======================================================
// FECHAR MODAL DO FORMULÁRIO
// ======================================================

function fecharModalFormulario() {

 
elementos.modalFormulario
    .classList.remove(
        "aberto"
    );
 

}

// ======================================================
// MÁSCARA DE TELEFONE
// ======================================================

function aplicarMascaraTelefone(valor) {

 
valor =
    valor.replace(
        /\D/g,
        ""
    );


if (
    valor.length > 11
) {

    valor =
        valor.slice(
            0,
            11
        );

}


if (
    valor.length > 10
) {

    return valor.replace(
        /(\d{2})(\d{5})(\d{4})/,
        "($1) $2-$3"
    );

}


if (
    valor.length > 6
) {

    return valor.replace(
        /(\d{2})(\d{4})(\d+)/,
        "($1) $2-$3"
    );

}


if (
    valor.length > 2
) {

    return valor.replace(
        /(\d{2})(\d+)/,
        "($1) $2"
    );

}


return valor;
 

}

// ======================================================
// VALIDAÇÃO DE E-MAIL
// ======================================================

function emailValido(email) {

 
if (
    email.trim() === ""
) {

    return true;

}


return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    .test(email);
 

}

// ======================================================
// VALIDAÇÃO DO FORMULÁRIO
// ======================================================

function validarFormulario() {

 
if (
    elementos.nome.value.trim() === ""
) {

    alert(
        "Informe seu nome."
    );

    elementos.nome.focus();

    return false;

}


if (
    elementos.telefone.value.length < 14
) {

    alert(
        "Informe um telefone válido."
    );

    elementos.telefone.focus();

    return false;

}


if (
    !emailValido(
        elementos.email.value
    )
) {

    alert(
        "Informe um e-mail válido."
    );

    elementos.email.focus();

    return false;

}


if (
    elementos.campus.value === ""
) {

    alert(
        "Selecione seu campus."
    );

    elementos.campus.focus();

    return false;

}


return true;
 

}

// ======================================================
// SUPABASE
// CONFIRMAR APADRINHAMENTO
// ======================================================

async function confirmarApadrinhamento() {

 
if (!criancaSelecionada) {

    return null;

}


const dados = {

    nome_padrinho:
        elementos.nome.value.trim(),

    tel_padrinho:
        elementos.telefone.value.trim(),

    email_padrinho:
        elementos.email.value.trim(),

    campus_padrinho:
        elementos.campus.value,

    adotada:
        "Sim",

    data_adocao:
        new Date().toISOString(),

    status_entrega:
        "Pendente"

};


const { data, error } =

    await supabase

        .from("criancas_natal26")

        .update(dados)

        .eq(
            "id",
            criancaSelecionada.id
        )

        .eq(
            "adotada",
            "Não"
        )

        .select()
        .maybeSingle();


if (error) {

    console.error(
        "Erro ao confirmar apadrinhamento:",
        error
    );


    alert(
        "Não foi possível confirmar o apadrinhamento. Tente novamente."
    );


    return null;

}


if (!data) {

    alert(
        "Esta criança acabou de ser escolhida por outra pessoa. Por favor, escolha outra criança."
    );


    fecharModalFormulario();


    await carregarCriancas();


    return null;

}


return data;
 

}

// ======================================================
// EVENTOS
// ======================================================

elementos.fecharModal.addEventListener(
"click",
fecharModal
);

elementos.modal.addEventListener(
"click",
evento => {

 
    if (
        evento.target ===
        elementos.modal
    ) {

        fecharModal();

    }

}
 

);

elementos.fecharModalFormulario
.addEventListener(
"click",
fecharModalFormulario
);

elementos.modalFormulario
.addEventListener(
"click",
evento => {

 
        if (
            evento.target ===
            elementos.modalFormulario
        ) {

            fecharModalFormulario();

        }

    }
);
 

elementos.modalApadrinhar
.addEventListener(
"click",
() => {

 
        if (
            !criancaSelecionada
        ) {

            return;

        }


        fecharModal();

        abrirModalFormulario();

    }
);
 

elementos.telefone
.addEventListener(
"input",
evento => {

 
        evento.target.value =
            aplicarMascaraTelefone(
                evento.target.value
            );

    }
);
 

elementos.btnApadrinhar
.addEventListener(
"click",
async () => {

 
        if (
            !criancaSelecionada
        ) {

            alert(
                "Selecione uma criança."
            );

            return;

        }


        if (
            !validarFormulario()
        ) {

            return;

        }


        elementos.btnApadrinhar.disabled =
            true;


        elementos.btnApadrinhar.textContent =
            "Confirmando...";


        const registro =
            await confirmarApadrinhamento();


        if (!registro) {

            elementos.btnApadrinhar.disabled =
                false;


            elementos.btnApadrinhar.textContent =
                "Confirmar apadrinhamento";


            return;

        }


        // --------------------------------------------------
        // VAI PARA A CONFIRMAÇÃO
        // O ID é enviado pela URL.
        // Nenhum dado é salvo no navegador.
        // --------------------------------------------------

        window.location.href =
            `/pages/natal26_confirmacao.html?id=${criancaSelecionada.id}`;

    }
);
 

// ======================================================
// ESC
// ======================================================

document.addEventListener(
"keydown",
evento => {

 
    if (
        evento.key === "Escape"
    ) {

        elementos.modal.classList.remove(
            "aberto"
        );

        elementos.modalFormulario.classList.remove(
            "aberto"
        );

    }

}


);

// ======================================================
// INICIALIZAÇÃO
// ======================================================

carregarCriancas();
