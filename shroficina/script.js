const WHATSAPP_NUMBER = '5513974071034';

let order = {};

function addServico(servico) {
  order[servico] = 1;
  renderOrder();
  showToast(`${servico} selecionado! 🔧`);
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

function sendWhatsApp() {
  const name    = document.getElementById('customer-name').value.trim();
  const veiculo = document.getElementById('veiculo-info').value.trim();
  const obs     = document.getElementById('obs').value.trim();
  const items   = Object.entries(order);

  let message = 'Olá, SHR Oficina! 🔧 Gostaria de solicitar um orçamento:\n\n';

  if (name)    message += `*Nome:* ${name}\n`;
  if (veiculo) message += `*Veículo:* ${veiculo}\n`;
  if (name || veiculo) message += '\n';

  if (items.length > 0) {
    message += '*Serviço(s) de interesse:*\n';
    items.forEach(([servico]) => { message += `• ${servico}\n`; });
  } else {
    message += 'Gostaria de informações sobre os serviços disponíveis.\n';
  }

  if (obs) message += `\n*Problema / Observações:* ${obs}`;

  message += '\n\nPoderia me passar mais detalhes e disponibilidade? 😊';

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
    card.style.outline = '3px solid #ff6600';
    setTimeout(() => { card.style.outline = ''; }, 500);
  });
});
