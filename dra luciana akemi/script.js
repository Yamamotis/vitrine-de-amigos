// Substitua pelo número real da Dra. Luciana (só dígitos, com DDI)
// Exemplo: 5511987654321
const WHATSAPP_NUMBER = '5513996435697';

// ===== ORDER STATE =====
let order = {};

function addServico(servico) {
  order[servico] = (order[servico] || 0) + 1;
  renderOrder();
  showToast(`${servico} selecionado! 🦷`);
}

function removeServico(servico) {
  delete order[servico];
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
    list.innerHTML = '<li class="empty-msg">Nenhum serviço selecionado ainda.<br/>Clique em "+ Selecionar" nos cards acima.</li>';
    clearBtn.style.display = 'none';
    return;
  }

  clearBtn.style.display = 'inline-block';
  list.innerHTML = items.map(([servico]) => `
    <li class="order-item">
      <span>${servico}</span>
      <button onclick="removeServico('${servico.replace(/'/g, "\\'")}')" title="Remover">✕</button>
    </li>
  `).join('');
}

// ===== WHATSAPP =====
function sendWhatsApp() {
  const name  = document.getElementById('customer-name').value.trim();
  const phone = document.getElementById('phone-info').value.trim();
  const obs   = document.getElementById('obs').value.trim();
  const items = Object.entries(order);

  let message = 'Olá, Dra. Luciana! 🦷 Gostaria de agendar uma consulta:\n\n';

  if (name)  message += `*Nome:* ${name}\n`;
  if (phone) message += `*Telefone:* ${phone}\n`;
  if (name || phone) message += '\n';

  if (items.length > 0) {
    message += '*Serviço(s) de interesse:*\n';
    items.forEach(([servico]) => { message += `• ${servico}\n`; });
  } else {
    message += 'Gostaria de informações sobre os serviços disponíveis.\n';
  }

  if (obs) message += `\n*Observações:* ${obs}`;

  message += '\n\nPoderia me informar disponibilidade de horários? 😊';

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
    card.style.outline = '3px solid var(--teal)';
    setTimeout(() => { card.style.outline = ''; }, 500);
  });
});
