let navbar = document.querySelector(".fixed");
let hidden = document.querySelectorAll(".hidden");

const observer = new IntersectionObserver((entries) => {

    entries.forEach((entry) => {
        
        if(entry.isIntersecting){
            entry.target.classList.add("show");
            return;
        }

        entry.target.classList.remove("show");
    });

});

hidden.forEach((el) => observer.observe(el));

let altura = window.scrollY;
if(altura != 0) {
    navbar.classList.add("fixed_list");
}

window.onscroll = () => {
    let altura = window.scrollY;

    if(altura == 0) {
        navbar.classList.remove("fixed_list");
        return;
    }

    navbar.classList.add("fixed_list")
};

new JParticles.Particle('#demo', {
    range: 1.5,
    num: 0.25,
    minSpeed: 0.1,
    maxSpeed: 0.3,
    minR: 1.3,
    maxR: 1.5,
    color: ['#FFFFFF', '#7A00FF','#FF0057','#FF00FF']
});
