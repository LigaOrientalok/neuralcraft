// Función serverless de Vercel: proxy a OpenAI manteniendo la API key en el servidor.
const SITE = 'neuralcraft-green.vercel.app';

const SYSTEM_PROMPT = `Eres el asistente IA del portafolio de Nicolás (NeuralCraft). Respondé SIEMPRE en el idioma del usuario (español o inglés). Sé breve, directo y amigable, con tono cercano. Usá esta información como base de conocimiento:

PERFIL
- Nombre: Nicolás, desarrollador Full-Stack de Uruguay.
- Stack: Vue 3, Next.js, TypeScript, Tailwind CSS, Supabase (PostgreSQL), Neon, Edge Functions, Stripe, Mercado Pago, Pusher, PWA, Server Actions, React Query.
- Flujo de trabajo: integra IA (ChatGPT, Claude, Cursor) en todo el desarrollo.
- Contacto: WhatsApp 598 97 844 136, GitHub: LigaOrientalok, portafolio: neuralcraft-green.vercel.app.

PROYECTOS EN PRODUCCIÓN
1. FutbolPro Uruguay: comunidad de fútbol amateur (Next.js 16, React 19, TypeScript, Neon/PostgreSQL, Tailwind, Stripe, Pusher). Perfiles, búsqueda de jugadores por posición y ubicación, desafíos entre equipos, feed con likes y comentarios, chat en tiempo real, premium con Stripe y panel admin. URL: futbolprouruguay.vercel.app
2. Liga Oriental: gestión de torneos de fútbol (Vue 3, Supabase, Mercado Pago, PWA). Fixture, tabla de posiciones, ranking de jugadores, estadísticas en vivo, pagos con Mercado Pago (Edge Functions + Webhook), galería multimedia, chat en tiempo real y notificaciones push. URL: liga-oriental-vue.vercel.app
3. Anime Oriental: plataforma de streaming de anime (Vue 3, Supabase, Pinia). Catálogo con filtros por género/año/estado/popularidad, reproductor con control de velocidad y fullscreen, roles Admin (CRUD) y Usuario (historial, favoritos), dark mode. URL: anime-oriental.vercel.app
4. StackSight: visualizador de stack tech con exportación a PNG (Vue 3, html2canvas). 37 tecnologías en 5 categorías y 5 temas de color. URL: stack-sight-one.vercel.app

SERVICIOS Y PRECIOS (precios de referencia, a confirmar por WhatsApp)
- Landing Pages: desde USD 150.
- Apps Web (auth, base de datos, pagos, panel admin): desde USD 600.
- PWA instalable (modo offline, notificaciones push): desde USD 800.
- Integraciones IA (chatbots, asistentes, automatización): desde USD 300.
- Contacto para contratar: WhatsApp 598 97 844 136.

REGLAS
- Si te preguntan algo que no sabés o no está en esta base, ofrecé que escriban por WhatsApp al 598 97 844 136.
- No inventes proyectos, precios, clientes ni datos.
- No respondas preguntas fuera del contexto del portafolio de Nicolás; derivá a contacto.`;

module.exports = async function handler(req, res) {
  // Solo POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Método no permitido' });
  }

  // Bloqueo básico de abuso por Origin
  const origin = req.headers.origin || '';
  if (origin && !origin.includes(SITE) && !origin.includes('localhost') && !origin.includes('127.0.0.1')) {
    return res.status(403).json({ error: 'Origen no permitido' });
  }

  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    return res.status(500).json({ error: 'API key no configurada' });
  }

  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
  } catch (e) {
    return res.status(400).json({ error: 'JSON inválido' });
  }

  const raw = Array.isArray(body.messages) ? body.messages : [];
  if (raw.length === 0 || raw.length > 20) {
    return res.status(400).json({ error: 'Mensajes inválidos' });
  }

  // Sanitizar y acotar el historial
  const messages = raw
    .filter(m => m && typeof m.content === 'string')
    .slice(-12)
    .map(m => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: m.content.slice(0, 2000)
    }));

  try {
    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + key
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
        max_tokens: 400,
        temperature: 0.6
      })
    });

    if (!resp.ok) {
      const detail = await resp.text();
      return res.status(502).json({ error: 'OpenAI error', detail: detail.slice(0, 500) });
    }

    const data = await resp.json();
    const reply = data.choices && data.choices[0] && data.choices[0].message
      ? data.choices[0].message.content
      : '';

    if (!reply) {
      return res.status(502).json({ error: 'Respuesta vacía de OpenAI' });
    }

    return res.json({ reply });
  } catch (err) {
    return res.status(500).json({ error: 'Error interno del asistente' });
  }
};
