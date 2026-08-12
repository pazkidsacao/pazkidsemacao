// ======================================================
// SUPABASE
// ======================================================

import { supabase } from "./supabase.js";


// ======================================================
// CONFIGURAÇÕES
// ======================================================

const VALOR_INSCRICAO = 500;

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

// Criança escolhida pelo usuário
let criancaSelecionada = null;


// ======================================================
// URL DA FOTO
// ======================================================

function obterUrlFoto(nomeArquivo) {

    if (!nomeArquivo) {
        return "";
    }


    const { data } =

        supabase
            .storage
            .from(BUCKET_FOTOS)
            .getPublicUrl(nomeArquivo);


    return data.publicUrl;

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

            .from("acampa")

            .select(`
                id,
                foto_url,
                nome,
                data_nascimento,
                sexo,
                idade,
                apadrinhada
            `)

            .eq(
                "apadrinhada",
                "nao"
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
                        ${crianca.idade}
                    </p>

                </div>

            `;


            // ------------------------------------------
            // CLIQUE NO CARD
            // ------------------------------------------

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

    // Guarda a criança escolhida
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
        crianca.idade;


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


    elementos.formFotoCrianca.src =
        foto;


    elementos.formFotoCrianca.alt =
        `Foto de ${criancaSelecionada.nome}`;


    elementos.formNomeCrianca.textContent =
        criancaSelecionada.nome;


    elementos.formIdadeCrianca.textContent =
        criancaSelecionada.idade;


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

    // --------------------------------------------------
    // NOME
    // --------------------------------------------------

    if (
        elementos.nome.value.trim() === ""
    ) {

        alert(
            "Informe seu nome."
        );

        elementos.nome.focus();

        return false;

    }


    // --------------------------------------------------
    // TELEFONE
    // --------------------------------------------------

    if (
        elementos.telefone.value.length < 14
    ) {

        alert(
            "Informe um telefone válido."
        );

        elementos.telefone.focus();

        return false;

    }


    // --------------------------------------------------
    // E-MAIL
    // --------------------------------------------------

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


    // --------------------------------------------------
    // CAMPUS
    // --------------------------------------------------

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
// SUPABASE - GRAVAÇÃO
// ======================================================

async function salvarControleAcampa() {

    const dados = {

        nome:
            elementos.nome.value.trim(),

        telefone:
            elementos.telefone.value.trim(),

        email:
            elementos.email.value.trim(),

        campus:
            elementos.campus.value,

        // ID DA CRIANÇA ESCOLHIDA
        id_crianca:
            criancaSelecionada.id,

        // Agora cada apadrinhamento é de uma única criança
        quantidade_criancas: 1,

        status:
            "pendente"

    };


    const { data, error } =

        await supabase

            .from("controle_acampa")

            .insert([dados])

            .select()
            .single();


    if (error) {

        console.error(
            "Erro Supabase completo:",
            error
        );

        console.log(
            "Mensagem:",
            error.message
        );

        console.log(
            "Detalhes:",
            error.details
        );

        console.log(
            "Hint:",
            error.hint
        );

        console.log(
            "Código:",
            error.code
        );

        alert(
            "Erro: " + error.message
        );

        return null;

    }


    return data;
}

// ======================================================
// LOCAL STORAGE
// ======================================================

function salvarDadosPagamento(
    registro
) {

    const dadosPagamento = {

        // ID do registro de controle
        id:
            registro.id,


        // Dados do padrinho
        nome:
            elementos.nome.value.trim(),

        telefone:
            elementos.telefone.value.trim(),

        email:
            elementos.email.value.trim(),

        campus:
            elementos.campus.value,


        // Sempre uma inscrição
        quantidade:
            1,


        valorUnitario:
            VALOR_INSCRICAO,


        valorTotal:
            VALOR_INSCRICAO,


        // Criança escolhida
        crianca_id:
            criancaSelecionada
                ? criancaSelecionada.id
                : null,


        // Informações adicionais da criança
        crianca_nome:
            criancaSelecionada
                ? criancaSelecionada.nome
                : null,

        crianca_idade:
            criancaSelecionada
                ? criancaSelecionada.idade
                : null,

        crianca_foto:
            criancaSelecionada
                ? criancaSelecionada.foto_url
                : null

    };


    localStorage.setItem(

        "apadrinhamentoAcampa",

        JSON.stringify(
            dadosPagamento
        )

    );

}


// ======================================================
// NAVEGAÇÃO
// ======================================================

function irParaPagamento() {

    window.location.href =
        "/pagamento";

}


// ======================================================
// EVENTO
// FECHAR MODAL DA CRIANÇA
// ======================================================

elementos.fecharModal.addEventListener(
    "click",
    fecharModal
);


// ======================================================
// EVENTO
// CLICAR FORA DO MODAL DA CRIANÇA
// ======================================================

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


// ======================================================
// EVENTO
// FECHAR MODAL DO FORMULÁRIO
// ======================================================

elementos.fecharModalFormulario
    .addEventListener(
        "click",
        fecharModalFormulario
    );


// ======================================================
// EVENTO
// CLICAR FORA DO MODAL DO FORMULÁRIO
// ======================================================

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


// ======================================================
// EVENTO
// APADRINHAR CRIANÇA
// ======================================================

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


// ======================================================
// EVENTO
// MÁSCARA DO TELEFONE
// ======================================================

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


// ======================================================
// EVENTO
// CONTINUAR PARA PAGAMENTO
// ======================================================

elementos.btnApadrinhar
    .addEventListener(
        "click",
        async () => {

            // ------------------------------------------
            // Verifica criança
            // ------------------------------------------

            if (
                !criancaSelecionada
            ) {

                alert(
                    "Selecione uma criança."
                );

                return;

            }


            // ------------------------------------------
            // Valida formulário
            // ------------------------------------------

            if (
                !validarFormulario()
            ) {

                return;

            }


            // ------------------------------------------
            // Evita múltiplos cliques
            // ------------------------------------------

            elementos.btnApadrinhar.disabled =
                true;

            elementos.btnApadrinhar.textContent =
                "Processando...";


            // ------------------------------------------
            // Salva no Supabase
            // ------------------------------------------

            const registro =
                await salvarControleAcampa();


            // ------------------------------------------
            // Se deu erro
            // ------------------------------------------

            if (!registro) {

                elementos.btnApadrinhar.disabled =
                    false;

                elementos.btnApadrinhar.textContent =
                    "Continuar para pagamento";

                return;

            }


            // ------------------------------------------
            // Salva dados para pagamento
            // ------------------------------------------

            salvarDadosPagamento(
                registro
            );


            // ------------------------------------------
            // Vai para pagamento
            // ------------------------------------------

            irParaPagamento();

        }
    );


// ======================================================
// FECHAR MODAIS COM ESC
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