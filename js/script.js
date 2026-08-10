/* ===== Theme Toggle ===== */
const html = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');
const savedTheme = localStorage.getItem('theme');
const validThemes = ['dark', 'light'];
const themeValue = validThemes.includes(savedTheme) ? savedTheme : 'dark';

html.setAttribute('data-theme', themeValue);
themeToggle.textContent = savedTheme === 'dark' ? '🌙' : '☀️';

themeToggle.addEventListener('click', () => {
  const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  themeToggle.textContent = next === 'dark' ? '🌙' : '☀️';
  localStorage.setItem('theme', next);
});

/* ===== Particles Background ===== */
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let W, H;

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

const particles = [];
const PARTICLE_COUNT = 100;
const PARTICLE_COLOR_LIGHT = 'rgba(124,58,237,0.3)';
const PARTICLE_COLOR_DARK = 'rgba(124,58,237,0.5)';

class Particle {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.r = Math.random() * 2 + 1;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > W) this.vx *= -1;
    if (this.y < 0 || this.y > H) this.vy *= -1;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    const isLight = html.getAttribute('data-theme') === 'light';
    ctx.fillStyle = isLight ? PARTICLE_COLOR_LIGHT : PARTICLE_COLOR_DARK;
    ctx.fill();
  }
}

for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

function drawLines() {
  const isLight = html.getAttribute('data-theme') === 'light';
  const baseAlpha = isLight ? 0.04 : 0.08;
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 150) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(124,58,237,${baseAlpha * (1 - dist / 150)})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => { p.update(); p.draw(); });
  drawLines();
  requestAnimationFrame(animate);
}
animate();

/* ===== Mouse parallax glow ===== */
const glow = document.createElement('div');
glow.className = 'parallax-glow';
document.body.prepend(glow);

document.addEventListener('mousemove', e => {
  const x = (e.clientX / window.innerWidth) * 100;
  const y = (e.clientY / window.innerHeight) * 100;
  glow.style.setProperty('--mx', x + '%');
  glow.style.setProperty('--my', y + '%');
});

/* ===== Typewriter Effect ===== */
const typewriterEl = document.querySelector('.typewriter');
const words = ['Nicolás', 'Full-Stack Dev', 'Vue 3 Developer', 'Supabase Builder'];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
let isPaused = false;

function type() {
  if (isPaused) {
    setTimeout(type, 40);
    return;
  }
  const current = words[wordIndex];
  if (!isDeleting) {
    typewriterEl.textContent = current.substring(0, charIndex + 1);
    charIndex++;
    if (charIndex === current.length) {
      isPaused = true;
      setTimeout(() => { isPaused = false; isDeleting = true; }, 2000);
    }
  } else {
    typewriterEl.textContent = current.substring(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
    }
  }
  const speed = isDeleting ? 50 : 100;
  setTimeout(type, speed);
}
type();

/* ===== Scroll Reveal ===== */
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
revealEls.forEach(el => observer.observe(el));

/* ===== Animated Counters ===== */
const statNums = document.querySelectorAll('.stat-num');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = +el.dataset.target;
      let current = 0;
      const step = Math.max(1, Math.floor(target / 40));
      const interval = setInterval(() => {
        current += step;
        if (current >= target) { current = target; clearInterval(interval); }
        el.textContent = current + '+';
      }, 30);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });
statNums.forEach(el => counterObserver.observe(el));

/* ===== Skill Bars Animate ===== */
const fillBars = document.querySelectorAll('.fill');
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.width = entry.target.style.getPropertyValue('--p');
      barObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });
fillBars.forEach(bar => barObserver.observe(bar));

/* ===== Mobile Nav ===== */
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

/* ===== Active Nav Link on Scroll ===== */
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  sections.forEach(section => {
    const top = section.offsetTop - 120;
    const bottom = top + section.offsetHeight;
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav-links a[href="#${id}"]`);
    if (link) {
      link.classList.toggle('active', scrollY >= top && scrollY < bottom);
    }
  });
});

/* ===== Footer Year ===== */
document.getElementById('year').textContent = new Date().getFullYear();

/* ===== GitHub Activity ===== */
(async function loadGitHub() {
  const container = document.getElementById('gh-repos');
  try {
    const res = await fetch('https://api.github.com/users/LigaOrientalok/repos?sort=updated&per_page=4');
    if (!res.ok) throw new Error('GitHub API error');
    const repos = await res.json();

    container.innerHTML = '';
    repos.forEach(repo => {
      const a = document.createElement('a');
      a.href = repo.html_url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.className = 'gh-card';

      const h3 = document.createElement('h3');
      h3.textContent = repo.name;
      const h3Icon = document.createTextNode('\uD83D\uDCE6 ');
      h3.prepend(h3Icon);
      const h3Span = document.createElement('span');
      h3Span.textContent = ' \u00B7 ' + (repo.private ? '\uD83D\uDD12' : '\uD83C\uDF0D');
      h3.appendChild(h3Span);

      const p = document.createElement('p');
      p.textContent = repo.description || 'Sin descripci\u00F3n';

      const footer = document.createElement('div');
      footer.className = 'gh-footer';

      const stars = document.createElement('span');
      stars.textContent = '\u2B50 ' + repo.stargazers_count;
      const forks = document.createElement('span');
      forks.textContent = '\u2382 ' + repo.forks_count;
      footer.appendChild(stars);
      footer.appendChild(forks);

      if (repo.language) {
        const lang = document.createElement('span');
        lang.textContent = '\uD83D\uDD39 ' + repo.language;
        footer.appendChild(lang);
      }

      const date = document.createElement('span');
      date.textContent = '\uD83D\uDD50 ' + new Date(repo.updated_at).toLocaleDateString();
      footer.appendChild(date);

      a.appendChild(h3);
      a.appendChild(p);
      a.appendChild(footer);
      container.appendChild(a);
    });
  } catch (err) {
    container.innerHTML = '<div class="gh-error">No se pudieron cargar los repositorios \uD83D\uDE05</div>';
  }
})();

/* ===== Loading state on demo buttons ===== */
document.querySelectorAll('.card-btn[href*="vercel.app"]').forEach(btn => {
  btn.addEventListener('click', function(e) {
    this.classList.add('loading');
  });
});

/* ===== WhatsApp Contact ===== */
const WHATSAPP_NUMBER = '59897844136';

let currentLang = 'es';
try {
  const savedLang = localStorage.getItem('lang');
  if (savedLang === 'es' || savedLang === 'en') currentLang = savedLang;
} catch (e) { /* localStorage no disponible */ }

const waFloat = document.getElementById('wa-float');
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

function waLink(message) {
  return 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(message);
}

const waHello = { es: 'Hola Nicolás, mi nombre es ', en: 'Hi Nicolás, my name is ' };
const waEmail = { es: 'Mi email: ', en: 'My email: ' };
const waBubble = {
  es: '¡Hola Nicolás! Te contacto desde tu portafolio.',
  en: 'Hi Nicolás! I\'m contacting you from your portfolio.'
};
const waSvc = {
  es: 'Hola Nicolás, me interesa tu servicio de desarrollo web. ¿Hablamos?',
  en: 'Hi Nicolás, I\'m interested in your web development services. Shall we talk?'
};
const MSG = {
  es: { ok: 'Se abrió WhatsApp con tu mensaje. ¡Solo tenés que enviarlo!', err: 'Completá tu nombre y el mensaje.' },
  en: { ok: 'WhatsApp opened with your message. Just hit send!', err: 'Fill in your name and message.' }
};

if (waFloat) {
  waFloat.href = waLink(waBubble[currentLang]);
}

document.querySelectorAll('.svc-wa').forEach(a => {
  a.href = waLink(waSvc[currentLang]);
});

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('cf-name').value.trim();
    const email = document.getElementById('cf-email').value.trim();
    const message = document.getElementById('cf-message').value.trim();

    if (!name || !message) {
      formStatus.textContent = MSG[currentLang].err;
      formStatus.className = 'form-status err';
      return;
    }

    const lines = [waHello[currentLang] + name + '.', '', message];
    if (email) lines.push('', waEmail[currentLang] + email);

    window.open(waLink(lines.join('\n')), '_blank', 'noopener,noreferrer');
    formStatus.textContent = MSG[currentLang].ok;
    formStatus.className = 'form-status ok';
    contactForm.reset();
  });
}

/* ===== Language Toggle ===== */
const langBtn = document.getElementById('lang-toggle');
const I18N = { es: {}, en: {} };

I18N.es = {
  'page-title': 'NeuralCraft — Portafolio de Nicolás · Full-Stack & IA',
  'meta-desc': 'Portafolio de Nicolás — Full-Stack Developer especializado en Vue 3, Next.js, Supabase e IA. Proyectos: Anime Oriental, Liga Oriental, StackSight, FutbolPro Uruguay y TAKI3D.',
  'nav-home': 'Inicio', 'nav-about': 'Sobre mí', 'nav-timeline': 'Trayectoria',
  'nav-services': 'Servicios', 'nav-projects': 'Proyectos', 'nav-skills': 'Skills',
  'nav-ai': 'Stack IA', 'nav-contact': 'Contacto',
  'hero-greeting': 'Hola, soy',
  'hero-tagline': 'Full-Stack Developer · Vue 3 · Next.js · Supabase · Construyendo apps con IA',
  'hero-cta-projects': 'Ver Proyectos', 'hero-cta-contact': 'Contactar', 'hero-cta-cv': 'Descargar CV',
  'about-title': 'Sobre mí',
  'about-p1': 'Soy un desarrollador <strong>Full-Stack</strong> apasionado por construir aplicaciones web modernas con <strong>Vue 3</strong>, <strong>Next.js</strong>, <strong>Supabase</strong> y <strong>Tailwind CSS</strong>. Me encanta transformar ideas en productos funcionales, desde plataformas de streaming hasta sistemas de gestión deportiva.',
  'about-p2': 'Cada proyecto lo construyo integrando <strong>IA</strong> en el flujo de desarrollo — desde generar código con modelos de lenguaje hasta automatizar tareas con agentes. Actualmente explorando <strong>LangChain</strong>, <strong>RAG pipelines</strong> y <strong>fine-tuning</strong> de modelos.',
  'stat-prod': 'Proyectos en Producción', 'stat-apps': 'Apps Desplegadas', 'stat-ai': 'Año Codeando con IA',
  'ach-1': 'Primer deploy en producción', 'ach-2': 'PWA instalable',
  'ach-3': 'Pagos online integrados', 'ach-4': 'Migración a Next.js', 'ach-5': 'Desarrollo asistido por IA',
  'timeline-title': 'Mi Trayectoria',
  'tl1-t': 'Descubrí la programación', 'tl1-d': 'Empecé con HTML, CSS y JavaScript. Mi primer "Hola Mundo" fue el inicio de todo.',
  'tl2-t': 'Primer proyecto con Vue 3', 'tl2-d': 'Descubrí Vue 3 y la Composition API. Ahí supe que el frontend moderno era lo mío.',
  'tl3-t': 'Descubrí Supabase', 'tl3-d': 'Backend sin esfuerzo: auth, base de datos, storage, edge functions. Un antes y un después.',
  'tl4-t': 'Anime Oriental — Primer deploy', 'tl4-d': 'Plataforma de streaming completa con roles, reproductor y dark mode. Mi primer proyecto en producción.',
  'tl5-t': 'Liga Oriental — App compleja', 'tl5-d': 'Gestión deportiva con pagos, PWA, chat en tiempo real, galería y más. Mi proyecto más ambicioso.',
  'tl6-t': 'StackSight', 'tl6-d': 'Visualizador de stack tech con exportación a PNG. Mi primer aporte open source y herramienta pública.',
  'tl7-t': 'FutbolPro Uruguay', 'tl7-d': 'Comunidad de fútbol amateur con chat en tiempo real, desafíos, premium con Stripe y panel admin en Next.js.',
  'tl8-t': 'TAKI3D', 'tl8-d': 'Landing premium para impresión 3D en Uruguay con React 19, Framer Motion y scroll suave. Diseño de alta conversión.',
  'tl9-t': 'Integrando IA al workflow', 'tl9-d': 'Uso intensivo de ChatGPT, Claude y Cursor para acelerar desarrollo. Explorando agentes y RAG.',
  'services-title': 'Servicios', 'services-sub': 'Transformo ideas en productos web listos para producción',
  'svc1-t': 'Landing Pages', 'svc1-d': 'Páginas de alto impacto para promocionar tu negocio, producto o evento.',
  'svc1-f1': 'Diseño responsive y optimizado', 'svc1-f2': 'SEO básico + analytics', 'svc1-p': 'desde USD 150',
  'svc2-t': 'Apps Web', 'svc2-d': 'Aplicaciones completas con auth, base de datos, pagos y panel de administración.',
  'svc2-f1': 'Auth + base de datos + storage', 'svc2-f2': 'Integración de pagos (Stripe / Mercado Pago)', 'svc2-p': 'desde USD 600',
  'svc3-t': 'PWA', 'svc3-d': 'Tu app instalable en el celular con modo offline y notificaciones push.',
  'svc3-f1': 'Instalación desde el navegador', 'svc3-f2': 'Notificaciones push', 'svc3-p': 'desde USD 800',
  'svc4-t': 'Integraciones IA', 'svc4-d': 'Automatización, asistentes y generación de contenido con modelos de lenguaje.',
  'svc4-f1': 'Chatbots y asistentes', 'svc4-f2': 'Automatización de tareas', 'svc4-p': 'desde USD 300',
  'svc-cta': 'Contratar por WhatsApp',
  'projects-title': 'Proyectos Destacados',
  'filter-all': 'Todos', 'filter-streaming': 'Streaming', 'filter-sports': 'Gestión Deportiva',
  'filter-tool': 'Herramienta', 'filter-community': 'Comunidad',
  'filter-landing': 'Landing',
  'p1-tag': 'Streaming', 'p1-title': 'Anime Oriental',
  'p1-desc': 'Plataforma de streaming de anime con catálogo, reproductor de video, autenticación por roles y panel administrador.',
  'p1-f1': '🎞️ Catálogo con filtros (género, año, estado, popularidad)',
  'p1-f2': '▶️ Reproductor con control de velocidad y fullscreen',
  'p1-f3': '👑 Roles: Admin (CRUD) y Usuario (historial, favoritos)',
  'p1-f4': '🌙 Dark mode + responsive mobile-first',
  'p2-tag': 'Gestión Deportiva', 'p2-title': 'Liga Oriental',
  'p2-desc': 'App completa para gestionar torneos de fútbol: fixture, estadísticas en vivo, pagos, galería, chat y más.',
  'p2-f1': '📊 Tabla de posiciones, fixture automático, ranking de jugadores',
  'p2-f2': '💳 Pagos con Mercado Pago (Edge Functions + Webhook)',
  'p2-f3': '📸 Galería multimedia con likes y comentarios',
  'p2-f4': '⚡ Modo live + chat en tiempo real + notificaciones push',
  'p2-f5': '📱 PWA instalable en celular',
  'p3-tag': 'Herramienta', 'p3-title': 'StackSight',
  'p3-desc': 'Visualizador de stack tech: seleccioná tus tecnologías, personalizá la card y exportala como PNG para compartir.',
  'p3-f1': '📦 37 tecnologías en 5 categorías',
  'p3-f2': '🎨 5 temas de color para la card',
  'p3-f3': '📸 Exporta a PNG con html2canvas',
  'p3-f4': '⚡ Hecho con Vue 3 + Composition API',
  'p4-tag': 'Comunidad Deportiva', 'p4-title': 'FutbolPro Uruguay',
  'p4-desc': 'Plataforma para conectar jugadores y equipos de fútbol amateur en Uruguay: perfiles, desafíos, chat en vivo y más.',
  'p4-f1': '👥 Búsqueda de jugadores por posición y ubicación',
  'p4-f2': '⚔️ Desafíos entre equipos, feed con likes y comentarios',
  'p4-f3': '💬 Chat en tiempo real con Pusher',
  'p4-f4': '💳 Premium con Stripe y panel administrador',
  'p4-f5': '⚛️ Server Actions + React Query en Next.js App Router',
  'p5-tag': 'Landing', 'p5-title': 'TAKI3D',
  'p5-desc': 'Landing premium para TAKI3D, servicio profesional de impresión 3D en Uruguay. Animaciones fluidas, carousel y diseño de alta conversión.',
  'p5-f1': '🖨️ Landing premium de impresión 3D en Uruguay',
  'p5-f2': '🎬 Animaciones con Framer Motion + scroll suave con Lenis',
  'p5-f3': '🏄 Carousel de testimonios con Embla',
  'p5-f4': '⚛️ React 19 + TypeScript + Tailwind v4 y UI kit shadcn',
  'test-title': 'Testimonios',
  't1-q': '"Contratamos a Nicolás para la plataforma de la liga y superó todas las expectativas. La app quedó impecable y los pagos funcionaron perfecto desde el primer día."',
  't1-n': 'Organizador · Liga Oriental', 't1-r': 'Cliente deportivo',
  't2-q': '"El catálogo y el reproductor son rapidísimos. Muy prolijo en código y con una comunicación excelente durante todo el proyecto."',
  't2-n': 'Cliente · Anime Oriental', 't2-r': 'Proyecto streaming',
  't3-q': '"Rápido, responsable y con un ojo increíble para el detalle. Lo recomiendo para cualquier proyecto web."',
  't3-n': 'Usuario · StackSight', 't3-r': 'Herramienta pública',
  'blog-title': 'Notas Técnicas', 'blog-sub': 'Aprendizajes y experimentos de mi día a día',
  'b1-tag': 'Vue 3', 'b1-title': 'Composition API en el mundo real',
  'b1-d': 'Cómo organizo composables reutilizables en mis proyectos.',
  'b2-tag': 'Supabase', 'b2-title': 'Realtime sin dolor',
  'b2-d': 'Patrones para chat y actualizaciones en vivo con suscripciones.',
  'b3-tag': 'IA', 'b3-title': 'IA en el flujo de desarrollo',
  'b3-d': 'Cómo uso agentes y RAG para acelerar el desarrollo.',
  'skills-title': 'Tecnologías', 'skills-front': 'Frontend', 'skills-back': 'Backend & DB', 'skills-tools': 'Herramientas',
  'ai-title': 'Stack IA', 'ai-sub': 'Las herramientas que uso para potenciar mi desarrollo con inteligencia artificial',
  'ai1-d': 'Ideación, debugging, code review. Mi copiloto de cabecera para resolver problemas complejos.',
  'ai2-d': 'Análisis profundo, arquitectura de software y refactorización. Ideal para diseño de sistemas.',
  'ai3-d': 'IDE con IA integrada. Autocompletado inteligente y edición contextual sin salir del editor.',
  'ai4-d': 'Autocompletado en tiempo real. Genera funciones completas mientras escribo el nombre.',
  'ai5-d': 'Integración de GPT en apps. Automatización, generación de contenido y asistentes inteligentes.',
  'ai6-d': 'Explorando cadenas de LLM, RAG pipelines y agentes autónomos para proyectos futuros.',
  'gh-title': 'Actividad Reciente', 'gh-sub': 'Mis últimos proyectos en GitHub',
  'contact-title': 'Contacto', 'contact-p': '¿Tienes un proyecto en mente? Hablemos.',
  'cf-name': 'Tu nombre', 'cf-email': 'Tu email (opcional)', 'cf-msg': 'Contame sobre tu proyecto...', 'cf-submit': 'Enviar por WhatsApp',
  'footer-text': 'Hecho con ⚡ Vue y Supabase',
  'wa-tip': '¿Hablamos? Escríbeme ✨',
  'chat-title': 'Asistente NeuralCraft',
  'chat-sub': 'Preguntame sobre proyectos y servicios',
  'chat-welcome': '¡Hola! 👋 Soy el asistente de Nicolás. ¿En qué te ayudo?',
  'chip-1': '¿Qué servicios ofrecés?',
  'chip-2': 'Mostrame tus proyectos',
  'chip-3': '¿Cuánto tarda una landing?',
  'chat-ph': 'Escribí tu pregunta...',
  'chat-err': 'Ups, no pude conectarme con el asistente. Probá de nuevo o escribime por WhatsApp.'
};

I18N.en = {
  'page-title': 'NeuralCraft — Nicolás\'s Portfolio · Full-Stack & AI',
  'meta-desc': 'Nicolás\'s portfolio — Full-Stack Developer specialized in Vue 3, Next.js, Supabase and AI. Projects: Anime Oriental, Liga Oriental, StackSight, FutbolPro Uruguay and TAKI3D.',
  'nav-home': 'Home', 'nav-about': 'About', 'nav-timeline': 'Journey',
  'nav-services': 'Services', 'nav-projects': 'Projects', 'nav-skills': 'Skills',
  'nav-ai': 'AI Stack', 'nav-contact': 'Contact',
  'hero-greeting': 'Hi, I\'m',
  'hero-tagline': 'Full-Stack Developer · Vue 3 · Next.js · Supabase · Building apps with AI',
  'hero-cta-projects': 'View Projects', 'hero-cta-contact': 'Contact', 'hero-cta-cv': 'Download CV',
  'about-title': 'About me',
  'about-p1': 'I\'m a <strong>Full-Stack</strong> developer passionate about building modern web apps with <strong>Vue 3</strong>, <strong>Next.js</strong>, <strong>Supabase</strong> and <strong>Tailwind CSS</strong>. I love turning ideas into working products, from streaming platforms to sports management systems.',
  'about-p2': 'I build every project integrating <strong>AI</strong> into the workflow — from generating code with language models to automating tasks with agents. Currently exploring <strong>LangChain</strong>, <strong>RAG pipelines</strong> and model <strong>fine-tuning</strong>.',
  'stat-prod': 'Projects in Production', 'stat-apps': 'Apps Deployed', 'stat-ai': 'Year Coding with AI',
  'ach-1': 'First production deploy', 'ach-2': 'Installable PWA',
  'ach-3': 'Online payments integrated', 'ach-4': 'Next.js migration', 'ach-5': 'AI-assisted development',
  'timeline-title': 'My Journey',
  'tl1-t': 'I discovered programming', 'tl1-d': 'I started with HTML, CSS and JavaScript. My first "Hello World" was the beginning of everything.',
  'tl2-t': 'First Vue 3 project', 'tl2-d': 'I discovered Vue 3 and the Composition API. That\'s when I knew modern frontend was my thing.',
  'tl3-t': 'I discovered Supabase', 'tl3-d': 'Backend without the hassle: auth, database, storage, edge functions. A before and after.',
  'tl4-t': 'Anime Oriental — First deploy', 'tl4-d': 'Complete streaming platform with roles, player and dark mode. My first project in production.',
  'tl5-t': 'Liga Oriental — Complex app', 'tl5-d': 'Sports management with payments, PWA, real-time chat, gallery and more. My most ambitious project.',
  'tl6-t': 'StackSight', 'tl6-d': 'Tech stack visualizer with PNG export. My first open-source project and public tool.',
  'tl7-t': 'FutbolPro Uruguay', 'tl7-d': 'Amateur football community with real-time chat, challenges, Stripe premium and admin panel in Next.js.',
  'tl8-t': 'TAKI3D', 'tl8-d': 'Premium landing page for 3D printing in Uruguay with React 19, Framer Motion and smooth scroll. High-conversion design.',
  'tl9-t': 'Integrating AI into my workflow', 'tl9-d': 'Heavy use of ChatGPT, Claude and Cursor to speed up development. Exploring agents and RAG.',
  'services-title': 'Services', 'services-sub': 'I turn ideas into production-ready web products',
  'svc1-t': 'Landing Pages', 'svc1-d': 'High-impact pages to promote your business, product or event.',
  'svc1-f1': 'Responsive, optimized design', 'svc1-f2': 'Basic SEO + analytics', 'svc1-p': 'from USD 150',
  'svc2-t': 'Web Apps', 'svc2-d': 'Full apps with auth, database, payments and an admin panel.',
  'svc2-f1': 'Auth + database + storage', 'svc2-f2': 'Payment integration (Stripe / Mercado Pago)', 'svc2-p': 'from USD 600',
  'svc3-t': 'PWA', 'svc3-d': 'Your app installable on mobile with offline mode and push notifications.',
  'svc3-f1': 'Install from the browser', 'svc3-f2': 'Push notifications', 'svc3-p': 'from USD 800',
  'svc4-t': 'AI Integrations', 'svc4-d': 'Automation, assistants and content generation with language models.',
  'svc4-f1': 'Chatbots and assistants', 'svc4-f2': 'Task automation', 'svc4-p': 'from USD 300',
  'svc-cta': 'Hire via WhatsApp',
  'projects-title': 'Featured Projects',
  'filter-all': 'All', 'filter-streaming': 'Streaming', 'filter-sports': 'Sports Mgmt',
  'filter-tool': 'Tool', 'filter-community': 'Community',
  'filter-landing': 'Landing',
  'p1-tag': 'Streaming', 'p1-title': 'Anime Oriental',
  'p1-desc': 'Anime streaming platform with catalog, video player, role-based auth and an admin panel.',
  'p1-f1': '🎞️ Catalog with filters (genre, year, status, popularity)',
  'p1-f2': '▶️ Player with speed control and fullscreen',
  'p1-f3': '👑 Roles: Admin (CRUD) and User (history, favorites)',
  'p1-f4': '🌙 Dark mode + mobile-first responsive',
  'p2-tag': 'Sports Management', 'p2-title': 'Liga Oriental',
  'p2-desc': 'Complete app to manage football tournaments: fixtures, live stats, payments, gallery, chat and more.',
  'p2-f1': '📊 Standings, automatic fixture, player rankings',
  'p2-f2': '💳 Payments with Mercado Pago (Edge Functions + Webhook)',
  'p2-f3': '📸 Media gallery with likes and comments',
  'p2-f4': '⚡ Live mode + real-time chat + push notifications',
  'p2-f5': '📱 Installable mobile PWA',
  'p3-tag': 'Tool', 'p3-title': 'StackSight',
  'p3-desc': 'Tech stack visualizer: pick your technologies, customize the card and export it as PNG to share.',
  'p3-f1': '📦 37 technologies in 5 categories',
  'p3-f2': '🎨 5 color themes for the card',
  'p3-f3': '📸 PNG export with html2canvas',
  'p3-f4': '⚡ Built with Vue 3 + Composition API',
  'p4-tag': 'Sports Community', 'p4-title': 'FutbolPro Uruguay',
  'p4-desc': 'Platform to connect amateur football players and teams in Uruguay: profiles, challenges, live chat and more.',
  'p4-f1': '👥 Player search by position and location',
  'p4-f2': '⚔️ Team challenges, feed with likes and comments',
  'p4-f3': '💬 Real-time chat with Pusher',
  'p4-f4': '💳 Stripe premium and admin panel',
  'p4-f5': '⚛️ Server Actions + React Query in Next.js',
  'p5-tag': 'Landing', 'p5-title': 'TAKI3D',
  'p5-desc': 'Premium landing page for TAKI3D, a professional 3D printing service in Uruguay. Smooth animations, carousel and high-conversion design.',
  'p5-f1': '🖨️ Premium 3D printing landing page in Uruguay',
  'p5-f2': '🎬 Animations with Framer Motion + smooth scroll with Lenis',
  'p5-f3': '🏄 Testimonial carousel with Embla',
  'p5-f4': '⚛️ React 19 + TypeScript + Tailwind v4 and shadcn UI kit',
  'test-title': 'Testimonials',
  't1-q': '"We hired Nicolás for the league platform and he exceeded all expectations. The app came out flawless and payments worked perfectly from day one."',
  't1-n': 'Organizer · Liga Oriental', 't1-r': 'Sports client',
  't2-q': '"The catalog and the player are lightning fast. Very clean code and excellent communication throughout the project."',
  't2-n': 'Client · Anime Oriental', 't2-r': 'Streaming project',
  't3-q': '"Fast, reliable and with an amazing eye for detail. I recommend him for any web project."',
  't3-n': 'User · StackSight', 't3-r': 'Public tool',
  'blog-title': 'Tech Notes', 'blog-sub': 'Learnings and experiments from my day to day',
  'b1-tag': 'Vue 3', 'b1-title': 'Composition API in the real world',
  'b1-d': 'How I organize reusable composables in my projects.',
  'b2-tag': 'Supabase', 'b2-title': 'Realtime without the pain',
  'b2-d': 'Patterns for chat and live updates with subscriptions.',
  'b3-tag': 'AI', 'b3-title': 'AI in the dev workflow',
  'b3-d': 'How I use agents and RAG to speed up development.',
  'skills-title': 'Technologies', 'skills-front': 'Frontend', 'skills-back': 'Backend & DB', 'skills-tools': 'Tools',
  'ai-title': 'AI Stack', 'ai-sub': 'The tools I use to supercharge my development with artificial intelligence',
  'ai1-d': 'Ideation, debugging, code review. My go-to copilot for solving complex problems.',
  'ai2-d': 'Deep analysis, software architecture and refactoring. Ideal for system design.',
  'ai3-d': 'IDE with built-in AI. Smart autocomplete and contextual editing without leaving the editor.',
  'ai4-d': 'Real-time autocomplete. Generates full functions while I type the name.',
  'ai5-d': 'GPT integration in apps. Automation, content generation and smart assistants.',
  'ai6-d': 'Exploring LLM chains, RAG pipelines and autonomous agents for future projects.',
  'gh-title': 'Recent Activity', 'gh-sub': 'My latest GitHub projects',
  'contact-title': 'Contact', 'contact-p': 'Have a project in mind? Let\'s talk.',
  'cf-name': 'Your name', 'cf-email': 'Your email (optional)', 'cf-msg': 'Tell me about your project...', 'cf-submit': 'Send via WhatsApp',
  'footer-text': 'Built with ⚡ Vue and Supabase',
  'wa-tip': 'Want to talk? Message me ✨',
  'chat-title': 'NeuralCraft Assistant',
  'chat-sub': 'Ask me about projects and services',
  'chat-welcome': 'Hi! 👋 I\'m Nicolás\'s assistant. How can I help you?',
  'chip-1': 'What services do you offer?',
  'chip-2': 'Show me your projects',
  'chip-3': 'How long does a landing take?',
  'chat-ph': 'Type your question...',
  'chat-err': 'Oops, I couldn\'t reach the assistant. Try again or message me on WhatsApp.'
};

// Valores de los diccionarios son strings estáticos propios (sin input de usuario).
function applyLang(lang) {
  currentLang = lang;
  document.documentElement.setAttribute('lang', lang);
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const val = I18N[lang][key];
    if (val !== undefined) el.innerHTML = val;
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    const val = I18N[lang][key];
    if (val !== undefined) el.setAttribute('placeholder', val);
  });
  document.title = I18N[lang]['page-title'];
  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.setAttribute('content', I18N[lang]['meta-desc']);
  if (waFloat) waFloat.href = waLink(waBubble[lang]);
  document.querySelectorAll('.svc-wa').forEach(a => { a.href = waLink(waSvc[lang]); });
  langBtn.textContent = lang === 'es' ? 'EN' : 'ES';
  langBtn.setAttribute('aria-label', lang === 'es' ? 'Cambiar a inglés' : 'Switch to Spanish');
  localStorage.setItem('lang', lang);
}

langBtn.addEventListener('click', () => applyLang(currentLang === 'es' ? 'en' : 'es'));
applyLang(currentLang);

/* ===== Project Filter ===== */
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    projectCards.forEach(card => {
      const show = f === 'all' || card.dataset.category === f;
      card.classList.toggle('hidden', !show);
      if (show) card.classList.add('visible');
    });
  });
});

/* ===== Lazy image fallback ===== */
document.querySelectorAll('.card-shot, .gh-chart-img').forEach(img => {
  img.addEventListener('error', () => { img.style.display = 'none'; });
});

/* ===== AI Chat ===== */
const chatBtn = document.getElementById('ai-chat-btn');
const chatPanel = document.getElementById('ai-chat');
const chatClose = document.getElementById('ai-chat-close');
const chatBody = document.getElementById('ai-chat-body');
const chatForm = document.getElementById('ai-chat-form');
const chatInput = document.getElementById('ai-chat-input');
const chatChips = document.querySelectorAll('.ai-chip');
const chatHistory = [];

function chatToggle(open) {
  chatPanel.classList.toggle('open', open);
  chatBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  chatPanel.setAttribute('aria-hidden', open ? 'false' : 'true');
}

if (chatBtn && chatPanel) {
  chatBtn.addEventListener('click', () => chatToggle(!chatPanel.classList.contains('open')));
  chatClose.addEventListener('click', () => chatToggle(false));
}

function addMsg(role, text) {
  const div = document.createElement('div');
  div.className = 'ai-msg ' + (role === 'user' ? 'ai-user' : 'ai-bot');
  div.textContent = text;
  chatBody.appendChild(div);
  chatBody.scrollTop = chatBody.scrollHeight;
}

function showTyping() {
  const div = document.createElement('div');
  div.className = 'ai-msg ai-bot';
  div.innerHTML = '<span class="ai-dots"><span></span><span></span><span></span></span>';
  chatBody.appendChild(div);
  chatBody.scrollTop = chatBody.scrollHeight;
  return div;
}

async function ask(question) {
  addMsg('user', question);
  chatHistory.push({ role: 'user', content: question });
  const typing = showTyping();

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [
          { role: 'user', content: 'Conversation language: ' + currentLang.toUpperCase() },
          ...chatHistory
        ]
      })
    });
    if (!res.ok) throw new Error('chat request failed');
    const data = await res.json();
    typing.remove();
    addMsg('bot', data.reply);
    chatHistory.push({ role: 'assistant', content: data.reply });
  } catch (err) {
    typing.remove();
    addMsg('bot', I18N[currentLang]['chat-err']);
  }
}

if (chatForm) {
  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = chatInput.value.trim();
    if (!q) return;
    chatInput.value = '';
    ask(q);
  });
}

chatChips.forEach(chip => {
  chip.addEventListener('click', () => {
    ask(chip.textContent.trim());
  });
});
