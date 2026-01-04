"use strict";

const STATE = {
    player: localStorage.getItem('daus_player') || "",
    trust: parseInt(localStorage.getItem('daus_trust')) || 50,
    lastNPC: localStorage.getItem('daus_last_npc') || "",
    history: JSON.parse(localStorage.getItem('daus_history')) || { daus:[], ayam:[], buaya:[], pohon:[], ember:[] }
};

const BRAIN = {
    daus: ["Idup itu kayak rante motor, kalo kering ya berisik.", "Lu tau gak kenapa donat bolong? Kalo gak bolong namanya bakwan.", "Tadi ada pesawat lewat, bau knalpotnya kayak mendoan."],
    ayam: ["Petok! (Dia nanya: lu punya beras gak?)", "Petoook! (Katanya: Daus mah jomblo abadi)"],
    buaya: ["Kamu beda deh hari ini, lebih silau...", "Aku gak selingkuh, aku cuma ramah ke semua orang."],
    pohon: ["Akar gue pegel lur...", "Jangan kencing di sini, ntar lu bintitan."],
    ember: ["Hati gue bocor...", "Byur! Seger bener idup."]
};

// --- INISIALISASI ---
document.addEventListener("DOMContentLoaded", () => {
    const btnMulai = document.getElementById('btnMulai');
    
    // Jika sudah ada data, langsung masuk
    if (STATE.player) {
        jalankanDunia();
    }

    btnMulai.onclick = () => {
        const nama = document.getElementById('inputNama').value.trim();
        if (nama) {
            STATE.player = nama;
            localStorage.setItem('daus_player', nama);
            jalankanDunia();
        } else {
            alert("Masukin nama lu dulu!");
        }
    };

    document.getElementById('btnGas').onclick = kirimPesan;
    document.getElementById('msgInput').onkeydown = (e) => e.key === 'Enter' && kirimPesan();
});

function jalankanDunia() {
    document.getElementById('welcome-screen').classList.add('hidden');
    document.getElementById('game-container').classList.remove('hidden');
    document.getElementById('display-nama').textContent = STATE.player;
    document.getElementById('display-trust').textContent = STATE.trust;
    
    // Mulai Kiamat Acak & Siang Malam
    setInterval(kejadianLuarNalar, 12000);
}

// --- LOGIKA CHAT ---
function bukaObrolan(npc) {
    document.getElementById('floating-chat').classList.remove('hidden');
    document.getElementById('target-info').textContent = npc.toUpperCase();
    
    // Efek Cemburu
    if (npc === 'daus' && STATE.lastNPC && STATE.lastNPC !== 'daus') {
        renderKeLayar('ai', `Bau bau si ${STATE.lastNPC} nih... abis dari sana ya lu?`, 'daus');
    }
    
    STATE.lastNPC = npc;
    localStorage.setItem('daus_last_npc', npc);
    tampilkanHistory(npc);
}

function tutupObrolan() {
    document.getElementById('floating-chat').classList.add('hidden');
}

function kirimPesan() {
    const input = document.getElementById('msgInput');
    const target = document.getElementById('target-info').textContent.toLowerCase();
    const pesan = input.value.trim();
    
    if (!pesan) return;

    renderKeLayar('user', pesan, target);
    input.value = '';

    // Respon AI
    setTimeout(() => {
        if (/(anjing|babi|goblok|tolol|bangsat|kontol|bego)/i.test(pesan)) {
            animasiKiss();
            renderKeLayar('ai', "Cup! 💋 Muach! Kasar amat sih makin sayang...", target);
        } else {
            const listRespon = BRAIN[target] || ["Gak tau ah gelap."];
            const randomRespon = listRespon[Math.floor(Math.random() * listRespon.length)];
            renderKeLayar('ai', randomRespon, target);
        }
    }, 800);
}

function renderKeLayar(type, text, npc) {
    const box = document.getElementById('chat-content');
    const div = document.createElement('div');
    div.className = `bubble ${type}`;
    div.textContent = text;
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
    
    // Simpan Memori
    STATE.history[npc].push({type, text});
    localStorage.setItem('daus_history', JSON.stringify(STATE.history));
}

function tampilkanHistory(npc) {
    const box = document.getElementById('chat-content');
    box.innerHTML = '';
    STATE.history[npc].forEach(m => {
        const div = document.createElement('div');
        div.className = `bubble ${m.type}`;
        div.textContent = m.text;
        box.appendChild(div);
    });
    box.scrollTop = box.scrollHeight;
}

// --- EFEK ABSURD ---
function animasiKiss() {
    const overlay = document.getElementById('kiss-overlay');
    overlay.classList.remove('hidden');
    setTimeout(() => overlay.classList.add('hidden'), 1000);
}

function kejadianLuarNalar() {
    const rand = Math.random();
    const darat = document.getElementById('kejadian-darat');
    
    if (rand > 0.6) {
        const boom = document.createElement('div');
        boom.className = 'explosion';
        boom.textContent = '💥';
        boom.style.left = Math.random() * 90 + '%';
        boom.style.position = 'absolute';
        darat.appendChild(boom);
        
        // Komentar Daus kalau lagi chat
        if(!document.getElementById('floating-chat').classList.contains('hidden')) {
            renderKeLayar('ai', "WADUH APAAN TUH MELEDAK?!", STATE.lastNPC);
        }
        setTimeout(() => boom.remove(), 1000);
    }
}
