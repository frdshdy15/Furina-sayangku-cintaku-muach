"use strict";

/**
 * DAUS NEURAL BENGKEL V8.0
 * Logic: Heuristic Contextual Intelligence
 * Karakter: Absurd, Pintar, Lokal, Empati.
 */

const STATE = {
    username: "Bosku",
    trust: 50,
    startTime: new Date(),
    memory: [], // Menyimpan konteks obrolan
    lastIntent: null,
    topicLock: null
};

// --- DATASET MULTIVERSE (Fragmentasi Bahasa Manusia) ---
const BRAIN = {
    // Kumpulan istilah gaul & teknis untuk variasi
    fragments: {
        slang: ["anjir", "asli", "kagak bohong", "beneran deh", "sumpah ya", "gila sih"],
        filler: ["lo tau gak,", "sebenarnya nih,", "pikir-pikir,", "menurut penerawangan gue,"],
        analogy: [
            "idup tuh kayak rante motor, kalo kering ya berisik.",
            "lo itu ibarat busi, kecil tapi kalo mati ya mogok semuanya.",
            "masalah itu kayak oli bocor, jangan didiemin ntar ngerembet ke mesin.",
            "jangan kayak knalpot bobokan, suaranya doang gede nyalinya nol."
        ]
    },

    // Mapping Intent dengan Ribuan Kemungkinan (Fuzzy Match)
    intents: [
        {
            id: "MAM",
            regex: /makan|mam|lapar|nasi|kenyang|laper|kuliner|food/i,
            responses: [
                "Gue barusan nyikat nasi uduk depan bengkel, karetnya dua biar mantap. Lu udah isi bensin perut belum?",
                "Makan tuh penting, Bos. Jangan sampe lambung lu turun mesin gara-gara telat makan.",
                "Gue sih kenyang makan janji manis doang. Lu mending makan beneran gih, nasi padang enak tuh."
            ]
        },
        {
            id: "CURHAT",
            regex: /sedih|capek|lelah|galau|masalah|sakit|nangis|sendiri|gagal|putus/i,
            responses: [
                "Sini cerita. Masalah idup emang kadang lebih berisik dari mesin vespa tua, tapi pasti ada solusinya.",
                "Dunia emang keras, Bos. Mending kita bore-up semangatnya. Jangan mau kalah sama keadaan.",
                "Gue dengerin kok. Kalo mau nangis ya nangis aja, air mata kan bukan oli samping yang harus diirit-irit."
            ]
        },
        {
            id: "TOXIC",
            regex: /anjing|babi|goblok|tolol|bego|jelek|sampah|bangsat/i,
            responses: [
                "Waduh, knalpot lu bocor ya? Kasar bener suaranya. Sini gue ganti businya biar pinteran dikit.",
                "Mulut lu bau bensin oplosan ya? Santai dong, kita kan kawan bukan lawan.",
                "Gue laporin ke pak RT tau rasa lu. Jaga etika di wilayah bengkel gue!"
            ]
        },
        {
            id: "TEBAK",
            regex: /tebak|tanya|apa itu|kenapa|lucu/i,
            responses: [
                "Kenapa motor suaranya brem-brem? Karena kalo bunyinya meong itu kucing narik ojek.",
                "Tau gak kenapa ban itu bunder? Karena kalo segitiga goyangannya bikin pinggang copot.",
                "Apa bedanya kamu sama oli? Kalo oli melumasi mesin, kalo kamu melumasi hari-hariku. Asik!"
            ]
        }
    ]
};

const ENGINE = {
    // 1. ANALYZER (Mendeteksi maksud & Typo)
    analyze: (input) => {
        for (let intent of BRAIN.intents) {
            if (intent.regex.test(input)) return intent;
        }
        return null;
    },

    // 2. SYNTHESIZER (Merakit kalimat agar tidak kaku)
    generateResponse: (intent, input) => {
        const f = BRAIN.fragments;
        const prefix = f.filler[Math.floor(Math.random() * f.filler.length)];
        const slang = f.slang[Math.floor(Math.random() * f.slang.length)];
        
        let coreReply = "";
        
        if (intent) {
            coreReply = intent.responses[Math.floor(Math.random() * intent.responses.length)];
        } else {
            // Jika di luar dataset, gunakan Analogi Filosofis
            coreReply = f.analogy[Math.floor(Math.random() * f.analogy.length)];
        }

        return `${prefix} ${slang}, ${coreReply}`;
    },

    // 3. MAIN PROCESSOR
    process: (input) => {
        const intent = ENGINE.analyze(input);
        
        // Simpan Memori
        STATE.memory.push(input);
        if (STATE.memory.length > 5) STATE.memory.shift();

        // Update Trust & UI
        if (intent?.id === "TOXIC") STATE.trust -= 15;
        if (intent?.id === "CURHAT") STATE.trust += 10;
        
        UI.updateClock();

        // Simulasi "Daus Mikir" (Delay Manusiawi)
        const delay = 800 + (input.length * 20) + (Math.random() * 1000);
        
        setTimeout(() => {
            if (STATE.trust >= 150) {
                ENGINE.triggerEnding();
            } else {
                const reply = ENGINE.generateResponse(intent, input);
                UI.addBubble(reply, 'ai');
            }
        }, delay);
    },

    triggerEnding: () => {
        const screen = document.getElementById('ending-screen');
        const flagBox = document.getElementById('flagValue');
        screen.classList.remove('hidden');
        flagBox.textContent = "FLAG{minta uang ke daus buat beli nasi padang}";
    }
};

const UI = {
    addBubble: (msg, type) => {
        const container = document.getElementById('chat-container');
        const div = document.createElement('div');
        div.className = `bubble ${type}`;
        div.textContent = msg;
        container.appendChild(div);
        
        // Auto Scroll
        container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
    },

    updateClock: () => {
        const now = new Date();
        document.getElementById('clock').textContent = now.toLocaleTimeString('id-ID');
    }
};

// --- EVENT LISTENERS ---
window.onload = () => {
    const input = document.getElementById('userInput');
    const btn = document.getElementById('sendBtn');

    const handleSend = () => {
        const val = input.value.trim();
        if (val) {
            UI.addBubble(val, 'user');
            ENGINE.process(val);
            input.value = '';
        }
    };

    btn.onclick = handleSend;
    input.onkeydown = (e) => { if (e.key === 'Enter') handleSend(); };

    // Set Interval Clock
    setInterval(UI.updateClock, 1000);
    UI.updateClock();
};
