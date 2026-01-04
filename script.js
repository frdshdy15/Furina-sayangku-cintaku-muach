"use strict";

// Gak pake loading palsu, pake sistem "Safe Load"
document.addEventListener('DOMContentLoaded', () => {
    
    // Objek Utama
    const UI = {
        login: document.getElementById('login-gate'),
        world: document.getElementById('universe'),
        chat: document.getElementById('chat-pro'),
        stream: document.getElementById('chat-stream'),
        nameInp: document.getElementById('playerName'),
        msgInp: document.getElementById('msgInp'),
        pName: document.getElementById('p-name'),
        talkingTo: document.getElementById('talking-to')
    };

    const BTNS = {
        enter: document.getElementById('btnEnter'),
        gas: document.getElementById('btnGas'),
        close: document.getElementById('close-chat')
    };

    // --- LOGIKA MASUK ---
    const enterWorld = () => {
        const name = UI.nameInp.value.trim();
        if(!name) {
            alert("Sebutkan namamu, wahai pengembara!");
            return;
        }
        UI.pName.innerText = name;
        UI.login.classList.add('hidden');
        UI.world.style.display = 'block';
    };

    BTNS.enter.onclick = enterWorld;
    UI.nameInp.onkeydown = (e) => e.key === 'Enter' && enterWorld();

    // --- LOGIKA CHAT ---
    window.openChat = (name) => {
        UI.chat.style.display = 'flex';
        UI.talkingTo.innerText = name.toUpperCase();
        addMsg('ai', `Halo Lur! Gue ${name}. Ada perlu apa mampir ke sini?`);
    };

    // Daftarkan NPC secara manual agar aman
    document.getElementById('npc-daus').onclick = () => openChat('Mas Daus');
    document.getElementById('npc-ayam').onclick = () => openChat('Ayam Jago');

    const sendChat = () => {
        const txt = UI.msgInp.value.trim();
        if(!txt) return;

        addMsg('user', txt);
        UI.msgInp.value = '';

        setTimeout(() => {
            let respon = "Gokil bener lu, Lur! Gue setuju 100%.";
            if(/(anjing|babi|goblok|tolol|kontol)/i.test(txt)) {
                respon = "💋 MUACH! Mulutnya dijaga ya sayang, Mas Daus cium nih!";
                triggerKiss();
            }
            addMsg('ai', respon);
        }, 800);
    };

    BTNS.gas.onclick = sendChat;
    UI.msgInp.onkeydown = (e) => e.key === 'Enter' && sendChat();
    BTNS.close.onclick = () => UI.chat.style.display = 'none';

    function addMsg(type, text) {
        const bbl = document.createElement('div');
        bbl.className = `bbl b-${type}`;
        bbl.innerText = text;
        UI.stream.appendChild(bbl);
        UI.stream.scrollTop = UI.stream.scrollHeight;
    }

    function triggerKiss() {
        const k = document.getElementById('kiss-screen');
        k.classList.remove('hidden');
        setTimeout(() => k.classList.add('hidden'), 1000);
    }
});
