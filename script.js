// service page interactivity

document.addEventListener('DOMContentLoaded', () => {
  const servicesInfo = {
    'MacBook Repair': 'We repair MacBooks including screen, battery, keyboard and more. All work comes with a 30-day warranty.',
    'Windows Laptop Repair': 'Expert Windows laptop troubleshooting, driver installs, and component replacement.',
    'Motherboard Repair': 'Diagnostic and repair of motherboard issues, including solder-level fixes.',
    'Data Recovery': 'Recover lost files from hard drives, SSDs, and USB flash drives using safe techniques.',
    'OS Installation': 'Clean installation of macOS, Windows or Linux along with driver setup and updates.'
  };

  const detailBox = document.getElementById('serviceDetails');
  document.querySelectorAll('#servicesContainer .card').forEach(card => {
    card.addEventListener('click', () => {
      const name = card.dataset.service;
      const desc = servicesInfo[name] || 'More information will be added soon.';
      detailBox.innerHTML = `<h3>${name}</h3><p>${desc}</p>`;
    });
  });

  const form = document.getElementById('requestForm');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const status = document.getElementById('formStatus');
      if (!form.name.value.trim() || !form.email.value.trim()) {
        status.style.color = 'red';
        status.textContent = 'Please fill in your name and email.';
        return;
      }
      status.style.color = 'green';
      status.textContent = 'Thank you! Your request has been received.';
      form.reset();
    });
  }
});
