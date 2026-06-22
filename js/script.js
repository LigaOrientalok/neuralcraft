/* ===== Theme Toggle ===== */
const html = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');
const savedTheme = localStorage.getItem('theme') || 'dark';

html.setAttribute('data-theme', savedTheme);
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

    container.innerHTML = repos.map(repo => `
      <a href="${repo.html_url}" target="_blank" class="gh-card">
        <h3>📦 ${repo.name} <span>· ${repo.private ? '🔒' : '🌍'}</span></h3>
        <p>${repo.description || 'Sin descripción'}</p>
        <div class="gh-footer">
          <span>⭐ ${repo.stargazers_count}</span>
          <span>⑂ ${repo.forks_count}</span>
          ${repo.language ? `<span>🔹 ${repo.language}</span>` : ''}
          <span>🕐 ${new Date(repo.updated_at).toLocaleDateString()}</span>
        </div>
      </a>
    `).join('');
  } catch (err) {
    container.innerHTML = `<div class="gh-error">No se pudieron cargar los repositorios 😅</div>`;
  }
})();

/* ===== Loading state on demo buttons ===== */
document.querySelectorAll('.card-btn[href*="vercel.app"]').forEach(btn => {
  btn.addEventListener('click', function(e) {
    this.classList.add('loading');
  });
});
