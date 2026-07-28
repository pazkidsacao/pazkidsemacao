import { supabase } from "./supabase.js";

const tabela = document.getElementById("tabela");
const pesquisa = document.getElementById("pesquisa");

const total = document.getElementById("total");
const pendentes = document.getElementById("pendentes");
const pagos = document.getElementById("pagos");
const valor = document.getElementById("valor");

let registros = [];

//========================
// CARREGAR
//========================

async function carregar() {

    const { data, error } = await supabase
        .from("controle_acampa")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        alert(error.message);
        return;
    }

    registros = data;

    atualizarResumo();
    montarTabela();

}

//========================
// RESUMO
//========================

function atualizarResumo() {

    total.textContent = registros.length;

    const listaPendentes =
        registros.filter(r => r.status === "pendente");

    const listaPagos =
        registros.filter(r => r.status === "pago");

    pendentes.textContent = listaPendentes.length;
    pagos.textContent = listaPagos.length;

    const arrecadado = listaPagos.reduce(
        (soma, r) => soma + (r.quantidade_criancas * 250),
        0
    );

    valor.textContent = arrecadado.toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );

}

//========================
// TABELA
//========================

function montarTabela() {

    tabela.innerHTML = "";

    const filtro = pesquisa.value.toLowerCase();

    registros
        .filter(r => {

            return (
                r.nome.toLowerCase().includes(filtro) ||
                r.telefone.toLowerCase().includes(filtro) ||
                (r.email || "").toLowerCase().includes(filtro) ||
                r.campus.toLowerCase().includes(filtro)
            );

        })
        .forEach(r => {

            const data = new Date(r.created_at)
                .toLocaleDateString("pt-BR");

            tabela.innerHTML += `

            <tr>

                <td>${r.id}</td>

                <td>${data}</td>

                <td>${r.nome}</td>

                <td>${r.telefone}</td>

                <td>${r.email ?? "-"}</td>

                <td>${r.campus}</td>

                <td>${r.quantidade_criancas}</td>

                <td class="${r.status}">
                    ${r.status}
                </td>

                <td>

                    ${
                        r.status === "pendente"

                        ?

                        `<button class="btn-pago"
                            onclick="alterarStatus(${r.id},'pago')">
                            Marcar Pago
                        </button>`

                        :

                        `<button class="btn-pendente"
                            onclick="alterarStatus(${r.id},'pendente')">
                            Desmarcar
                        </button>`

                    }

                </td>

            </tr>

            `;

        });

}

//========================
// ALTERAR STATUS
//========================

window.alterarStatus = async (id, status) => {

    const { error } = await supabase
        .from("controle_acampa")
        .update({
            status
        })
        .eq("id", id);

    if (error) {

        alert(error.message);
        return;

    }

    carregar();

};

//========================
// PESQUISA
//========================

pesquisa.addEventListener(
    "input",
    montarTabela
);

//========================
// INICIAR
//========================

carregar();