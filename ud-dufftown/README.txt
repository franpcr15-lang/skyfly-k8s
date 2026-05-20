UD DUFFTOWN — Web oficial
============================

Archivos incluidos:
- index.html  → estructura de la web (todas las secciones)
- styles.css  → estilos, paleta y diseño responsive
- script.js   → slider, menú móvil, animaciones, formulario

Cómo usarla
-----------
1) Descomprime la carpeta.
2) Haz doble clic sobre "index.html" para abrirla en el navegador.
3) Para subirla a internet, sube los 3 archivos al hosting que uses
   (por ejemplo: Hostinger, Netlify, Vercel, GitHub Pages, etc.).

Personalización rápida
----------------------
- Logo y colores: edita styles.css (variables al inicio :root).
   * --green-800  → verde principal del club
   * --gold-400   → dorado principal
   * --red-700    → acentos
- Imágenes provisionales: en index.html, los bloques con clase
  ".news-img", ".hl-img", ".video-thumb", ".ph", ".kit-piece"
  son placeholders. Sustitúyelos por <img src="tu-foto.jpg" ...>.
- Videos: en script.js, busca "video-play" y reemplaza el alert
  por la URL de YouTube/TikTok o reproductor propio.
- Menú: en index.html, el menú está en <nav class="main-nav">.
- Equipación: en la sección "Equipación", las zonas se gestionan con
  el atributo data-status="principal | premium | disponible" en cada
  elemento .zone — basta con cambiarlo para reflejar el estado real.

Compatibilidad
--------------
- Funciona en cualquier navegador moderno (Chrome, Firefox, Safari, Edge).
- Totalmente responsive: móvil, tablet y ordenador.
- Sin dependencias externas (solo Google Fonts).

¡A por todas, UD DUFFTOWN!
