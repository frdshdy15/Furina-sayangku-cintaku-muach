"use strict";

const MEMORY = {
    player: localStorage.getItem('daus_player') || "",
    trust: parseInt(localStorage.getItem('daus_trust')) || 50,
    chats: JSON.parse(localStorage.getItem('daus_chats')) || { daus:[], ayam:[], buaya:[], pohon:[] },
    lastMet: ""
};

// --- SYSTEM LOADING ---
function initSystem() {
    let prog = 0;
    const bar = document.getElementById('progress-bar');
    const status = document.getElementById('status-text');
    const form = document.getElementById('entry-form');

    const interval = setInterval(() => {
        prog += Math.random() * 15;
        if (prog >= 100) {
            prog = 100;
            clearInterval(interval);
            status.innerText = "Sistem Stabil! Silahkan Masuk.";
            form.classList.remove('hidden');
            if (MEMORY.player) {
                document.getElementById('inputNama').value = MEMORY.player;
            }
        }
        bar.style.width = prog + "%";
    }, 150);
}

// --- CORE ACTIONS ---
function enterWorld() {
    const name = document.getElementById('inputNama').value.trim();
    if (!name) return alert("Isi nama lu dulu mang!");

    MEMORY.player = name;
    localStorage.setItem('daus_player', name);
    
    document.getElementById('loading-overlay').classList.add('hidden');
    document.getElementById('game-world').classList.add('visible');
    document.getElementById('ui-nama').innerText = name;
    document.getElementById('ui-trust').innerText = MEMORY.trust;

    // Start Chaos
    setInterval(chaosEffect, 15000);
}

function interact(who) {
    const win = document.getElementById('chat-window');
    win.style.display = 'flex';
    document.getElementById('chat-title').innerText = who.toUpperCase();
    
    if (who === 'daus' && MEMORY.lastMet && MEMORY.lastMet !== 'daus') {
        renderBubble('ai', `Bau-bau si ${MEMORY.lastMet} nih... abis selingkuh ya lu?`, 'daus');
    }
    
    MEMORY.lastMet = who;
    loadChatHistory(who);
}

function closeChat() {
    document.getElementById('chat-window').style.display = 'none';
}

function sendMessage() {
    const inp = document.getElementById('userQuery');
    const msg = inp.value.trim();
    const target = document.getElementById('chat-title').innerText.toLowerCase();

    if (!msg) return;

    renderBubble('user', msg, target);
    inp.value = '';

    setTimeout(() => {
        let reply = "Iya mang, bener banget itu.";
        if (/(anjing|babi|goblok|tolol)/i.test(msg)) {
            triggerKiss();
            reply = "💋 Cup! Muach! Jangan kasar-kasar napa sama Mas Daus.";
        }
        renderBubble('ai', reply, target);
    }, 800);
}

// --- UTILS ---
function renderBubble(type, text, target) {
    const logs = document.getElementById('chat-logs');
    const div = document.createElement('div');
    div.className = `bubble ${type}`;
    div.innerText = text;
    logs.appendChild(div);
    logs.scrollTop = logs.scrollHeight;

    // Save
    MEMORY.chats[target].push({ type, text });
    localStorage.setItem('daus_chats', JSON.stringify(MEMORY.chats));
}

function loadChatHistory(target) {
    const logs = document.getElementById('chat-logs');
    logs.innerHTML = '';
    MEMORY.chats[target].forEach(m => {
        const div = document.createElement('div');
        div.className = `bubble ${m.type}`;
        div.innerText = m.text;
        logs.appendChild(div);
    });
    logs.scrollTop = logs.scrollHeight;
}

function triggerKiss() {
    const fx = document.getElementById('kiss-fx');
    fx.classList.remove('hidden');
    setTimeout(() => fx.classList.add('hidden'), 1000);
}

function chaosEffect() {
    if (Math.random() > 0.7) {
        const ground = document.getElementById('event-ground');
        const boom = document.createElement('div');
        boom.style.position = 'absolute';
        boom.style.fontSize = '80px';
        boom.style.left = Math.random() * 80 + '%';
        boom.innerText = '💥';
        ground.appendChild(boom);
        setTimeout(() => boom.remove(), 1000);
    }
}

// --- BOOTSTRAP ---
document.addEventListener('DOMContentLoaded', () => {
    initSystem();
    document.getElementById('btnMulai').onclick = enterWorld;
    document.getElementById('btnSend').onclick = sendMessage;
    document.getElementById('userQuery').onkeydown = (e) => e.key === 'Enter' && sendMessage();
});
