document.addEventListener('DOMContentLoaded', () => {
    const button = document.querySelector('[data-experiences-toggle]');
    const content = document.querySelector('#moreExperiences');

    if (!button || !content) return;

    const labels = button.querySelectorAll('[data-i18n]');

    button.addEventListener('click', () => {
        const isExpanded = button.getAttribute('aria-expanded') === 'true';

        button.setAttribute('aria-expanded', String(!isExpanded));
        content.hidden = isExpanded;

        labels.forEach(label => {
            label.hidden = !label.hidden;
        });
    });
});