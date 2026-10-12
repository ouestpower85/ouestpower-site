const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
if (menuButton && nav) {
  menuButton.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.textContent = isOpen ? '×' : '☰';
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.textContent = '☰';
  }));
}
document.getElementById('year').textContent = new Date().getFullYear();

const form = document.getElementById('vehicle-form');
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const message = [
    'Bonjour Ouestpower, je souhaite un devis pour mon véhicule.',
    '',
    'Marque : ' + (data.get('marque') || 'Non renseignée'),
    'Modèle : ' + (data.get('modele') || 'Non renseigné'),
    'Motorisation / année : ' + (data.get('motorisation') || 'Non renseignée'),
    'Type de moteur : ' + (data.get('moteur') || 'Non renseigné'),
    'Prestation : ' + (data.get('prestation') || 'Non renseignée')
  ].join('\n');
  const url = 'https://www.instagram.com/ouestpower/';
  const msg = document.getElementById('form-message');
  msg.textContent = 'Votre demande est préparée. Copiez les informations ci-dessous puis envoyez-les à Ouestpower sur Instagram : ' + message;
  const copyButton = document.createElement('button');
  copyButton.type = 'button';
  copyButton.className = 'button secondary';
  copyButton.textContent = 'Copier la demande';
  copyButton.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(message);
      msg.textContent = 'Demande copiée. Vous pouvez maintenant l’envoyer à Ouestpower sur Instagram.';
      window.open(url, '_blank', 'noopener');
    } catch {
      msg.textContent = message + '\n\nOuvrez Instagram pour envoyer votre demande.';
    }
  });
  const old = document.getElementById('copy-request');
  if (old) old.remove();
  copyButton.id = 'copy-request';
  msg.insertAdjacentElement('afterend', copyButton);
});
