/* =========================
   ACHIEVEMENT SYSTEM GLOBAL
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
        max: 11
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

/* =========================
   LOCALSTORAGE HELPERS
========================= */
function getAchievements() {
    return JSON.parse(localStorage.getItem("achievements")) || {};
}

function saveAchievements(data) {
    localStorage.setItem("achievements", JSON.stringify(data));
}

function hasLaunched(eventName) {
    return localStorage.getItem("event_" + eventName) === "true";
}

function markAsLaunched(eventName) {
    localStorage.setItem("event_" + eventName, "true");
}

/* =========================
   POPUP CREATION
========================= */
const achievementPopup = document.createElement("div");
achievementPopup.id = "achievementPopup";
achievementPopup.innerHTML = `
    <div class="achievement-header">
        <h3>Achievements</h3>
        <button id="closeAchievementPopup" class="achievement-close">✕</button>
    </div>
    <div id="achievementContent"></div>
`;
document.body.appendChild(achievementPopup);

const achievementContent = document.getElementById("achievementContent");
const closeBtn = document.getElementById("closeAchievementPopup");

function renderAchievements() {
    const achievements = getAchievements();
    achievementContent.innerHTML = "";
    let completedCount = 0;
    const totalCount = Object.keys(achievementData).length;

    Object.keys(achievementData).forEach(id => {
        const data = achievementData[id];
        const progress = achievements[id] || 0;
        const isProgressive = data.max !== undefined;
        const isCompleted = isProgressive ? progress >= data.max : progress >= 1;
        if (isCompleted) completedCount++;

        const item = document.createElement("div");
        item.className = "achievement-item";
        if (isCompleted) item.classList.add("completed");

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

function openAchievementPopup() {
    achievementPopup.classList.add("open");
    renderAchievements();
}

function closeAchievementPopup() {
    achievementPopup.classList.remove("open");
}

/* =========================
   BUTTON ACHIEVEMENT
========================= */
const achievementBtn = document.getElementById("achievementBtn");

if (achievementBtn) {
    achievementBtn.addEventListener("click", e => {
        e.stopPropagation();
        openAchievementPopup();
    });
}

/* =========================
   BUTTON EVENTS
========================= */
document.addEventListener("click", e => {
    // Close popup if clicking outside
    if (achievementPopup.classList.contains("open") && !achievementPopup.contains(e.target)) {
        closeAchievementPopup();
    }
});

closeBtn.addEventListener("click", e => {
    e.stopPropagation();
    closeAchievementPopup();
});

/* =========================
   UPDATE ACHIEVEMENTS
========================= */
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
            saveAchievements(achievements);
            renderAchievements();
            if (data.max !== undefined && achievements[id] >= data.max) showAchievementToast(data.name);
        }
        return;
    }

    if (!achievements[id]) achievements[id] = 0;
    const before = achievements[id];

    if (data.max !== undefined) {
        achievements[id] += amount;
        if (achievements[id] > data.max) achievements[id] = data.max;
    } else {
        achievements[id] = 1;
    }

    saveAchievements(achievements);
    renderAchievements();

    const isCompleted = data.max ? achievements[id] >= data.max : achievements[id] >= 1;
    const wasCompleted = data.max ? before >= data.max : before >= 1;
    if (!wasCompleted && isCompleted) showAchievementToast(data.name);
}

/* =========================
   TOASTS
========================= */
function showAchievementToast(name) {
    const toast = document.createElement("div");
    toast.className = "achievement-toast";
    toast.innerHTML = `
        <div class="toast-icon">🏆</div>
        <div class="toast-content">
            <div class="toast-title">Succès débloqué</div>
            <div class="toast-name">${name}</div>
        </div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add("show"), 50);
    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// =========================
// ACHIEVEMENT VISITE PROJET (1 FOIS PAR PAGE)
// =========================

document.addEventListener("DOMContentLoaded", () => {

    const currentPage = window.location.pathname;
    const pageId = currentPage.split("/").pop();

    // On vérifie :
    // 1️⃣ que c'est dans /projects/
    // 2️⃣ que ce n'est pas index.html
    if (currentPage.includes("/projects/") && pageId !== "index.html") {
        updateAchievement("explorer", 1, pageId);
    }

});

/* =========================
   ACHIEVEMENT AUTO (5 minutes)
========================= */
setTimeout(() => { updateAchievement("dedicated"); }, 300000);