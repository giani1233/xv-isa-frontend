// ================= INTRO ANIMACIÓN =================
const intro = document.getElementById('intro-animation');
const mainContent = document.getElementById('main-content');
const logo = intro.querySelector('img');

document.body.classList.add('no-scroll');
mainContent.classList.add('hidden');

logo.addEventListener('animationend', () => {
  intro.style.display = 'none';
  mainContent.classList.remove('hidden');
  void mainContent.offsetWidth;
  mainContent.classList.add('visible');
  document.body.classList.remove('no-scroll');
});


// ================= FORM RSVP =================
const formRsvp = document.getElementById('form-rsvp');
const cantidadSelect = document.getElementById('cantidad-personas');
const personasWrapper = document.getElementById('personas-wrapper');

const opcionesRequerimientos = [
  'Vegano',
  'Vegetariano',
  'Intolerante a la lactosa',
  'Diabetico',
  'Hipertenso',
  'Celiaco'
];

function generarPersonas(cantidad) {
  personasWrapper.innerHTML = '';

  for (let i = 1; i <= cantidad; i++) {
    const div = document.createElement('div');
    div.className = 'persona';
    div.innerHTML = `
      <h4>Persona ${i}</h4>
      <input type="text" name="nombre" placeholder="Nombre" required />
      <input type="text" name="apellido" placeholder="Apellido" required />
      <label>¿ALGÚN REQUERIMIENTO EN LA ALIMENTACIÓN?
        <select name="requerimiento">
          <option value="">Ninguno</option>
          ${opcionesRequerimientos.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
        </select>
      </label>
    `;
    personasWrapper.appendChild(div);
  }
}

generarPersonas(1);
cantidadSelect.addEventListener('change', e => generarPersonas(Number(e.target.value)));

formRsvp.addEventListener('submit', async e => {
  e.preventDefault();

  const personas = Array.from(personasWrapper.querySelectorAll('.persona')).map(div => ({
    nombre: div.querySelector('input[name="nombre"]').value.trim(),
    apellido: div.querySelector('input[name="apellido"]').value.trim(),
    requerimientos: div.querySelector('select[name="requerimiento"]').value || null
  }));

  if (personas.some(p => !p.nombre || !p.apellido)) {
    alert('Por favor completa el nombre y apellido de todas las personas.');
    return;
  }

  try {
    const res = await fetch('xv-isa-backend-production-36cf.up.railway.app/rsvp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ personas })
    });

    const json = await res.json();
    alert(json.message);
    formRsvp.reset();
    generarPersonas(1);
  } catch {
    alert('Error al enviar la confirmación.');
  }
});


// ================= FORM CANCIONES =================
const formCanciones = document.getElementById('form-canciones');
const inputCancion = formCanciones.querySelector('input[name="cancion"]');

formCanciones.addEventListener('submit', async e => {
  e.preventDefault();
  const cancion = inputCancion.value.trim();
  if (!cancion) return alert('Por favor ingresa una canción.');

  try {
    const res = await fetch('xv-isa-backend-production-36cf.up.railway.app/canciones', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cancion })
    });
    const json = await res.json();
    alert(json.message);
    inputCancion.value = '';
  } catch {
    alert('Error al enviar la canción.');
  }
});


// ================= CUENTA REGRESIVA =================
function countdown() {
  const fiesta = new Date('2026-02-16T21:00:00');
  const now = new Date();
  const diff = fiesta - now;

  if (diff <= 0) return;

  document.getElementById('dias').textContent = Math.floor(diff / (1000 * 60 * 60 * 24));
  document.getElementById('horas').textContent = Math.floor((diff / (1000 * 60 * 60)) % 24);
  document.getElementById('minutos').textContent = Math.floor((diff / (1000 * 60)) % 60);
}
setInterval(countdown, 60000);
countdown();


// ================= BOTONES =================
document.getElementById('add-calendar').addEventListener('click', () => {
  const start = new Date('2026-02-16T21:00:00').toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const end = new Date('2026-02-17T06:00:00').toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  window.open(`https://www.google.com/calendar/render?action=TEMPLATE&text=XV%20de%20Isa&dates=${start}/${end}`, '_blank');
});

document.getElementById('ver-mapa').addEventListener('click', () => {
  window.open('https://maps.app.goo.gl/zVyxxEwryR2vpMR16', '_blank');
});

document.getElementById('instagram').addEventListener('click', () => {
  window.open('https://www.instagram.com/iisa.fernandez_/', '_blank');
});


// ================= CARRUSEL INFINITO REAL =================
const slidesContainer = document.querySelector('#carrusel .slides');
let slides = Array.from(slidesContainer.children);
const prevArea = document.querySelector('.prev-area');
const nextArea = document.querySelector('.next-area');

slides.forEach(slide => slidesContainer.appendChild(slide.cloneNode(true)));
slides = Array.from(slidesContainer.children);

let currentIndex = 0;
let isAnimating = false;

function getSlideWidth() {
  const styles = getComputedStyle(slidesContainer);
  const gap = parseFloat(styles.gap || 0);
  return slides[0].getBoundingClientRect().width + gap;
}

let slideWidth = getSlideWidth();

function moveCarousel(dir) {
  if (isAnimating) return;
  isAnimating = true;
  currentIndex += dir === 'next' ? 1 : -1;
  slidesContainer.style.transition = 'transform .6s ease';
  slidesContainer.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
}

slidesContainer.addEventListener('transitionend', () => {
  const half = slides.length / 2;
  if (currentIndex >= half) currentIndex = 0;
  if (currentIndex < 0) currentIndex = half - 1;

  slidesContainer.style.transition = 'none';
  slidesContainer.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
  isAnimating = false;
});

let autoScroll;
function startAuto() {
  autoScroll = setInterval(() => moveCarousel('next'), 3000);
}
function stopAuto() {
  clearInterval(autoScroll);
}

nextArea.addEventListener('click', () => { stopAuto(); moveCarousel('next'); startAuto(); });
prevArea.addEventListener('click', () => { stopAuto(); moveCarousel('prev'); startAuto(); });

startAuto();

window.addEventListener('resize', () => {
  slideWidth = getSlideWidth();
  slidesContainer.style.transition = 'none';
  slidesContainer.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
});

// ================= MÚSICA =================
const music = document.getElementById('bg-music');
const musicBtn = document.getElementById('music-toggle');
const icon = musicBtn.querySelector('img');

let isPlaying = false;

function setPlay() {
  icon.src = 'assets/graphics/play.svg';
}

function setPause() {
  icon.src = 'assets/graphics/pause.svg';
}

// Autoplay después de la animación inicial
logo.addEventListener('animationend', () => {
  music.play().then(() => {
    isPlaying = true;
    setPause();
  }).catch(() => {
    setPlay();
  });
});

// Click manual
musicBtn.addEventListener('click', () => {
  if (isPlaying) {
    music.pause();
    setPlay();
  } else {
    music.play();
    setPause();
  }
  isPlaying = !isPlaying;
});


