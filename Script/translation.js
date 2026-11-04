(() => {
  let currentLanguage = 'pt';
  let transitionTimer;
  let transitionId = 0;

  function getTranslations() {
    return typeof translations !== 'undefined' ? translations : null;
  }

  function getNestedValue(object, path) {
    return path
      .split('.')
      .reduce((value, key) => value?.[key], object);
  }

  function setTranslatedText(element, text) {
    if (element.matches('input, textarea')) {
      element.placeholder = text;
      return;
    }

    // Mantém os elementos internos traduzíveis, como o nome dentro da saudação.
    if (element.querySelector('[data-i18n]')) {
      const textNodes = [...element.childNodes].filter(
        node => node.nodeType === Node.TEXT_NODE
      );

      const firstTextNode = textNodes[0] || document.createTextNode('');
      firstTextNode.nodeValue = `${text.trimEnd()} `;

      if (textNodes.length === 0) {
        element.insertBefore(firstTextNode, element.firstChild);
      }

      textNodes.slice(1).forEach(node => {
        node.nodeValue = '';
      });

      return;
    }

    element.textContent = text;
  }

  function translateElement(element, lang) {
    if (!(element instanceof Element) || !element.matches('[data-i18n]')) {
      return;
    }

    const languageTranslations = getTranslations()?.[lang];
    if (!languageTranslations) return;

    const text = getNestedValue(languageTranslations, element.dataset.i18n);

    if (text !== null && text !== undefined) {
      setTranslatedText(element, String(text));
    }
  }

  function translateWithin(root, lang) {
    if (!(root instanceof Element)) return;

    translateElement(root, lang);
    root.querySelectorAll('[data-i18n]').forEach(element => {
      translateElement(element, lang);
    });
  }

  function updateActiveButton(lang) {
    document.querySelector('.language-brazil')
      ?.classList.toggle('active', lang === 'pt');

    document.querySelector('.language-eua')
      ?.classList.toggle('active', lang === 'en');
  }

  function applyLanguage(lang) {
    const languageTranslations = getTranslations()?.[lang];
    if (!languageTranslations) return false;

    document.querySelectorAll('[data-i18n]').forEach(element => {
      translateElement(element, lang);
    });

    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';
    currentLanguage = lang;
    updateActiveButton(lang);

    try {
      localStorage.setItem('selectedLanguage', lang);
    } catch {
      // A tradução continua funcionando se o armazenamento estiver indisponível.
    }

    return true;
  }

  function changeLanguage(lang, animate = true) {
    if (!getTranslations()?.[lang]) return;

    clearTimeout(transitionTimer);
    const currentTransitionId = ++transitionId;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (!animate || prefersReducedMotion || lang === currentLanguage) {
      document.body.classList.remove('language-transition');
      applyLanguage(lang);
      return;
    }

    document.body.classList.add('language-transition');

    transitionTimer = window.setTimeout(() => {
      if (currentTransitionId !== transitionId) return;

      applyLanguage(lang);

      requestAnimationFrame(() => {
        if (currentTransitionId === transitionId) {
          document.body.classList.remove('language-transition');
        }
      });
    }, 500);
  }

  function initialize() {
    let savedLanguage = 'pt';

    try {
      savedLanguage = localStorage.getItem('selectedLanguage') || 'pt';
    } catch {
      // Usa português como padrão se o armazenamento estiver indisponível.
    }

    if (!getTranslations()?.[savedLanguage]) {
      savedLanguage = getTranslations()?.pt ? 'pt' : 'en';
    }

    changeLanguage(savedLanguage, false);

    // Delegação de eventos também funciona se os botões forem recriados.
    document.addEventListener('click', event => {
      const button = event.target.closest('[data-lang]');
      if (button) {
        changeLanguage(button.dataset.lang);
      }
    });

    // Traduz textos adicionados ou marcados com data-i18n depois do carregamento.
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.type === 'attributes') {
          translateElement(mutation.target, currentLanguage);
          return;
        }

        mutation.addedNodes.forEach(node => {
          translateWithin(node, currentLanguage);
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['data-i18n']
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize, { once: true });
  } else {
    initialize();
  }
})();