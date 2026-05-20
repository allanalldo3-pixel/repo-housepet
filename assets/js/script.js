/* ============================================
   HOUSE PET - Lógica de Aplicação
   Persistência simulada via localStorage (RNF01)
   ============================================ */

// ============================================
// BASE DE DADOS INICIAL DE PETS (dados de exemplo)
// ============================================
const initialPets = [
    {
        id: "1",
        name: "Thor",
        type: "cachorro",
        age: "adulto",
        size: "grande",
        location: "Palmas - TO",
        image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=500&q=80",
        description: "Thor é um Golden Retriever super carinhoso e ativo. Adora brincar e é ótimo com crianças. Procura uma família que tenha espaço para ele correr.",
        gender: "macho",
        vaccinated: true,
        neutered: true,
        ownerEmail: "demo@housepet.com"
    },
    {
        id: "2",
        name: "Luna",
        type: "gato",
        age: "filhote",
        size: "pequeno",
        location: "Palmas - TO",
        image: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=500&q=80",
        description: "Luna é uma gatinha brincalhona e curiosa. Adora carinho e ronrona muito! Ideal para apartamento.",
        gender: "femea",
        vaccinated: true,
        neutered: false,
        ownerEmail: "demo@housepet.com"
    },
    {
        id: "3",
        name: "Bob",
        type: "cachorro",
        age: "filhote",
        size: "medio",
        location: "Paraíso do Tocantins",
        image: "https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=500&q=80",
        description: "Bob é um filhotinho cheio de energia! Precisa de uma família ativa que possa educá-lo e dar muito amor.",
        gender: "macho",
        vaccinated: true,
        neutered: false,
        ownerEmail: "demo@housepet.com"
    },
    {
        id: "4",
        name: "Nina",
        type: "gato",
        age: "adulto",
        size: "pequeno",
        location: "Porto Nacional",
        image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=500&q=80",
        description: "Nina é uma gatinha tranquila e independente. Gosta de carinho mas também de seu espaço. Perfeita para quem trabalha fora.",
        gender: "femea",
        vaccinated: true,
        neutered: true,
        ownerEmail: "demo@housepet.com"
    },
    {
        id: "5",
        name: "Max",
        type: "cachorro",
        age: "idoso",
        size: "pequeno",
        location: "Palmas - TO",
        image: "https://images.unsplash.com/photo-1477884213360-7e9d7dcc1e48?w=500&q=80",
        description: "Max é um senhor tranquilo que merece um lar acolhedor para aproveitar seus dias. Calmo e carinhoso.",
        gender: "macho",
        vaccinated: true,
        neutered: true,
        ownerEmail: "demo@housepet.com"
    },
    {
        id: "6",
        name: "Mel",
        type: "cachorro",
        age: "adulto",
        size: "medio",
        location: "Palmas - TO",
        image: "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=500&q=80",
        description: "Mel é uma cachorrinha dócil e obediente. Adora passear e é super bem educada. Ideal para primeiro adotante.",
        gender: "femea",
        vaccinated: true,
        neutered: true,
        ownerEmail: "demo@housepet.com"
    }
];

// Usuário demo padrão (para os pets iniciais terem um "dono")
const demoUser = {
    id: "demo",
    name: "Equipe House Pet",
    email: "demo@housepet.com",
    password: "demo1234",
    phone: "(63) 99999-0000",
    acceptWhatsapp: true,
    acceptCall: false,
    createdAt: new Date().toISOString()
};

// ============================================
// CARREGAMENTO INICIAL (corrige "efeito amnésia")
// ============================================
let pets = JSON.parse(localStorage.getItem("pets"));
if (!pets || pets.length === 0) {
    pets = initialPets;
    localStorage.setItem("pets", JSON.stringify(pets));
}

// Garante que o usuário demo existe (para os pets iniciais)
let usersRaw = JSON.parse(localStorage.getItem("users") || "[]");
if (!usersRaw.some(u => u.email === demoUser.email)) {
    usersRaw.push(demoUser);
    localStorage.setItem("users", JSON.stringify(usersRaw));
}

// Estado global
let isLoggedIn = false;
let currentUser = null;
let selectedPetId = null;

// ============================================
// INICIALIZAÇÃO
// ============================================
window.onload = function() {
    checkLogin();
    renderPets();
    setupFilters();
    setupPhoneMask();
};

function setupPhoneMask() {
    const phoneInput = document.getElementById("registerPhone");
    if (!phoneInput) return;

    phoneInput.addEventListener("input", function(e) {
        let value = e.target.value.replace(/\D/g, ""); // remove tudo que não for dígito
        if (value.length > 11) value = value.slice(0, 11);

        if (value.length > 6) {
            e.target.value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
        } else if (value.length > 2) {
            e.target.value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
        } else if (value.length > 0) {
            e.target.value = `(${value}`;
        } else {
            e.target.value = "";
        }
    });
}

function checkLogin() {
    const stored = localStorage.getItem("currentUser");
    if (stored) {
        currentUser = JSON.parse(stored);
        isLoggedIn = true;
        updateUI();
    }
}

function updateUI() {
    if (isLoggedIn) {
        document.getElementById("userInfo").textContent = `Olá, ${currentUser.name}!`;
        document.getElementById("userInfo").classList.remove("hidden");
        document.getElementById("loginBtn").classList.add("hidden");
        document.getElementById("addPetBtn").classList.remove("hidden");
        document.getElementById("logoutBtn").classList.remove("hidden");
    } else {
        document.getElementById("userInfo").classList.add("hidden");
        document.getElementById("loginBtn").classList.remove("hidden");
        document.getElementById("addPetBtn").classList.add("hidden");
        document.getElementById("logoutBtn").classList.add("hidden");
    }
}

// ============================================
// RENDERIZAÇÃO DA VITRINE (RF06) + FILTROS (RF08, RF09)
// ============================================
function renderPets() {
    const grid = document.getElementById("petsGrid");
    const noResults = document.getElementById("noResults");

    const filters = {
        name: document.getElementById("searchName")?.value.toLowerCase() || "",
        type: document.getElementById("filterType").value,
        age: document.getElementById("filterAge").value,
        size: document.getElementById("filterSize").value,
        location: document.getElementById("filterLocation").value.toLowerCase()
    };

    const filteredPets = pets.filter(pet => {
        if (filters.name && !pet.name.toLowerCase().includes(filters.name)) return false;
        if (filters.type && pet.type !== filters.type) return false;
        if (filters.age && pet.age !== filters.age) return false;
        if (filters.size && pet.size !== filters.size) return false;
        if (filters.location && !pet.location.toLowerCase().includes(filters.location)) return false;
        return true;
    });

    const count = filteredPets.length;
    document.getElementById("petCount").textContent =
        `${count} ${count === 1 ? 'pet disponível' : 'pets disponíveis'} para adoção`;

    if (filteredPets.length === 0) {
        grid.innerHTML = "";
        noResults.classList.remove("hidden");
    } else {
        noResults.classList.add("hidden");
        grid.innerHTML = filteredPets.map(pet => `
            <div class="pet-card" onclick="showPetDetails('${pet.id}')">
                <img src="${pet.image}" alt="${pet.name}" class="pet-image" onerror="this.src='https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500&q=80'">
                <div class="pet-info">
                    <div class="pet-name">${pet.name}</div>
                    <div class="pet-details">
                        <span class="badge">${capitalizeFirst(pet.type)}</span>
                        <span class="badge">${capitalizeFirst(pet.age)}</span>
                        <span class="badge">${capitalizeFirst(pet.size)}</span>
                    </div>
                    <div class="pet-location">📍 ${pet.location}</div>
                </div>
            </div>
        `).join("");
    }
}

function capitalizeFirst(str) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function setupFilters() {
    document.getElementById("searchName")?.addEventListener("input", renderPets);
    document.getElementById("filterType").addEventListener("change", renderPets);
    document.getElementById("filterAge").addEventListener("change", renderPets);
    document.getElementById("filterSize").addEventListener("change", renderPets);
    document.getElementById("filterLocation").addEventListener("input", renderPets);
}

// ============================================
// CADASTRO DE USUÁRIO (RF01)
// ============================================
document.getElementById("registerForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const name = document.getElementById("registerName").value;
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;
    const confirmPassword = document.getElementById("registerConfirmPassword").value;
    const phone = document.getElementById("registerPhone").value;
    const acceptWhatsapp = document.getElementById("acceptWhatsapp").checked;
    const acceptCall = document.getElementById("acceptCall").checked;

    const errorDiv = document.getElementById("registerError");
    const successDiv = document.getElementById("registerSuccess");

    // Validações
    if (password !== confirmPassword) {
        errorDiv.textContent = "As senhas não coincidem!";
        errorDiv.classList.remove("hidden");
        successDiv.classList.add("hidden");
        return;
    }

    if (password.length < 6) {
        errorDiv.textContent = "A senha deve ter no mínimo 6 caracteres!";
        errorDiv.classList.remove("hidden");
        successDiv.classList.add("hidden");
        return;
    }

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    if (users.some(u => u.email === email)) {
        errorDiv.textContent = "Este email já está cadastrado!";
        errorDiv.classList.remove("hidden");
        successDiv.classList.add("hidden");
        return;
    }

    const newUser = {
        id: Date.now().toString(),
        name: name,
        email: email,
        password: password,
        phone: phone,
        acceptWhatsapp: acceptWhatsapp,
        acceptCall: acceptCall,
        createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    errorDiv.classList.add("hidden");
    successDiv.textContent = "Cadastro realizado com sucesso! Redirecionando para o login...";
    successDiv.classList.remove("hidden");

    document.getElementById("registerForm").reset();

    setTimeout(() => {
        closeRegisterModal();
        switchToLogin();
    }, 2000);
});

// ============================================
// LOGIN (RF02)
// ============================================
document.getElementById("loginBtn").addEventListener("click", function() {
    document.getElementById("loginModal").classList.add("active");
});

document.getElementById("loginForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;
    const errorDiv = document.getElementById("loginError");

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        currentUser = user;
        isLoggedIn = true;
        localStorage.setItem("currentUser", JSON.stringify(user));
        updateUI();
        closeLoginModal();
        errorDiv.classList.add("hidden");
    } else {
        errorDiv.textContent = "Email ou senha incorretos!";
        errorDiv.classList.remove("hidden");
    }
});

function closeLoginModal() {
    document.getElementById("loginModal").classList.remove("active");
    document.getElementById("loginForm").reset();
    document.getElementById("loginError").classList.add("hidden");
}

function closeRegisterModal() {
    document.getElementById("registerModal").classList.remove("active");
    document.getElementById("registerForm").reset();
    document.getElementById("registerError").classList.add("hidden");
    document.getElementById("registerSuccess").classList.add("hidden");
}

function switchToRegister() {
    closeLoginModal();
    document.getElementById("registerModal").classList.add("active");
}

function switchToLogin() {
    closeRegisterModal();
    document.getElementById("loginModal").classList.add("active");
}

// ============================================
// LOGOUT
// ============================================
document.getElementById("logoutBtn").addEventListener("click", function() {
    isLoggedIn = false;
    currentUser = null;
    localStorage.removeItem("currentUser");
    updateUI();
});

// ============================================
// CADASTRO DE PET (RF04)
// ============================================
document.getElementById("addPetBtn").addEventListener("click", function() {
    document.getElementById("addPetModal").classList.add("active");
});

document.getElementById("addPetForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const newPet = {
        id: Date.now().toString(),
        name: document.getElementById("petName").value,
        type: document.getElementById("petType").value,
        age: document.getElementById("petAge").value,
        size: document.getElementById("petSize").value,
        gender: document.getElementById("petGender").value,
        location: document.getElementById("petLocation").value,
        image: document.getElementById("petImage").value,
        description: document.getElementById("petDescription").value,
        vaccinated: document.getElementById("petVaccinated").checked,
        neutered: document.getElementById("petNeutered").checked,
        ownerEmail: currentUser ? currentUser.email : null
    };

    pets.unshift(newPet);
    localStorage.setItem("pets", JSON.stringify(pets));

    renderPets();
    closeAddPetModal();
});

function closeAddPetModal() {
    document.getElementById("addPetModal").classList.remove("active");
    document.getElementById("addPetForm").reset();
}

// ============================================
// EDIÇÃO E EXCLUSÃO DE PET (RF05)
// ============================================
document.getElementById("editPetForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const petId = this.getAttribute("data-pet-id");
    const petIndex = pets.findIndex(p => p.id === petId);
    if (petIndex === -1) return;

    pets[petIndex] = {
        ...pets[petIndex],
        name: document.getElementById("editPetName").value,
        type: document.getElementById("editPetType").value,
        age: document.getElementById("editPetAge").value,
        size: document.getElementById("editPetSize").value,
        gender: document.getElementById("editPetGender").value,
        location: document.getElementById("editPetLocation").value,
        image: document.getElementById("editPetImage").value,
        description: document.getElementById("editPetDescription").value,
        vaccinated: document.getElementById("editPetVaccinated").checked,
        neutered: document.getElementById("editPetNeutered").checked
    };

    localStorage.setItem("pets", JSON.stringify(pets));

    renderPets();
    closeEditPetModal();
});

function openEditPetModal(id) {
    const pet = pets.find(p => p.id === id);
    if (!pet) return;

    closeDetailsModal();

    document.getElementById("editPetName").value = pet.name;
    document.getElementById("editPetType").value = pet.type;
    document.getElementById("editPetAge").value = pet.age;
    document.getElementById("editPetSize").value = pet.size;
    document.getElementById("editPetGender").value = pet.gender;
    document.getElementById("editPetLocation").value = pet.location;
    document.getElementById("editPetImage").value = pet.image;
    document.getElementById("editPetDescription").value = pet.description;
    document.getElementById("editPetVaccinated").checked = pet.vaccinated;
    document.getElementById("editPetNeutered").checked = pet.neutered;

    document.getElementById("editPetForm").setAttribute("data-pet-id", id);
    document.getElementById("editPetModal").classList.add("active");
}

function closeEditPetModal() {
    document.getElementById("editPetModal").classList.remove("active");
    document.getElementById("editPetForm").reset();
    document.getElementById("editPetForm").removeAttribute("data-pet-id");
}

function deletePet(id) {
    if (!confirm("Tem certeza de que deseja excluir este pet da listagem de adoção?")) {
        return;
    }

    pets = pets.filter(p => p.id !== id);
    localStorage.setItem("pets", JSON.stringify(pets));

    closeDetailsModal();
    renderPets();
}

// ============================================
// DETALHES DO PET (RF07)
// ============================================
function showPetDetails(id) {
    const pet = pets.find(p => p.id === id);
    if (!pet) return;

    selectedPetId = id;
    document.getElementById("detailName").textContent = pet.name;
    document.getElementById("detailImage").src = pet.image;
    document.getElementById("detailType").textContent = capitalizeFirst(pet.type);
    document.getElementById("detailAge").textContent = capitalizeFirst(pet.age);
    document.getElementById("detailSize").textContent = capitalizeFirst(pet.size);
    document.getElementById("detailGender").textContent = capitalizeFirst(pet.gender);
    document.getElementById("detailLocation").textContent = pet.location;
    document.getElementById("detailVaccinated").textContent = pet.vaccinated ? "Sim" : "Não";
    document.getElementById("detailNeutered").textContent = pet.neutered ? "Sim" : "Não";
    document.getElementById("detailDescription").textContent = pet.description;

    // Define os botões de ação dinamicamente baseado no proprietário do pet
    const actionsDiv = document.getElementById("detailsActions");
    if (isLoggedIn && pet.ownerEmail === currentUser.email) {
        actionsDiv.innerHTML = `
            <button class="btn btn-secondary" onclick="openEditPetModal('${pet.id}')">Editar Pet</button>
            <button class="btn btn-danger" onclick="deletePet('${pet.id}')">Excluir Pet</button>
        `;
    } else {
        actionsDiv.innerHTML = `
            <button class="btn btn-success" onclick="adoptPet()">Quero Adotar!</button>
        `;
    }

    document.getElementById("detailsModal").classList.add("active");
}

// ============================================
// SOLICITAÇÃO DE ADOÇÃO (RF10 + RF11)
// Comunicação externa conforme RNF06
// ============================================
function adoptPet() {
    if (!isLoggedIn) {
        alert("Você precisa fazer login para adotar um pet!");
        closeDetailsModal();
        document.getElementById("loginModal").classList.add("active");
        return;
    }

    const pet = pets.find(p => p.id === selectedPetId);
    if (!pet) return;

    // Busca os dados do tutor responsável (RF11)
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const owner = users.find(u => u.email === pet.ownerEmail);

    let contatoMsg = "";
    if (owner) {
        const canais = [];
        if (owner.acceptWhatsapp) canais.push("WhatsApp");
        if (owner.acceptCall) canais.push("Ligação");
        const canaisStr = canais.length > 0 ? canais.join(" ou ") : "telefone";

        contatoMsg = `\n\nResponsável: ${owner.name}\nTelefone: ${owner.phone}\nContato preferido: ${canaisStr}`;
    } else {
        contatoMsg = "\n\nEntre em contato com o responsável pelos canais disponíveis.";
    }

    // Registra solicitação no localStorage (rastreabilidade)
    const adocoes = JSON.parse(localStorage.getItem("adocoes") || "[]");
    adocoes.push({
        id: Date.now().toString(),
        petId: pet.id,
        petName: pet.name,
        adotanteEmail: currentUser.email,
        adotanteName: currentUser.name,
        tutorEmail: pet.ownerEmail,
        status: "pendente",
        dataAdocao: new Date().toISOString()
    });
    localStorage.setItem("adocoes", JSON.stringify(adocoes));

    alert(`Oba! Você manifestou interesse em adotar o(a) ${pet.name}!${contatoMsg}\n\nEntre em contato pelo canal preferido do tutor para combinar a adoção.`);
    closeDetailsModal();
}

function closeDetailsModal() {
    document.getElementById("detailsModal").classList.remove("active");
}

// ============================================
// FECHAR MODAIS AO CLICAR FORA
// ============================================
window.onclick = function(event) {
    if (event.target.classList.contains("modal")) {
        event.target.classList.remove("active");
    }
};
