/* ================================================================
   RENDER: populate DOM from SITE_CONFIG
   ================================================================ */
function render() {
  const { name: n } = SITE_CONFIG;

  // name
  const _dn = n.display ?? n.first;
  document.getElementById('hero-name').innerHTML =
    `<span class="n1">${_dn.slice(0,-1)}</span><span class="n2">${_dn.slice(-1)}.</span>`;

  // tagline
  const _tItems = SITE_CONFIG.tagline
    .map(t => `<span>${t}</span>`)
    .join('<span class="separator" aria-hidden="true">·</span>');
  document.getElementById('hero-tagline').innerHTML =
    `<span class="caret">&gt;&nbsp;</span>${_tItems}`;

  // links
  const linksEl = document.getElementById('hero-links');
  SITE_CONFIG.links.filter(l => l.visible !== false).forEach(l => {
    const a = document.createElement('a');
    a.className = 'ext-link';
    a.href = l.url;
    a.setAttribute('aria-label', l.label);
    if (l.newTab) { a.target = '_blank'; a.rel = 'noopener noreferrer'; }
    a.textContent = l.label;
    linksEl.appendChild(a);
  });

  // bio
  document.getElementById('hero-bio').innerHTML =
    SITE_CONFIG.bio.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  // footer: github link
  const ghLink = SITE_CONFIG.links.find(l => l.icon === 'github');
  if (ghLink) {
    document.getElementById('proj-footer').innerHTML =
      `<a href="${ghLink.url}" target="_blank" rel="noopener noreferrer"><svg aria-hidden="true"><use href="#i-gh"/></svg>more on github</a>`;
  }

  // skills
  SITE_CONFIG.skills.forEach(sk => {
    const g = document.createElement('div');
    g.className = 'skill-group';
    g.innerHTML =
      `<span class="sg-label">${sk.category}</span>
       <div class="sg-pills">${sk.items.map(i => `<span class="sg-pill">${i}</span>`).join('')}</div>`;
    document.getElementById('skill-groups').appendChild(g);
  });

  // certifications — keep issuer and year visible on touch and keyboard devices
  const certsEl = document.getElementById('certs-section');
  const row = document.createElement('div');
  row.className = 'cert-pills-row';
  SITE_CONFIG.certs.forEach(c => {
    const pill = document.createElement(c.url ? 'a' : 'span');
    pill.className = 'cert-pill';
    pill.textContent = `${c.short} · ${c.issuer} · ${c.year}`;
    if (c.url) {
      pill.href = c.url;
      pill.target = '_blank';
      pill.rel = 'noopener noreferrer';
      pill.setAttribute('aria-label', `Verify ${c.short} certification on Credly`);
    }
    row.appendChild(pill);
  });
  certsEl.appendChild(row);

  // chrome label
  document.getElementById('chrome-label').textContent = `${SITE_CONFIG.handle}:~$`;

  // hide chrome if terminal disabled
  if (!SITE_CONFIG.SHOW_TERMINAL) {
    document.getElementById('card-chrome').style.display = 'none';
  }

  // project list
  SITE_CONFIG.projects.forEach((p, i) => {
    const r = document.createElement('button');
    r.type = 'button';
    r.className = 'proj-row';
    r.setAttribute('aria-label', `View project: ${p.title} — ${p.outcome}`);
    r.setAttribute('aria-controls', 'proj-exp-panel');
    r.setAttribute('aria-expanded', 'false');
    r.onclick = () => showProject(i, r);
    r.innerHTML =
      `<span class="proj-dot"></span>
       <span class="proj-copy">
         <span class="proj-name">${p.title}</span>
         <span class="proj-outcome">${p.outcome}</span>
       </span>
       <span class="proj-stack">${p.tags.slice(0,2).join(' · ')}</span>
       <span class="proj-arr" aria-hidden="true">›</span>`;
    document.getElementById('proj-list').appendChild(r);
  });
}

/* ================================================================
   PROJECT EXPAND
   ================================================================ */
let activeProjectIndex = null;
let activeProjectTrigger = null;

function renderProjectDetail(idx) {
  const p = SITE_CONFIG.projects[idx];
  document.getElementById('exp-title').textContent = p.title;
  document.getElementById('exp-desc').textContent  = p.desc;
  document.getElementById('exp-tags').innerHTML    = p.tags.map(t => `<span>${t}</span>`).join('');
  document.getElementById('exp-link').innerHTML    = p.url
    ? `<a class="proj-exp-link" href="${p.url}" target="_blank" rel="noopener noreferrer">${p.linkLabel ?? 'View Project'} ↗</a>` : '';
}

function showProject(idx, trigger) {
  if (activeProjectTrigger) activeProjectTrigger.setAttribute('aria-expanded', 'false');
  activeProjectIndex = idx;
  activeProjectTrigger = trigger;
  activeProjectTrigger.setAttribute('aria-expanded', 'true');
  renderProjectDetail(idx);
  document.getElementById('proj-list-panel').classList.replace('p-visible','p-hidden');
  document.getElementById('proj-exp-panel').classList.replace('p-hidden','p-visible');
  setTimeout(() => document.getElementById('proj-exp-close-btn').focus(), 50);
}

function showProjList() {
  document.getElementById('proj-exp-panel').classList.replace('p-visible','p-hidden');
  document.getElementById('proj-list-panel').classList.replace('p-hidden','p-visible');
  const trigger = activeProjectTrigger;
  if (trigger) trigger.setAttribute('aria-expanded', 'false');
  activeProjectIndex = null;
  activeProjectTrigger = null;
  requestAnimationFrame(() => trigger?.focus());
}

/* ── CLI TOGGLE ── */
let isTerminal = false;
let _portfolioH = 0;

function snapCardHeight() {
  const card = document.querySelector('.card');
  const termView = document.getElementById('term-view');
  if (window.innerWidth <= 620) {
    card.style.height = 'auto';
    termView.style.height = '';
    return;
  }

  const listPanel = document.getElementById('proj-list-panel');
  const expPanel = document.getElementById('proj-exp-panel');
  const wasExpanded = activeProjectIndex !== null;

  // Start with natural list-view height
  listPanel.classList.replace('p-hidden','p-visible');
  expPanel.classList.replace('p-visible','p-hidden');
  card.style.height = 'auto';
  let maxH = card.getBoundingClientRect().height;

  // Measure each expanded project (synchronous — no repaint between reads)
  SITE_CONFIG.projects.forEach((_, idx) => {
    renderProjectDetail(idx);
    listPanel.classList.replace('p-visible','p-hidden');
    expPanel.classList.replace('p-hidden','p-visible');
    maxH = Math.max(maxH, card.getBoundingClientRect().height);
    expPanel.classList.replace('p-visible','p-hidden');
    listPanel.classList.replace('p-hidden','p-visible');
  });

  if (wasExpanded) {
    renderProjectDetail(activeProjectIndex);
    listPanel.classList.replace('p-visible','p-hidden');
    expPanel.classList.replace('p-hidden','p-visible');
  }

  _portfolioH = maxH;
  card.style.height = _portfolioH + 'px';
  termView.style.height = (_portfolioH - (SITE_CONFIG.SHOW_TERMINAL ? 36 : 0)) + 'px';
}

function toggleView() {
  if (!SITE_CONFIG.SHOW_TERMINAL) return;
  isTerminal = !isTerminal;

  document.getElementById('portfolio-view').classList.toggle('visible', !isTerminal);
  document.getElementById('portfolio-view').classList.toggle('hidden',   isTerminal);
  document.getElementById('term-view').classList.toggle('visible',  isTerminal);
  document.getElementById('term-view').classList.toggle('hidden',   !isTerminal);
  const toggleButton = document.getElementById('view-toggle-btn');
  toggleButton.textContent = isTerminal ? 'portfolio' : 'CLI';
  toggleButton.setAttribute('aria-pressed', String(isTerminal));
  if (isTerminal) setTimeout(() => {
    document.getElementById('term-input').focus();
    scrollTerm();
  }, 80);
}

function initTerminal() {
  if (!SITE_CONFIG.SHOW_TERMINAL) return;
  const h = SITE_CONFIG.handle;
  document.getElementById('term-prompt').textContent = `${h}:~$`;
  const add = (html, color, indent) => {
    const d = document.createElement('div');
    d.className = 'tline';
    if (color)  d.style.color = color;
    if (indent) d.style.paddingLeft = '14px';
    d.innerHTML = html;
    document.getElementById('term-lines').appendChild(d);
  };
  add(`<span style="color:var(--accent);">${h}:~$</span> <span style="color:#666;">whoami</span>`);
  add(`${SITE_CONFIG.name.first} ${SITE_CONFIG.name.last} — Software Engineer · ${SITE_CONFIG.tagline.join(' · ')}`, '#666', true);
  add(`type 'help' for available commands`, '#3a3a3a', true);
  add(`<span style="color:var(--accent);">${h}:~$</span> <span style="color:#444;">_</span>`);
}

function buildCmds() {
  const n = `${SITE_CONFIG.name.first} ${SITE_CONFIG.name.last}`;
  return {
    whoami:   [`${n} — Software Engineer`, SITE_CONFIG.tagline.join(' · ')],
    about:    [SITE_CONFIG.bio.replace(/\*\*/g,''), ...SITE_CONFIG.termAboutExtra],
    skills:   SITE_CONFIG.skills.map(sk => sk.category.toUpperCase().padEnd(12) + sk.items.join(' · ')),
    certs:    SITE_CONFIG.certs.map(c  => `[+] ${c.short.padEnd(12)} ${c.issuer} · ${c.year}`),
    projects: SITE_CONFIG.projects.map(p => `${p.title.padEnd(18)} — ${p.tags.join(' · ')}`),
    contact:  SITE_CONFIG.links.filter(l => l.visible !== false).map(l => `${l.label.padEnd(10)} → ${l.url}`),
    help:     ['CLI — available commands:', '  whoami · about · skills · certs · projects · contact · clear'],
  };
}

function scrollTerm() {
  const b = document.getElementById('term-lines');
  if (b) b.scrollTop = b.scrollHeight;
}

function termCmd(e) {
  if (e.key !== 'Enter') return;
  const inp   = document.getElementById('term-input');
  const lines = document.getElementById('term-lines');
  const cmd   = inp.value.trim().toLowerCase();
  if (!cmd) return;
  inp.value = '';
  if (cmd === 'clear') { lines.innerHTML = ''; return; }
  const h = SITE_CONFIG.handle;
  const echo = document.createElement('div');
  echo.className = 'tline';
  const ps = document.createElement('span');
  ps.style.color = 'var(--accent)';
  ps.textContent = `${h}:~$`;
  const cs = document.createElement('span');
  cs.style.color = '#777';
  cs.textContent = cmd;
  echo.append(ps, ' ', cs);
  lines.appendChild(echo);
  const data = buildCmds()[cmd];
  if (data) {
    data.forEach(r => {
      const d = document.createElement('div');
      d.className = 'tline';
      d.style.paddingLeft = '14px';
      d.style.color = r.startsWith('[+]') ? 'var(--accent)' : r.includes('Full Stack') ? '#aaa' : '#555';
      d.textContent = r;
      lines.appendChild(d);
    });
  } else {
    const d = document.createElement('div');
    d.className = 'tline';
    d.style.cssText = 'padding-left:14px;color:#6a3030;';
    d.textContent = `command not found: ${cmd} — try 'help'`;
    lines.appendChild(d);
  }
  const pr = document.createElement('div');
  pr.className = 'tline';
  pr.innerHTML = `<span style="color:var(--accent);">${h}:~$</span> <span style="color:#333;">_</span>`;
  lines.appendChild(pr);
  scrollTerm();
}
/* ================================================================
   BOOT
   ================================================================ */
document.getElementById('cli-toggle-dots').addEventListener('click', toggleView);
document.getElementById('view-toggle-btn').addEventListener('click', toggleView);
document.getElementById('proj-exp-close-btn').addEventListener('click', showProjList);
document.getElementById('term-input').addEventListener('keydown', termCmd);

render();
initTerminal();
snapCardHeight();

// External font metrics and responsive wrapping can change the natural card height.
document.fonts?.ready.then(snapCardHeight);
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(snapCardHeight, 100);
});
