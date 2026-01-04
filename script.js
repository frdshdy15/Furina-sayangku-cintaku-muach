"use strict";

const STATE = {
    player: localStorage.getItem('daus_player') || "Stranger",
    trust: parseInt(localStorage.getItem('daus_trust')) || 50,
    lastTalkedTo: localStorage.getItem('daus_last_npc') || null,
    isNight: false,
    history: JSON.parse(localStorage.getItem('daus_history')) || {
        daus: [], ayam: [], buaya: [], siput: [], ember: [], pohon: []
    }
};

const BRAIN = {
    // Reaksi Daus kalau lu habis dari NPC lain (Sistem Cemburu/Ghibah)
    crossMemory: {
        ayam: "Bau bulu ayam lu... abis pacaran sama si jago ya?",
        buaya: "Hati-hati, abis ngobrol sama si Buaya ntar lu kena ghosting. Mending di sini aja.",
        pohon: "Pohon itu emang sok bijak, padahal akarnya sering nyolong air warung gue.",
        ember: "Ngapain curhat ama ember? Gak bakal nyambung, dia kan bocor."
    },

    // Generator Ngelantur (Natural Flow)
    ramblings: [
        "Jujur ya, idup tuh kayak rante motor, kalo kurang oli ya berisik.",
        "Gue lagi mikir, kenapa donat bolongnya di tengah? Kalo di pinggir namanya jadi ban kempes.",
        "Tadi ada pesawat lewat rendah banget, kayaknya pilotnya mau mesen kopi di sini.",
        "Dunia makin aneh, masa tadi gue liat siput pake knalpot brong."
    ]
};

// --- CORE FUNCTIONS ---

function mulaiDunia() {
    const nama = document.getElementById('inputNama').value.trim();
    if (!nama) return alert("Isi dulu nama lu, Lur!");
    
    STATE.player = nama;
    localStorage.setItem('daus_player', nama);
    document.getElementById('welcome-screen').classList.add('hidden');
    document.getElementById('game-container').classList.remove('hidden');
    document.getElementById('display-nama').textContent = nama;
    
    // Trigger Chaos Acak
    startChaosCycle();
}

function bukaObrolan(target) {
    const chatWin = document.getElementById('floating-chat');
    chatWin.classList.remove('hidden');
    
    document.getElementById('target-name').textContent = target.toUpperCase();
    document.getElementById('target-icon').textContent = getIcon(target);
    
    // Logika Daus Cemburu/Sadar Konteks
    if (target === 'daus' && STATE.lastTalkedTo && STATE.lastTalkedTo !== 'daus') {
        const sindiran = BRAIN.crossMemory[STATE.lastTalkedTo] || "Baru balik lu?";
        renderMessage('ai', sindiran, 'daus');
    }

    STATE.lastTalkedTo = target;
    localStorage.setItem('daus_last_npc', target);
    renderHistory(target);
}

function tutupObrolan() {
    document.getElementById('floating-chat').classList.add('hidden');
}

function renderMessage(type, text, target) {
    const box = document.getElementById('chat-content');
    const div = document.createElement('div');
    div.className = `bubble ${type}`;
    div.textContent = text;
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
    
    // Simpan ke memori
    if (target) {
        STATE.history[target].push({ type, text });
        localStorage.setItem('daus_history', JSON.stringify(STATE.history));
    }
}

function renderHistory(target) {
    const box = document.getElementById('chat-content');
    box.innerHTML = '';
    STATE.history[target].forEach(msg => {
        const div = document.createElement('div');
        div.className = `bubble ${msg.type}`;
        div.textContent = msg.text;
        box.appendChild(div);
    });
}

// --- INTELLIGENCE LOGIC (THE "WAH" PART) ---

async function handleChat() {
    const input = document.getElementById('msgInput');
    const text = input.value.trim();
    const target = document.getElementById('target-name').textContent.toLowerCase();
    
    if (!text) return;
    
    renderMessage('user', text, target);
    input.value = '';

    // Simulasi "Mikir"
    const delay = 500 + (Math.random() * 1000);
    setTimeout(() => {
        let reply = generateReply(target, text);
        renderMessage('ai', reply, target);
    }, delay);
}

function generateReply(target, msg) {
    const lowerMsg = msg.toLowerCase();
    
    // Filter Kasar -> Kiss Punishment
    if (/(anjing|babi|goblok|tolol|kontol|bangsat)/.test(lowerMsg)) {
        triggerKiss();
        return "Cup! 💋 Muach! Jaga mulutnya, sayang...";
    }

    // Spesifik untuk Daus
    if (target === 'daus') {
        if (lowerMsg.includes('tebak')) return "Oke, kenapa gajah terbang? Karena dia bukan uler kobra. Garing ya? Bodo amat.";
        if (lowerMsg.includes('nasi padang') && STATE.trust >= 150) return "Nih flag buat lu: FLAG{DAUS_NASI_PADANG_SPECIAL}";
        
        // Ngelantur Mode
        return BRAIN.ramblings[Math.floor(Math.random() * BRAIN.ramblings.length)];
    }

    // NPC Lain
    if (target === 'ayam') return "Petok... petooook! (Dia nanya lu punya beras gak?)";
    if (target === 'buaya') return "Kamu beda deh hari ini, lebih cantik... (Hati-hati gombal!)";
    
    return "Hm... (Gak nyambung dia)";
}

// --- CHAOS & ENVIRONMENT ---

function triggerKiss() {
    const kiss = document.getElementById('kiss-overlay');
    kiss.classList.remove('hidden');
    setTimeout(() => kiss.classList.add('hidden'), 1000);
}

function startChaosCycle() {
    // 1. Ganti Siang Malam
    setInterval(() => {
        STATE.isNight = !STATE.isNight;
        document.body.className = STATE.isNight ? 'world-night' : 'world-day';
        document.getElementById('sun-moon').textContent = STATE.isNight ? '🌙' : '☀️';
    }, 30000);

    // 2. Kejadian Luar Nalar (Acak)
    setInterval(() => {
        const rand = Math.random();
        if (rand > 0.8) triggerExplosion();
        else if (rand > 0.6) triggerPlaneCrash();
    }, 15000);
}

function triggerExplosion() {
    const spot = document.getElementById('kejadian-darat');
    const boom = document.createElement('div');
    boom.className = 'explosion';
    boom.textContent = '💥';
    boom.style.left = Math.random() * 80 + '%';
    spot.appendChild(boom);
    
    if (!document.getElementById('floating-chat').classList.contains('hidden')) {
        renderMessage('ai', "ANJIR APAAN TUH MELEDAK?!", 'daus');
    }
    
    setTimeout(() => boom.remove(), 1000);
}

function triggerPlaneCrash() {
    const sky = document.getElementById('kejadian-langit');
    const plane = document.createElement('div');
    plane.style.position = 'absolute';
    plane.style.fontSize = '40px';
    plane.textContent = '✈️🔥';
    plane.style.top = '10%';
    plane.style.left = '-50px';
    sky.appendChild(plane);

    plane.animate([
        { left: '-50px', top: '10%' },
        { left: '110vw', top: '80%' }
    ], { duration: 3000 });

    setTimeout(() => {
        plane.remove();
        triggerExplosion();
    }, 3000);
}

function getIcon(target) {
    const icons = { daus: '👨‍🔧', ayam: '🐓', buaya: '🐊', siput: '🐌', ember: '🪣', pohon: '🌳' };
    return icons[target] || '❓';
}

// Init Listeners
document.getElementById('btnGas').onclick = handleChat;
document.getElementById('msgInput').onkeydown = (e) => e.key === 'Enter' && handleChat();

// Check Persistence
if (STATE.player !== "Stranger") {
    document.getElementById('welcome-screen').classList.add('hidden');
    document.getElementById('game-container').classList.remove('hidden');
    document.getElementById('display-nama').textContent = STATE.player;
    document.getElementById('display-trust').textContent = STATE.trust;
    startChaosCycle();
}
