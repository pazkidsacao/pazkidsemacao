import { supabase } from "./supabase.js";

const form = document.getElementById("form-recuperacao");
const telefoneInput = document.getElementById("telefone");
const campusInput = document.getElementById("campus");
const emailInput = document.getElementById("email");
const botao = document.getElementById("btn-recuperar");
const mensagem = document.getElementById("mensagem");
const resultados = document.getElementById("resultados");
const listaCriancas = document.getElementById("lista-criancas");

function mostrarMensagem(texto, tipo) {
  mensagem.textContent = texto;
  mensagem.className = `mensagem ${tipo}`;
  mensagem.hidden = false;
}

function limparResultados() {
  resultados.hidden = true;
  listaCriancas.replaceChildren();
}

function normalizarTelefone(valor) {
  return String(valor || "").replace(/\D/g, "");
}

function calcularIdade(dataNascimento) {
  if (!dataNascimento) return "Não informada";

  const nascimento = new Date(`${dataNascimento}T12:00:00`);

  if (Number.isNaN(nascimento.getTime())) {
    return "Não informada";
  }

  const hoje = new Date();
  let idade = hoje.getFullYear() - nascimento.getFullYear();

  const aindaNaoFezAniversario =
    hoje.getMonth() < nascimento.getMonth() ||
    (
      hoje.getMonth() === nascimento.getMonth() &&
      hoje.getDate() < nascimento.getDate()
    );

  if (aindaNaoFezAniversario) idade--;

  return `${idade} ${idade === 1 ? "ano" : "anos"}`;
}

function obterFoto(fotoUrl) {
  if (!fotoUrl) return "";

  if (/^https?:\/\//i.test(fotoUrl)) {
    return fotoUrl;
  }

  const { data } = supabase
    .storage
    .from("fotos-criancas")
    .getPublicUrl(fotoUrl);

  return data.publicUrl || "";
}

function criarDetalhe(rotulo, valor, largo = false) {
  const item = document.createElement("div");
  item.className = largo ? "detalhe largo" : "detalhe";

  const legenda = document.createElement("small");
  legenda.textContent = rotulo;

  const conteudo = document.createElement("strong");
  conteudo.textContent =
    valor === null || valor === undefined || String(valor).trim() === ""
      ? "Não informado"
      : String(valor);

  item.append(legenda, conteudo);

  return item;
}

function criarCardCrianca(crianca) {
  const card = document.createElement("article");
  card.className = "card-crianca";

  const topo = document.createElement("div");
  topo.className = "card-topo";

  const foto = document.createElement("img");
  foto.className = "foto-crianca";
  foto.alt = `Foto de ${crianca.nome || "criança"}`;
  foto.loading = "lazy";

  const urlFoto = obterFoto(crianca.foto_url);

  if (urlFoto) {
    foto.src = urlFoto;
  } else {
    foto.hidden = true;
  }

  const identificacao = document.createElement("div");
  const nome = document.createElement("h3");
  nome.textContent = crianca.nome || "Criança";

  const idade = document.createElement("p");
  idade.textContent = calcularIdade(crianca.data_nascimento);

  identificacao.append(nome, idade);
  topo.append(foto, identificacao);

  const detalhes = document.createElement("div");
  detalhes.className = "detalhes-crianca";

  detalhes.append(
    criarDetalhe("Série escolar", crianca.serie_escolar),
    criarDetalhe("Tamanho da blusa", crianca.tamanho_blusa),
    criarDetalhe("Tamanho da calça", crianca.tamanho_calca),
    criarDetalhe("Tamanho do calçado", crianca.tamanho_calcado),
    criarDetalhe("Hobby / preferência", crianca.hobby, true)
  );

  card.append(topo, detalhes);

  if (crianca.status_entrega) {
    const status = document.createElement("p");
    status.className = "status-entrega";

    const tituloStatus = document.createElement("strong");
    tituloStatus.textContent = "Situação da entrega: ";

    const textoStatus = document.createElement("span");
    textoStatus.textContent = crianca.status_entrega;

    status.append(tituloStatus, textoStatus);
    card.append(status);
  }

  return card;
}

function exibirCriancas(criancas) {
  listaCriancas.replaceChildren();

  criancas.forEach((crianca) => {
    listaCriancas.appendChild(criarCardCrianca(crianca));
  });

  resultados.hidden = false;
}

form.addEventListener("submit", async (evento) => {
  evento.preventDefault();

  limparResultados();
  mensagem.hidden = true;

  const telefone = normalizarTelefone(telefoneInput.value);
  const campus = campusInput.value.trim();
  const email = emailInput.value.trim().toLowerCase();

  if (telefone.length < 10 || telefone.length > 13) {
    mostrarMensagem(
      "Confira o telefone informado e tente novamente.",
      "erro"
    );
    telefoneInput.focus();
    return;
  }

  if (!campus || !email) {
    mostrarMensagem(
      "Preencha o telefone, o campus e o e-mail.",
      "erro"
    );
    return;
  }

  botao.disabled = true;
  botao.textContent = "Consultando cadastro...";

  try {
    const { data, error } = await supabase.functions.invoke(
      "recuperar-apadrinhamento",
      {
        body: {
          telefone,
          campus,
          email
        }
      }
    );

    if (error) {
      console.error("Falha na recuperação:", error);

      mostrarMensagem(
        "Não foi possível concluir a consulta agora. Tente novamente mais tarde.",
        "erro"
      );
      return;
    }

    if (!data || !Array.isArray(data.resultados) ||
        data.resultados.length === 0) {
      mostrarMensagem(
        "Não encontramos um apadrinhamento com esses dados. Confira as informações ou procure a equipe Paz Kids em Ação.",
        "erro"
      );
      return;
    }

    exibirCriancas(data.resultados);

    mostrarMensagem(
      data.resultados.length === 1
        ? "Encontramos seu apadrinhamento!"
        : `Encontramos ${data.resultados.length} apadrinhamentos vinculados a esses dados.`,
      "sucesso"
    );

    resultados.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  } catch (erro) {
    console.error("Erro inesperado:", erro);

    mostrarMensagem(
      "Ocorreu um erro na consulta. Tente novamente mais tarde.",
      "erro"
    );
  } finally {
    botao.disabled = false;
    botao.textContent = "Recuperar meus dados";
  }
});