// Substitua pelo número real do G3 Beach Tennis (só dígitos, com DDI)
// Exemplo: 5511987654321
const WHATSAPP_NUMBER = '5513991016981';

// ===== ORDER STATE =====
let order = {};

function addPlano(plano) {
  order[plano] = (order[plano] || 0) + 1;
  renderOrder();
  showToast(`${plano} selecionado! 🎾`);
}

function removePlano(plano) {
  delete order[plano];
  renderOrder();
}

function clearOrder() {
  order = {};
  renderOrder();
}

function renderOrder() {
  const list     = document.getElementById('order-list');
  const clearBtn = document.getElementById('clear-order');
  const items    = Object.entries(order);

  if (items.length === 0) {
    list.innerHTML = '<li class="empty-msg">Nenhum plano selecionado ainda.<br/>Clique em "+ Selecionar" nos cards acima.</li>';
    clearBtn.style.display = 'none';
    return;
  }

  clearBtn.style.display = 'inline-block';
  list.innerHTML = items.map(([plano]) => `
    <li class="order-item">
      <span>${plano}</span>
      <button onclick="removePlano('${plano.replace(/'/g, "\\'")}')" title="Remover">✕</button>
    </li>
  `).join('');
}

// ===== WHATSAPP =====
function sendWhatsApp() {
  const name  = document.getElementById('customer-name').value.trim();
  const nivel = document.getElementById('nivel-info').value.trim();
  const obs   = document.getElementById('obs').value.trim();
  const items = Object.entries(order);

  let message = 'Olá, G3 Beach Tennis! 🎾 Gostaria de saber mais:\n\n';

  if (name)  message += `*Nome:* ${name}\n`;
  if (nivel) message += `*Nível:* ${nivel}\n`;
  if (name || nivel) message += '\n';

  if (items.length > 0) {
    message += '*Plano(s) de interesse:*\n';
    items.forEach(([plano]) => { message += `• ${plano}\n`; });
  } else {
    message += 'Gostaria de informações sobre os planos disponíveis.\n';
  }

  if (obs) message += `\n*Disponibilidade/Obs:* ${obs}`;

  message += '\n\nPoderia me passar mais detalhes e horários disponíveis? 😊';

  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
}

// ===== TOAST =====
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toast.classList.remove('show'), 2500);
}

// ===== NAV =====
window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 40);
  document.getElementById('fab').classList.toggle('visible', window.scrollY > 300);
});

function toggleNav() { document.body.classList.toggle('nav-open'); }
function closeNav()  { document.body.classList.remove('nav-open'); }

// ===== SCROLL REVEAL =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ===== CARD PULSE ON SELECT =====
document.querySelectorAll('.add-to-order').forEach(btn => {
  btn.addEventListener('click', () => {
    const card = btn.closest('.flavor-card');
    card.style.outline = '3px solid #22cc44';
    setTimeout(() => { card.style.outline = ''; }, 500);
  });
});
