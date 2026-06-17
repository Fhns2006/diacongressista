// 1. CONFIGURAÇÃO DO SUPABASE
const SUPABASE_URL = "https://ndyibmddsbjrnpaogoqy.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_B_uuP2DRbAqi2DutEVB4rg_roOjE05b";

// Inicializa o cliente do Supabase
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


// ==========================================
// 2. CARREGAR OS NOMES AO ABRIR A PÁGINA
// ==========================================
document.addEventListener("DOMContentLoaded", async () => {
    const listaNomes = document.getElementById("listaNomes");

    try {
        // Busca os nomes na tabela 'usuarios' ordenados de A a Z
        const { data, error } = await supabaseClient
            .from("usuarios")
            .select("nome")
            .order("nome", { ascending: true });

        console.log("Dados recebidos no carregamento:", data);
        if (error) throw error;

        if (data && data.length > 0) {
            // Define a opção padrão limpa
            listaNomes.innerHTML = '<option value="">-- Selecione o seu nome --</option>';

            // Preenche o select com as tags <option> para cada nome
            data.forEach(usuario => {
                const opcao = document.createElement("option");
                opcao.value = usuario.nome;
                opcao.innerText = usuario.nome;
                listaNomes.appendChild(opcao);
            });
        } else {
            listaNomes.innerHTML = '<option value="">Nenhum nome cadastrado.</option>';
        }

    } catch (erro) {
        console.error("Erro ao carregar nomes:", erro);
        if (listaNomes) {
            listaNomes.innerHTML = '<option value="">Erro ao carregar a lista :(</option>';
        }
    }
});


// ==========================================
// 3. CONSULTAR INFORMAÇÕES AO CLICAR NO BOTÃO
// ==========================================
document.getElementById("btnConsultar").addEventListener("click", async () => {
    const listaNomes = document.getElementById("listaNomes");
    const nomeSelecionado = listaNomes.value;

    // Se o usuário clicou no botão sem escolher um nome válido
    if (!nomeSelecionado) {
        alert("Por favor, selecione um nome na lista antes de consultar.");
        return;
    }

    // Pega os elementos do HTML onde os resultados vão aparecer
    const divResultado = document.getElementById("resultado-consulta");
    const txtCapitao = document.getElementById("infoCapitao");
    const txtDupla = document.getElementById("infoDupla");
    const txtIdioma = document.getElementById("infoIdioma");
    const txtCarro = document.getElementById("infoCarro");

    try {
        // Busca capitão, dupla e carro filtrando pelo nome selecionado
        const { data, error } = await supabaseClient
            .from("usuarios")
            .select("capitao, dupla, carro, idioma")
            .eq("nome", nomeSelecionado)
            .single(); // Traz apenas uma linha (objeto único)

        console.log("Dados da consulta do botão:", data);
        if (error) throw error;

        if (data) {
            // Coloca as respostas vindas do banco de dados no HTML
            txtCapitao.innerText = data.capitao || "Não informado";
            txtDupla.innerText = data.dupla || "Não informado";
            txtIdioma.innerText = data.idioma || "Não informado";
            txtCarro.innerText = data.carro || "Não informado";

            // Exibe a caixinha com as informações na tela
            divResultado.style.display = "block";
        } else {
            alert("Informações não encontradas para este nome.");
        }

    } catch (erro) {
        console.error("Erro ao consultar informações:", erro);
        alert("Erro ao buscar as informações no banco de dados.");
    }
});


// ==========================================
// 4. LIMPAR A TELA QUANDO MUDAR O NOME
// ==========================================
document.getElementById("listaNomes").addEventListener("change", () => {
    const divResultado = document.getElementById("resultado-consulta");
    
    // Sempre esconde a caixinha de resultado se o usuário mexer na lista 
    // ou se voltar para a opção padrão vazia.
    if (divResultado) {
        divResultado.style.display = "none";
    }
});