import { supabase } from "./supabase.js";

const { data } =
    await supabase.auth.getUser();

if (!data.user) {

    window.location.href =
        "login.html";

}

const lista = document.getElementById("lista-criancas");


function calcularIdade(dataNascimento) {

    if (!dataNascimento) return "-";

    const hoje = new Date();
    const nasc = new Date(dataNascimento);

    let idade = hoje.getFullYear() - nasc.getFullYear();

    const mes = hoje.getMonth() - nasc.getMonth();

    if (
        mes < 0 ||
        (mes === 0 && hoje.getDate() < nasc.getDate())
    ) {
        idade--;
    }

    return idade;
}

function formatarData(data) {

    if (!data) return "";

    const [ano, mes, dia] = data.split("-");

    return `${dia}-${mes}-${ano}`;
}


async function carregarCriancas() {

    const { data, error } = await supabase
        .from("criancas")
        .select("*")
        .order("nome");

    if (error) {
        console.error("Erro ao buscar crianças:", error);
        return;
    }

    lista.innerHTML = "";

    data.forEach((crianca) => {

        const fotoUrl = crianca.foto_url
            ? `https://tcsgtzdmfzcqlaagnlcr.supabase.co/storage/v1/object/public/fotos-criancas/${crianca.foto_url}`
            : "";

        lista.innerHTML += `
            <tr>

                <td>
                    ${
                        fotoUrl
                            ? `<img
                                    class="foto-crianca"
                                    src="${fotoUrl}"
                                    alt="${crianca.nome}">
                              `
                            : "Sem foto"
                    }
                </td>

                <td>${crianca.nome || ""}</td>

                <td>${formatarData(crianca.data_nascimento)}</td>

                <td>
                    ${calcularIdade(crianca.data_nascimento)} anos
                </td>

                <td>${crianca.nome_responsavel || ""}</td>

                <td>${crianca.telefone || ""}</td>

                <td>${crianca.ativo || "Não"}</td>

                <td>
                    <button class="botao-editar" onclick="editarCrianca('${crianca.id}')">
                        Editar
                    </button>
                </td>

            </tr>
        `;
    });
}

window.editarCrianca = function (id) {

    window.location.href = `editar.html?id=${id}`;

};

carregarCriancas();


document
    .getElementById("btnNovaCrianca")
    .addEventListener("click", () => {

        window.location.href = "inserir.html";

    });

window.editarCrianca = function (id) {
    window.location.href = `editar.html?id=${id}`;
};

// =========================================
  // BUSCA GLOBAL
  // =========================================

const campoBusca = document.getElementById("buscaGlobal");

campoBusca.addEventListener("input", () => {

    const texto = campoBusca.value.toLowerCase();

    const linhas = document.querySelectorAll("#lista-criancas tr");

    linhas.forEach(linha => {

        const conteudo = linha.textContent.toLowerCase();

        linha.style.display =
            conteudo.includes(texto)
                ? ""
                : "none";

    });

});

window.logout = async function () {

    await supabase.auth.signOut();

    window.location.href =
        "login.html";

};