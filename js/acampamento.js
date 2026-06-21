import { supabase } from "./supabase.js";

const grid = document.getElementById("grid-criancas");

// 🔢 cálculo de idade
function calcularIdade(dataNascimento) {

    const hoje = new Date();
    const nasc = new Date(dataNascimento);

    let idade = hoje.getFullYear() - nasc.getFullYear();

    const mes = hoje.getMonth() - nasc.getMonth();

    if (mes < 0 || (mes === 0 && hoje.getDate() < nasc.getDate())) {
        idade--;
    }

    return idade;
}

// 🖼️ monta URL da imagem com segurança
function montarFoto(c) {

    const baseURL = "https://tcsgtzdmfzcqlaagnlcr.supabase.co/storage/v1/object/public/fotos-criancas/";

    // se não tem foto → default
    if (!c.foto_url || c.foto_url.trim() === "") {
        return "/imagens/default.png";
    }

    // se já for URL completa
    if (c.foto_url.startsWith("http")) {
        return c.foto_url;
    }

    // caso padrão Supabase
    return baseURL + c.foto_url;
}

// 🚀 carregar crianças
async function carregarCriancas() {

    console.log("🔄 carregando crianças...");

    const { data, error } = await supabase
        .from("criancas")
        .select("*");

    console.log("📦 DATA:", data);
    console.log("❌ ERROR:", error);

    if (error) {
        console.log("Erro ao buscar crianças:", error);
        return;
    }

    if (!data || data.length === 0) {
        grid.innerHTML = "<p>Nenhuma criança encontrada</p>";
        return;
    }

    grid.innerHTML = "";

    data.forEach(c => {

        console.log("🧒 criando card:", c.nome);
        console.log("FOTO_URL:", c.foto_url);

        const card = document.createElement("div");
        card.classList.add("card-crianca");

        const foto = montarFoto(c);

        console.log("URL FINAL:", foto);

        card.innerHTML = `
            <img 
                src="${foto}" 
                alt="${c.nome}"
                onerror="this.src='/imagens/default.png'"
            >

            <div class="overlay">
                <h3>${c.nome}</h3>
                <p>${calcularIdade(c.data_nascimento)} anos</p>
                <p>Clique para ver mais</p>
            </div>
        `;

        // clique futuro (modal de apadrinhamento)
        card.addEventListener("click", () => {
            console.log("clicou na criança:", c.id);
        });

        grid.appendChild(card);
    });

    console.log("✅ renderização finalizada");
}

// inicia
carregarCriancas();