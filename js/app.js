document.addEventListener('DOMContentLoaded', () => {

    /* =========================
       FORMULAIRE DE CONTACT
    ========================= */
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const formData = new FormData(this);
            fetch(this.action, { method: this.method, body: formData })
                .then(response => {
                    document.getElementById('formMessage').textContent = response.ok
                        ? 'Merci pour votre message, il a bien été envoyé !'
                        : 'Oups, quelque chose a mal tourné. Essayez encore.';
                    if (response.ok) this.reset();
                })
                .catch(() => {
                    document.getElementById('formMessage').textContent =
                        'Erreur de connexion. Veuillez réessayer plus tard.';
                });
        });
    }

    /* =========================
       FILTRES DES PROJETS
    ========================= */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projects = document.querySelectorAll('.project-card');
    const projectCount = document.getElementById('projectCount');

    let activeFilters = new Set();

    // Compter les tags pour afficher le nombre sur les boutons
    const tagCounts = {};
    projects.forEach(p => p.dataset.tags.split(' ').forEach(tag => tagCounts[tag] = (tagCounts[tag] || 0) + 1));
    filterButtons.forEach(btn => {
        const filter = btn.dataset.filter;
        if (filter !== 'all' && tagCounts[filter]) {
            btn.textContent = `${btn.textContent} (${tagCounts[filter]})`;
        }
    });

    // Gestion clics filtres
    filterButtons.forEach(button => button.addEventListener('click', () => {
        const filter = button.dataset.filter;
        if (filter === 'all') {
            activeFilters.clear();
            filterButtons.forEach(b => b.classList.remove('active'));
            button.classList.add('active');
            updateProjects();
            return;
        }
        document.querySelector('[data-filter="all"]')?.classList.remove('active');
        button.classList.toggle('active');
        button.classList.contains('active') ? activeFilters.add(filter) : activeFilters.delete(filter);
        updateProjects();
    }));

    function updateProjects() {
        let visibleCount = 0;

        // Tout disparaît
        projects.forEach(p => {
            p.classList.add('hidden');
            p.style.display = 'block';
        });

        // Fade out projets non visibles
        projects.forEach(p => {
            const tags = p.dataset.tags.split(' ');
            const visible = activeFilters.size === 0 || [...activeFilters].every(tag => tags.includes(tag));
            if (!visible) {
                p.classList.add('hidden');
                setTimeout(() => p.classList.add('removed'), 350);
            }
        });

        // Fade in projets visibles
        setTimeout(() => {
            projects.forEach(p => {
                const tags = p.dataset.tags.split(' ');
                const visible = activeFilters.size === 0 || [...activeFilters].every(tag => tags.includes(tag));
                if (visible) {
                    p.classList.remove('removed');
                    p.getBoundingClientRect(); // force recalcul pour animation
                    p.classList.remove('hidden');
                    visibleCount++;
                }
            });
            if (projectCount) projectCount.textContent = `${visibleCount} projet${visibleCount > 1 ? 's' : ''}`;
        }, 350);
    }

/* =========================
   KONAMI CODE
========================= */

const easterEggs = [flipPage, bossMode, miniGame, matrixMode];

function flipPage() {

        if (!hasLaunched("flipPage")) updateAchievement("eventHunter");

    markAsLaunched("flipPage");

    document.body.classList.add("flip-mode");
    setTimeout(() => document.body.classList.remove("flip-mode"), 1500);
}

function bossMode() {

        if (!hasLaunched("bossMode")) updateAchievement("eventHunter");

    markAsLaunched("bossMode");

    const msg = document.createElement("div");
    msg.textContent = "You reached the final level!";
    msg.style.position = "fixed";
    msg.style.bottom = "20px";
    msg.style.left = "50%";
    msg.style.transform = "translateX(-50%)";
    msg.style.background = "#4CAF50";
    msg.style.color = "#121212";
    msg.style.padding = "10px 20px";
    msg.style.borderRadius = "12px";
    msg.style.zIndex = 10000;
    document.body.appendChild(msg);
    setTimeout(() => document.body.removeChild(msg), 2000);
}

function miniGame() {

        if (!hasLaunched("miniGame")) updateAchievement("eventHunter");

    markAsLaunched("miniGame");

    const game = document.createElement("div");
    game.style.position = "fixed";
    game.style.top = 0;
    game.style.left = 0;
    game.style.width = "100%";
    game.style.height = "100%";
    game.style.background = "rgba(0,0,0,0.9)";
    game.style.overflow = "hidden";
    game.style.zIndex = 9999;
    document.body.appendChild(game);

    // Score
    const scoreDisplay = document.createElement("div");
    scoreDisplay.style.position = "absolute";
    scoreDisplay.style.top = "20px";
    scoreDisplay.style.left = "50%";
    scoreDisplay.style.transform = "translateX(-50%)";
    scoreDisplay.style.color = "#4CAF50";
    scoreDisplay.style.fontSize = "24px";
    scoreDisplay.style.fontFamily = "monospace";
    game.appendChild(scoreDisplay);

    let score = 0;

    // Joueur
    const player = document.createElement("div");
    player.style.position = "absolute";
    player.style.bottom = "40px";
    player.style.width = "60px";
    player.style.height = "20px";
    player.style.background = "#4CAF50";
    player.style.borderRadius = "8px";
    game.appendChild(player);

    let playerX = window.innerWidth / 2 - 30;
    const speed = 12;

    const keys = {
        left: false,
        right: false
    };

    document.addEventListener("keydown", e => {
        if (e.key === "ArrowLeft") keys.left = true;
        if (e.key === "ArrowRight") keys.right = true;
    });

    document.addEventListener("keyup", e => {
        if (e.key === "ArrowLeft") keys.left = false;
        if (e.key === "ArrowRight") keys.right = false;
    });

    // Sprite
    const sprite = document.createElement("div");
    sprite.style.position = "absolute";
    sprite.style.width = "30px";
    sprite.style.height = "30px";
    sprite.style.background = "#FFD700";
    sprite.style.borderRadius = "50%";
    game.appendChild(sprite);

    let spriteX = Math.random() * (window.innerWidth - 30);
    let spriteY = 0;
    let spriteSpeed = 4;

    function resetSprite() {
        spriteY = 0;
        spriteX = Math.random() * (window.innerWidth - 30);

        if (score < 10){
            spriteSpeed += 0.3; // difficulté progressive
        }
    }

    function update() {

        // Mouvement fluide
        if (keys.left) playerX -= speed;
        if (keys.right) playerX += speed;

        playerX = Math.max(0, Math.min(window.innerWidth - 60, playerX));
        player.style.left = playerX + "px";

        // Sprite tombe
        spriteY += spriteSpeed;
        sprite.style.left = spriteX + "px";
        sprite.style.top = spriteY + "px";

        // Collision
        if (
            spriteY + 30 >= window.innerHeight - 60 &&
            spriteX + 30 > playerX &&
            spriteX < playerX + 60
        ) {
            score++;
            scoreDisplay.textContent = "Score: " + score;

            // Juice → effet scale
            sprite.style.transform = "scale(1.5)";
            setTimeout(() => sprite.style.transform = "scale(1)", 100);

            resetSprite();
        }

        // Game over
        if (spriteY > window.innerHeight) {
            endGame();
            return;
        }

        requestAnimationFrame(update);
    }

    function endGame() {
        alert("Game Over ! Score : " + score);
        if (score >= 10) updateAchievement("arcadeMaster");
        document.body.removeChild(game);
    }

    scoreDisplay.textContent = "Score: 0";
    resetSprite();
    update();
}

function matrixMode() {

        if (!hasLaunched("matrixMode")) updateAchievement("eventHunter");

    markAsLaunched("matrixMode");

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.style.position = "fixed";
    canvas.style.top = 0;
    canvas.style.left = 0;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.zIndex = "-1"; // derrière ton contenu
    canvas.style.pointerEvents = "none";
    canvas.style.opacity = "1";

    document.body.appendChild(canvas);

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const letters = "アカサタナハマヤラワ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const fontSize = 16;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(1);

    let animationId;
    let running = true;

    function draw() {

        ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#00ff88";
        ctx.font = fontSize + "px monospace";

        for (let i = 0; i < drops.length; i++) {
            const text = letters[Math.floor(Math.random() * letters.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975)
                drops[i] = 0;

            drops[i]++;
        }

        if (running) {
            animationId = requestAnimationFrame(draw);
        }
    }

    draw();

    // Lancer le fade après 3 secondes
    setTimeout(() => {
        running = false;

        let fade = 1;
        const fadeOut = setInterval(() => {
            fade -= 0.02;
            canvas.style.opacity = fade;

            if (fade <= 0) {
                clearInterval(fadeOut);
                cancelAnimationFrame(animationId);
                document.body.removeChild(canvas);
            }
        }, 30);

    }, 3000);
}

const konamiCode = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
    "b",
    "a"
];

let konamiPosition = 0;

document.addEventListener("keydown", (e) => {
    const key = e.key.toLowerCase();

    if (key === konamiCode[konamiPosition].toLowerCase()) {
        konamiPosition++;

        if (konamiPosition === konamiCode.length) {
            // Choisir un easter egg au hasard
            const randomEgg = easterEggs[Math.floor(Math.random() * easterEggs.length)];
            randomEgg();
            updateAchievement("konami");
            konamiPosition = 0;
        }
    } else {
        konamiPosition = 0;
    }
});

function hasLaunched(eventName) {
    return localStorage.getItem("event_" + eventName) === "true";
}

function markAsLaunched(eventName) {
    localStorage.setItem("event_" + eventName, "true");
}

/* =========================
   ACHIEVEMENT SYSTEM
========================= */

/* ========= CONFIG ========= */

const achievementData = {
    konami: {
        name: "Konami Initiate",
        description: "Découvrir le Konami Code",
    },
    explorer: {
        name: "Explorer",
        description: "Visiter tous les projets",
        max: 10
    },
    eventHunter: {
        name: "Event Hunter",
        description: "Avoir au moins une fois tous les évènements",
        max: 4
    },
    arcadeMaster: {
        name: "Arcade Survivor",
        description: "Atteindre 10 points",
    },
    dedicated: {
        name: "Dedicated",
        description: "Rester 5 minutes sur le site"
    }
};


   function getAchievements() { return JSON.parse(localStorage.getItem("achievements")) || {}; }
    function saveAchievements(data) { localStorage.setItem("achievements", JSON.stringify(data)); }

    // Création popup
    const popup = document.createElement("div"); popup.id = "achievementPopup";
    popup.innerHTML = `
        <div class="achievement-header">
            <h3>Achievements</h3>
            <button id="closeAchievementPopup" class="achievement-close">✕</button>
        </div>
        <div id="achievementContent"></div>
    `;
    document.body.appendChild(popup);

    const achievementContent = document.getElementById("achievementContent");
    const closeBtn = document.getElementById("closeAchievementPopup");
    const achievementBtn = document.getElementById("achievementBtn");

    function renderAchievements() {
        const achievements = getAchievements();
        achievementContent.innerHTML = "";
        let completedCount = 0;
        const totalCount = Object.keys(achievementData).length;

        Object.keys(achievementData).forEach(id => {
            const data = achievementData[id], progress = achievements[id] || 0, isProgressive = data.max !== undefined;
            const isCompleted = isProgressive ? progress >= data.max : progress >= 1;
            if (isCompleted) completedCount++;

            const item = document.createElement("div"); item.className = "achievement-item"; if (isCompleted) item.classList.add("completed");
            item.innerHTML = `
                <div class="achievement-top">
                    <strong>${data.name}</strong> ${isCompleted ? '<span class="badge">✔</span>' : ''}
                </div>
                <div class="achievement-desc">${data.description}</div>
                ${isProgressive ? `<div class="progress-bar"><div class="progress-fill" style="width:${Math.min((progress/data.max)*100,100)}%"></div></div><div class="progress-text">${progress}/${data.max}</div>` : ''}
            `;
            achievementContent.appendChild(item);
        });

        const global = document.createElement("div");
        global.className = "achievement-global";
        global.textContent = `Progression globale : ${completedCount} / ${totalCount}`;
        achievementContent.appendChild(global);
    }

    function openPopup() { popup.classList.add("open"); renderAchievements(); }
    function closePopup() { popup.classList.remove("open"); }

    if (achievementBtn) achievementBtn.addEventListener("click", (e) => { e.stopPropagation(); popup.classList.toggle("open"); renderAchievements(); });
    closeBtn.addEventListener("click", e => { e.stopPropagation(); closePopup(); });
    document.addEventListener("click", e => { if (popup.classList.contains("open") && !popup.contains(e.target) && e.target !== achievementBtn) closePopup(); });

    function updateAchievement(id, amount = 1, uniqueId = null) {
        if (!achievementData[id]) return;
        let achievements = getAchievements();
        const data = achievementData[id];

        if (uniqueId) {
            if (!achievements.seenItems) achievements.seenItems = {};
            if (!achievements.seenItems[id]) achievements.seenItems[id] = [];
            if (!achievements.seenItems[id].includes(uniqueId)) {
                achievements.seenItems[id].push(uniqueId);
                achievements[id] = achievements.seenItems[id].length;
                saveAchievements(achievements); renderAchievements();
                if (data.max !== undefined && achievements[id] >= data.max) showAchievementToast(data.name);
            }
            return;
        }

        if (!achievements[id]) achievements[id] = 0;
        const before = achievements[id];
        if (data.max !== undefined) { achievements[id] += amount; if (achievements[id] > data.max) achievements[id] = data.max; }
        else achievements[id] = 1;

        saveAchievements(achievements); renderAchievements();

        const isCompleted = data.max ? achievements[id] >= data.max : achievements[id] >= 1;
        const wasCompleted = data.max ? before >= data.max : before >= 1;
        if (!wasCompleted && isCompleted) showAchievementToast(data.name);
    }

    function showAchievementToast(name) {
        const toast = document.createElement("div"); toast.className = "achievement-toast";
        toast.innerHTML = `<div class="toast-icon">🏆</div><div class="toast-content"><div class="toast-title">Succès débloqué</div><div class="toast-name">${name}</div></div>`;
        document.body.appendChild(toast);
        setTimeout(() => toast.classList.add("show"), 50);
        setTimeout(() => { toast.classList.remove("show"); setTimeout(() => toast.remove(), 300); }, 3000);
    }

    // Achievement auto 5 minutes
    setTimeout(() => { updateAchievement("dedicated"); }, 300000);

});
