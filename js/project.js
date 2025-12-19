document.addEventListener('DOMContentLoaded', () => {

  // =========================
  // GALERIE PRINCIPALE (VIDEO ↔ IMAGE)
  // =========================
  const thumbnails = document.querySelectorAll('.media-thumbnails img');
  const mediaMain = document.getElementById('mediaMain');

  if (mediaMain && thumbnails.length > 0) {

    thumbnails.forEach(thumb => {
      thumb.addEventListener('click', () => {

        // Gestion de l'état actif des miniatures
        thumbnails.forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');

        // Retire l'état visible pour animation
        mediaMain.classList.remove('show');

        setTimeout(() => {

          // Vide l'ancien contenu
          mediaMain.innerHTML = '';

          if (thumb.dataset.type === 'youtube') {
            mediaMain.innerHTML = `
              <iframe
                src="${thumb.dataset.src}?autoplay=1&rel=0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen>
              </iframe>
            `;
          } else {
            mediaMain.innerHTML = `
              <img src="${thumb.dataset.src}" alt="">
            `;
          }

          // Force repaint puis animation fade+zoom
          requestAnimationFrame(() => {
            mediaMain.classList.add('show');
          });

        }, 200);
      });
    });

    // Active la première miniature
    thumbnails[0].classList.add('active');
    mediaMain.classList.add('show');
  }

  // =========================
  // SECTION FONCTIONNALITES (ONGLETS)
  // =========================
  const featureButtons = document.querySelectorAll('.feature-tabs button');
  const featurePanels = document.querySelectorAll('.feature-panel');

  featureButtons.forEach(button => {
    button.addEventListener('click', () => {

      // Retire l'état actif
      featureButtons.forEach(b => b.classList.remove('active'));
      featurePanels.forEach(p => p.classList.remove('active'));

      // Active le bouton et le panel correspondant
      button.classList.add('active');
      document.getElementById(button.dataset.feature).classList.add('active');
    });
  });

});
