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

const easterEggs = [flipPage, miniGame, matrixMode, unlockRetroMode];

function flipPage() {

        if (!hasLaunched("flipPage")) updateAchievement("eventHunter");

    markAsLaunched("flipPage");

    document.body.classList.add("flip-mode");
    setTimeout(() => document.body.classList.remove("flip-mode"), 1500);
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

/* =========================
   RETRO MODE SYSTEM
========================= */

let retroUnlocked = localStorage.getItem("retroUnlocked") === "true";
let retroEnabled = localStorage.getItem("retroEnabled") === "true";

function createRetroToggle() {
    if (document.getElementById("retroToggleContainer")) return;

    const container = document.createElement("div");
    container.id = "retroToggleContainer";

    container.innerHTML = `
        <label class="retro-switch">
            <input type="checkbox" id="retroToggle">
            <span class="slider"></span>
        </label>
        <span class="retro-label">RETRO</span>
    `;

    document.body.appendChild(container);

    const toggle = document.getElementById("retroToggle");

    toggle.checked = retroEnabled;

    toggle.addEventListener("change", () => {
        retroEnabled = toggle.checked;
        localStorage.setItem("retroEnabled", retroEnabled);

        document.body.classList.toggle("retro-mode", retroEnabled);
    });
}

if (retroUnlocked) {
    createRetroToggle();
    document.body.classList.toggle("retro-mode", retroEnabled);
}

function unlockRetroMode() {

    if (retroUnlocked) return;

    updateAchievement("eventHunter");

    retroUnlocked = true;
    retroEnabled = true;

    localStorage.setItem("retroUnlocked", true);
    localStorage.setItem("retroEnabled", true);

    showRetroLoading(() => {
        createRetroToggle();
        document.body.classList.add("retro-mode");
    });
}

function showRetroLoading(callback) {

    const loader = document.createElement("div");
    loader.id = "retroLoader";

    loader.innerHTML = `
        <div class="retro-loader-box">
            <p>BOOTING SYSTEM...</p>
            <div class="retro-bar">
                <div class="retro-bar-fill"></div>
            </div>
        </div>
    `;

    document.body.appendChild(loader);

    setTimeout(() => {
        loader.remove();
        callback();
    }, 2500);
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

});
