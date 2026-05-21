const WHATSAPP_NUMBER = '5561986790532';

// ===== ORDER STATE =====
let order = {};

function addFlavor(flavor) {
  order[flavor] = (order[flavor] || 0) + 1;
  renderOrder();
  showToast(`${flavor} adicionado! 🍫`);
}

function removeFlavor(flavor) {
  delete order[flavor];
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
    list.innerHTML = '<li class="empty-msg">Nenhum item adicionado ainda.<br/>Clique em "+ Adicionar" nos sabores acima.</li>';
    clearBtn.style.display = 'none';
    return;
  }

  clearBtn.style.display = 'inline-block';
  list.innerHTML = items.map(([flavor, qty]) => `
    <li class="order-item">
      <span>${qty}× ${flavor}</span>
      <button onclick="removeFlavor('${flavor.replace(/'/g, "\\'")}')" title="Remover">✕</button>
    </li>
  `).join('');
}

// ===== WHATSAPP =====
function sendWhatsApp() {
  const name  = document.getElementById('customer-name').value.trim();
  const obs   = document.getElementById('obs').value.trim();
  const items = Object.entries(order);

  let message = 'Olá, Brownie Caiçara! 🍫🌴 Gostaria de fazer um pedido:\n\n';

  if (name) message += `*Nome:* ${name}\n\n`;

  if (items.length > 0) {
    message += '*Pedido:*\n';
    items.forEach(([flavor, qty]) => { message += `• ${qty}× ${flavor}\n`; });
  } else {
    message += 'Gostaria de saber mais sobre os sabores e preços disponíveis.\n';
  }

  if (obs) message += `\n*Observações:* ${obs}`;

  message += '\n\nPoderia me passar mais detalhes sobre entrega e pagamento? 😊';

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

function toggleNav() {
  document.body.classList.toggle('nav-open');
}
function closeNav() {
  document.body.classList.remove('nav-open');
}

// ===== SCROLL REVEAL =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ===== CARD PULSE ON ADD =====
document.querySelectorAll('.add-to-order').forEach(btn => {
  btn.addEventListener('click', () => {
    const card = btn.closest('.flavor-card');
    card.style.outline = '3px solid var(--caramel)';
    setTimeout(() => { card.style.outline = ''; }, 500);
  });
});
