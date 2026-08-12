// ======================================================
// SUPABASE
// ======================================================

import { supabase } from "./supabase.js";


// ======================================================
// ELEMENTOS
// ======================================================

const tabela =
    document.getElementById("tabela");

const pesquisa =
    document.getElementById("pesquisa");

const total =
    document.getElementById("total");

const pendentes =
    document.getElementById("pendentes");

const pagos =
    document.getElementById("pagos");

const valor =
    document.getElementById("valor");


// ======================================================
// ESTADO
// ======================================================

let registros = [];


// ======================================================
// CARREGAR REGISTROS
// ======================================================

async function carregar() {

    tabela.innerHTML = `
        <tr>
            <td colspan="9" class="carregando">
                Carregando registros...
            </td>
        </tr>
    `;


    const { data, error } = await supabase

        .from("controle_acampa")

        .select("*")

        .order(
            "created_at",
            {
                ascending: false
            }
        );


    if (error) {

        console.error(
            "Erro ao carregar registros:",
            error
        );

        tabela.innerHTML = `
            <tr>
                <td colspan="9" class="mensagem-tabela">
                    Não foi possível carregar os registros.
                </td>
            </tr>
        `;

        alert(error.message);

        return;
    }


    registros = data || [];


    atualizarResumo();

    montarTabela();
}


// ======================================================
// RESUMO
// ======================================================

function atualizarResumo() {

    total.textContent =
        registros.length;


    const listaPendentes =
        registros.filter(
            registro =>
                registro.status === "pendente"
        );


    const listaPagos =
        registros.filter(
            registro =>
                registro.status === "pago"
        );


    pendentes.textContent =
        listaPendentes.length;


    pagos.textContent =
        listaPagos.length;


    // ==================================================
    // VALOR ARRECADADO
    // ==================================================

    const arrecadado =
        listaPagos.reduce(

            (soma, registro) => {

                /*
                 * Cada registro corresponde
                 * a uma criança.
                 *
                 * Mantemos quantidade_criancas
                 * para compatibilidade com os
                 * registros existentes.
                 */

                const quantidade =
                    Number(
                        registro.quantidade_criancas
                    ) || 1;


                return soma +
                    (
                        quantidade * 500
                    );

            },

            0
        );


    valor.textContent =
        arrecadado.toLocaleString(
            "pt-BR",
            {
                style: "currency",
                currency: "BRL"
            }
        );
}


// ======================================================
// MONTAR TABELA
// ======================================================

function montarTabela() {

    tabela.innerHTML = "";


    const filtro =
        pesquisa.value
            .trim()
            .toLowerCase();


    const resultados =
        registros.filter(
            registro => {

                const nome =
                    (
                        registro.nome || ""
                    ).toLowerCase();


                const telefone =
                    (
                        registro.telefone || ""
                    ).toLowerCase();


                const email =
                    (
                        registro.email || ""
                    ).toLowerCase();


                const campus =
                    (
                        registro.campus || ""
                    ).toLowerCase();


                const idCrianca =
                    String(
                        registro.id_crianca || ""
                    ).toLowerCase();


                return (

                    nome.includes(filtro) ||

                    telefone.includes(filtro) ||

                    email.includes(filtro) ||

                    campus.includes(filtro) ||

                    idCrianca.includes(filtro)

                );

            }
        );


    // ==================================================
    // NENHUM RESULTADO
    // ==================================================

    if (
        resultados.length === 0
    ) {

        tabela.innerHTML = `
            <tr>

                <td
                    colspan="9"
                    class="mensagem-tabela"
                >

                    Nenhum registro encontrado.

                </td>

            </tr>
        `;

        return;
    }


    // ==================================================
    // CRIAR LINHAS
    // ==================================================

    resultados.forEach(
        registro => {


            // ==========================================
            // DATA
            // ==========================================

            let dataFormatada = "-";


            if (
                registro.created_at
            ) {

                dataFormatada =
                    new Date(
                        registro.created_at
                    ).toLocaleDateString(
                        "pt-BR"
                    );

            }


            // ==========================================
            // VALORES
            // ==========================================

            const nome =
                registro.nome || "-";


            const telefone =
                registro.telefone || "-";


            const email =
                registro.email || "-";


            const campus =
                registro.campus || "-";


            const idCrianca =
                registro.id_crianca ?? "-";


            const quantidade =
                registro.quantidade_criancas ?? 1;


            const status =
                registro.status || "pendente";


            // ==========================================
            // BOTÃO
            // ==========================================

            let botaoAcao = "";


            if (
                status === "pendente"
            ) {

                botaoAcao = `

                    <button

                        class="btn-pago"

                        onclick="
                            alterarStatus(
                                ${registro.id},
                                'pago'
                            )
                        "

                    >

                        Marcar Pago

                    </button>

                `;

            } else {

                botaoAcao = `

                    <button

                        class="btn-pendente"

                        onclick="
                            alterarStatus(
                                ${registro.id},
                                'pendente'
                            )
                        "

                    >

                        Desmarcar

                    </button>

                `;

            }


            // ==========================================
            // LINHA
            // ==========================================

            tabela.innerHTML += `

                <tr>

                    <td>
                        ${registro.id}
                    </td>


                    <td>
                        ${dataFormatada}
                    </td>


                    <td>
                        ${nome}
                    </td>


                    <td>
                        ${telefone}
                    </td>


                    <td>
                        ${email}
                    </td>


                    <td>
                        ${campus}
                    </td>


                    <td>
                        ${idCrianca}
                    </td>


                    <td
                        class="${status}"
                    >
                        ${status}
                    </td>


                    <td>
                        ${botaoAcao}
                    </td>

                </tr>

            `;

        }
    );
}


// ======================================================
// ALTERAR STATUS
// ======================================================

window.alterarStatus =
    async function (
        id,
        novoStatus
    ) {


        // ==============================================
        // CONFIRMAÇÃO
        // ==============================================

        let mensagem = "";


        if (
            novoStatus === "pago"
        ) {

            mensagem =
                "Confirmar pagamento deste apadrinhamento?";

        } else {

            mensagem =
                "Deseja voltar este registro para pendente?";

        }


        if (
            !confirm(mensagem)
        ) {

            return;

        }


        // ==============================================
        // ATUALIZAR SUPABASE
        // ==============================================

        const { error } =

            await supabase

                .from("controle_acampa")

                .update({

                    status:
                        novoStatus

                })

                .eq(
                    "id",
                    id
                );


        if (error) {

            console.error(
                "Erro ao alterar status:",
                error
            );

            alert(
                "Não foi possível alterar o status.\n\n" +
                error.message
            );

            return;
        }


        // ==============================================
        // RECARREGAR
        // ==============================================

        await carregar();

    };


// ======================================================
// PESQUISA
// ======================================================

pesquisa.addEventListener(
    "input",
    montarTabela
);


// ======================================================
// INICIALIZAÇÃO
// ======================================================

carregar();