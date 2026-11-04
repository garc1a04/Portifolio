(() => {
    const carousel = document.querySelector('#projectCarousel');
    if (!carousel) return;

    const viewport = carousel.querySelector('.project-carousel__viewport');
    const track = carousel.querySelector('.project-carousel__track');
    const cards = [...carousel.querySelectorAll('.project-card')];
    let activeIndex = 0;

    function showCard(index) {
        activeIndex = (index + cards.length) % cards.length;

        cards.forEach((card, cardIndex) => {
            card.classList.toggle('is-active', cardIndex === activeIndex);
        });

        const activeCard = cards[activeIndex];
        const offset = viewport.clientWidth / 2
            - activeCard.offsetLeft
            - activeCard.offsetWidth / 2;

        track.style.transform = `translateX(${offset}px)`;
    }

    carousel.querySelector('[data-project-prev]')
        .addEventListener('click', () => showCard(activeIndex - 1));

    carousel.querySelector('[data-project-next]')
        .addEventListener('click', () => showCard(activeIndex + 1));

    window.addEventListener('resize', () => showCard(activeIndex));

    showCard(0);
})();