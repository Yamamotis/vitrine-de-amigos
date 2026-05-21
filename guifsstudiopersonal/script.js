// Substitua pelo número real do GuiF's Studio (só dígitos, com DDI)
// Exemplo: 5513987654321
const WHATSAPP_NUMBER = '5513991690440';

let order = {};

function addPlano(plano) {
  order[plano] = 1;
  renderOrder();
  showToast(`${plano} selecionado! 💪`);
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
    list.innerHTML = '<li class="empty-msg">Nenhum plano selecionado ainda.<br/>Clique em "+ Quero começar" acima.</li>';
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

function sendWhatsApp() {
  const name     = document.getElementById('customer-name').value.trim();
  const objetivo = document.getElementById('objetivo-info').value.trim();
  const obs      = document.getElementById('obs').value.trim();
  const items    = Object.entries(order);

  let message = 'Olá, GuiF\'s Studio Personal! 💪 Gostaria de saber mais:\n\n';

  if (name)     message += `*Nome:* ${name}\n`;
  if (objetivo) message += `*Objetivo:* ${objetivo}\n`;
  if (name || objetivo) message += '\n';

  if (items.length > 0) {
    message += '*Interesse:*\n';
    items.forEach(([plano]) => { message += `• ${plano}\n`; });
  } else {
    message += 'Gostaria de informações sobre acompanhamento com personal trainer.\n';
  }

  if (obs) message += `\n*Disponibilidade/Obs:* ${obs}`;

  message += '\n\nPoderia me passar mais detalhes e valores? 😊';

  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toast.classList.remove('show'), 2500);
}

window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 40);
  document.getElementById('fab').classList.toggle('visible', window.scrollY > 300);
});

function toggleNav() { document.body.classList.toggle('nav-open'); }
function closeNav()  { document.body.classList.remove('nav-open'); }

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

document.querySelectorAll('.add-to-order').forEach(btn => {
  btn.addEventListener('click', () => {
    const card = btn.closest('.flavor-card');
    card.style.outline = '3px solid #f5c518';
    setTimeout(() => { card.style.outline = ''; }, 500);
  });
});
