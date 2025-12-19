document.addEventListener('DOMContentLoaded', () => {

    /* =========================
       FORMULAIRE DE CONTACT
    ========================= */
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function (event) {
            event.preventDefault();

            const formData = new FormData(this);

            fetch(this.action, {
                method: this.method,
                body: formData
            })
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

    let activeFilters = new Set();

    /* ----- Comptage des tags ----- */
    const tagCounts = {};

    projects.forEach(project => {
        project.dataset.tags.split(' ').forEach(tag => {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
    });

    filterButtons.forEach(button => {
        const filter = button.dataset.filter;
        if (filter !== 'all' && tagCounts[filter]) {
            button.textContent = `${button.textContent} (${tagCounts[filter]})`;
        }
    });

    /* ----- Compteur visible ----- */
    const projectCount = document.getElementById('projectCount');

    /* ----- Gestion des clics ----- */
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;

            // Bouton "Tous"
            if (filter === 'all') {
                activeFilters.clear();
                filterButtons.forEach(b => b.classList.remove('active'));
                button.classList.add('active');
                updateProjects();
                return;
            }

            // Désactiver "Tous"
            const allBtn = document.querySelector('[data-filter="all"]');
            if (allBtn) allBtn.classList.remove('active');

            // Toggle filtre
            button.classList.toggle('active');
            button.classList.contains('active')
                ? activeFilters.add(filter)
                : activeFilters.delete(filter);

            updateProjects();
        });
    });

    function updateProjects() {
    let visibleCount = 0;

    // Tout disparaît d'abord
    projects.forEach(project => {
        project.classList.add('hidden');
        project.style.display = 'block'; // important pour l'animation
    });
    
    // 1️⃣ Fade out ceux qui ne correspondent plus
    projects.forEach(project => {
        const tags = project.dataset.tags.split(' ');
        const visible =
            activeFilters.size === 0 ||
            [...activeFilters].every(tag => tags.includes(tag));

        if (!visible) {
            project.classList.add('hidden');

            // Après le fade out → on enlève du layout
            setTimeout(() => {
                project.classList.add('removed');
            }, 350);
        }
    });

    // 2️⃣ Fade in ceux qui doivent apparaître
    setTimeout(() => {
        projects.forEach(project => {
            const tags = project.dataset.tags.split(' ');
            const visible =
                activeFilters.size === 0 ||
                [...activeFilters].every(tag => tags.includes(tag));

            if (visible) {
                project.classList.remove('removed');

                // Force recalcul pour que le fade-in se déclenche
                project.getBoundingClientRect();

                project.classList.remove('hidden');
                visibleCount++;
            }
        });

        if (projectCount) {
            projectCount.textContent =
                `${visibleCount} projet${visibleCount > 1 ? 's' : ''}`;
        }
    }, 350);
}
});
