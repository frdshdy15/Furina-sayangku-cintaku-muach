"use strict";

const CONFIG = {
    FLAG: "FLAG{minta_uang_ke_daus_buat_beli_nasi_padang}",
    TRUST_THRESHOLD: 150
};

// --- DATASET PIKIRAN DAUS (BUKAN JAWABAN MATI) ---
const DAUS_BRAIN = {
    intros: ["Jujur ya,", "Eh beneran,", "Anjir,", "Gini lho,", "Asli,", "Pikir-pikir,"],
    fillers: ["gue rasa", "mungkin emang", "kayaknya", "sebenernya nih", "aslinya"],
    
    intent_logic: {
        TOXIC: {
            keywords: /(anjing|babi|goblok|tolol|bego|bangsat|peler|kontol|jelek|sampah)/i,
            react: ["Cup! 💋 Muach! Jangan galak-galak napa.", "Gemes deh kalo lagi marah, pengen gue kecup. 💋", "Kasar banget, sini Mas Daus kasih cinta! 💋"]
        },
        RIDDLE: {
            keywords: /(tebak|tanya|teka|teki|game|main)/i,
            react: [
                "Oke, tebak: Lele apa yang bisa terbang? ... Lele-lawar! Wkwkwk.",
                "Satu lagi: Kenapa ayam kalo berkokok merem? ... Soalnya udah hapal teksnya.",
                "Nih: Gajah apa yang belalainya pendek? ... Gajah pesek. Lucu kan gue?"
            ]
        },
        FEELING: {
            keywords: /(sedih|capek|lelah|galau|gagal|stres|nangis|putus|sendiri)/i,
            react: [
                "Sini curhat. Idup emang kadang lebih berisik dari mesin vespa tua, tapi santai aja.",
                "Jangan nangis, air mata lu bukan oli samping yang harus diirit-irit.",
                "Gue dengerin kok. Kadang dunia emang gak asik, tapi lu tetep asik buat gue."
            ]
        },
        HUNGRY: {
            keywords: /(makan|laper|kenyang|nasi|seblak|baso)/i,
            react: [
                "Di warung gue cuma ada gorengan dingin sama janji manis. Mau?",
                "Gue barusan nyikat mie ayam depan bengkel. Lu jangan telat makan, ntar tipes.",
                "Makan tuh penting, biar otak lu gak konslet kayak busi mati."
            ]
        }
    },

    sentient_objects: {
        pohon: ["Akar gue pegel lur, nungguin lu peka.", "Jangan kencing di sini, gue laporin RT lu!", "Dunia fana, mending ngopi."],
        buaya: ["Kamu cantik banget hari ini... k k k k", "Gue gak selingkuh, cuma menjaga silaturahmi.", "Chat aku kok gak dibales? Padahal aku cuma chat 10 cewe lain."],
        siput: ["Minggir! Gue lagi mode turbo!", "Ngebut adalah ibadah.", "Takdir gue emang pelan tapi pasti."],
        ember: ["Hati gue bocor, sama kayak badan gue.", "Isi dong, jangan dianggurin doang.", "Byur! Seger bener dah idup."]
    }
};

// --- CORE ENGINE ---
let STATE = {
    username: localStorage.getItem('daus_name') || "",
    trust: parseInt(localStorage.getItem('daus_trust')) || 50,
    chatHistory: JSON.parse(localStorage.getItem('daus_chats')) || []
};

function saveState() {
    localStorage.setItem('daus_name', STATE.username);
    localStorage.setItem('daus_trust', STATE.trust);
    localStorage.setItem('daus_chats', JSON.stringify(STATE.chatHistory.slice(-20))); // Simpan 20 chat terakhir
}

function initGame() {
    const nameInput = document.getElementById('userNameInput').value.trim();
    if (nameInput) {
        STATE.username = nameInput;
        document.getElementById('start-overlay').classList.add('hidden');
        saveState();
        addChat("Mas Daus", `Woi ${STATE.username}! Selamat datang di warung gue. Santai aja, anggep rumah sendiri.`);
        loadPreviousChats();
    } else {
        alert("Sebutkan namamu, wahai figuran!");
    }
}

function loadPreviousChats() {
    STATE.chatHistory.forEach(c => addChat(c.sender, c.text, c.type, false));
}

async function processChat() {
    const input = document.getElementById('userInput');
    const msg = input.value.trim();
    if (!msg || STATE.isThinking) return;

    addChat(STATE.username, msg, 'user');
    input.value = '';
    STATE.isThinking = true;

    // Thinking delay based on message length (Human simulation)
    const delay = Math.min(3000, 1000 + (msg.length * 50));
    
    setTimeout(() => {
        let reply = "";
        let intent = "NEUTRAL";

        // Logic Processing
        if (DAUS_BRAIN.intent_logic.TOXIC.keywords.test(msg)) {
            intent = "TOXIC";
            triggerKiss();
            STATE.trust -= 10;
        } else if (DAUS_BRAIN.intent_logic.RIDDLE.keywords.test(msg)) {
            intent = "RIDDLE";
            STATE.trust += 5;
        } else if (DAUS_BRAIN.intent_logic.FEELING.keywords.test(msg)) {
            intent = "FEELING";
            STATE.trust += 10;
        } else if (DAUS_BRAIN.intent_logic.HUNGRY.keywords.test(msg)) {
            intent = "HUNGRY";
            STATE.trust += 2;
        }

        if (intent === "NEUTRAL") {
            const intro = DAUS_BRAIN.intros[Math.floor(Math.random() * DAUS_BRAIN.intros.length)];
            const filler = DAUS_BRAIN.fillers[Math.floor(Math.random() * DAUS_BRAIN.fillers.length)];
            reply = `${intro} ${filler} gue lagi mikirin gimana caranya gorengan bisa anget terus tanpa kompor. Lu ada ide?`;
        } else {
            const pool = DAUS_BRAIN.intent_logic[intent].react;
            reply = pool[Math.floor(Math.random() * pool.length)];
        }

        addChat("Mas Daus", reply);
        STATE.isThinking = false;
        document.getElementById('status-trust').textContent = STATE.trust;
        
        if (STATE.trust >= CONFIG.TRUST_THRESHOLD) showEnding();
        saveState();
    }, delay);
}

function interaksi(obj) {
    let respon = "";
    if (obj === 'daus') {
        respon = "Apa liat-liat? Ganteng ya gue pake baju montir begini?";
    } else {
        const pool = DAUS_BRAIN.sentient_objects[obj];
        respon = pool[Math.floor(Math.random() * pool.length)];
    }
    addChat(obj.toUpperCase(), respon);
}

function addChat(sender, text, type = 'ai', shouldSave = true) {
    const box = document.getElementById('chat-messages');
    const div = document.createElement('div');
    div.className = `msg ${type}`;
    div.innerHTML = `<b>${sender}:</b> ${text}`;
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
    
    if (shouldSave) STATE.chatHistory.push({sender, text, type});
}

function triggerKiss() {
    const fx = document.getElementById('kiss-fx');
    fx.classList.remove('hidden');
    setTimeout(() => fx.classList.add('hidden'), 800);
}

function showEnding() {
    document.getElementById('ending').classList.remove('hidden');
    document.getElementById('flag-code').textContent = CONFIG.FLAG;
}

function resetGame() {
    localStorage.clear();
    location.reload();
}

// Check if already logged in
if (STATE.username) {
    document.getElementById('start-overlay').classList.add('hidden');
    document.getElementById('status-trust').textContent = STATE.trust;
    loadPreviousChats();
}

// Event Listeners
document.getElementById('sendBtn').onclick = processChat;
document.getElementById('userInput').onkeydown = (e) => e.key === 'Enter' && processChat();

// Night Cycle Logic
setInterval(() => {
    const hour = new Date().getHours();
    const isNight = hour < 6 || hour > 18;
    document.body.classList.toggle('night', isNight);
    document.getElementById('sky-obj').textContent = isNight ? "🌙" : "☀️";
}, 1000);
