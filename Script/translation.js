function getNestedValue(obj, path) {
  return path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined) ? acc[key] : null, obj);
}

// Alterna o idioma da página utilizando o objeto `translations` carregado via texts.js
function changeLanguage(lang) {
  if (typeof translations === 'undefined' || !translations[lang]) return;

  const elements = document.querySelectorAll('[data-i18n]');

  elements.forEach(element => {
    const key = element.getAttribute('data-i18n');
    const text = getNestedValue(translations[lang], key);

    if (text) {
      if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        element.placeholder = text;
      } else {
        element.innerHTML = text;
      }
    }
  });
 
  localStorage.setItem('selectedLanguage', lang);
  updateActiveButton(lang);
}

// Destaca o botão do idioma ativo
function updateActiveButton(lang) {
  const btnPt = document.querySelector('.language-brazil');
  const btnEn = document.querySelector('.language-eua');

  if (btnPt && btnEn) {
    btnPt.classList.toggle('active', lang === 'pt');
    btnEn.classList.toggle('active', lang === 'en');
  }
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  const savedLanguage = localStorage.getItem('selectedLanguage') || 'pt';
  changeLanguage(savedLanguage);

  const btnPt = document.querySelector('.language-brazil');
  const btnEn = document.querySelector('.language-eua');

  if (btnPt) btnPt.addEventListener('click', () => changeLanguage('pt'));
  if (btnEn) btnEn.addEventListener('click', () => changeLanguage('en'));
});