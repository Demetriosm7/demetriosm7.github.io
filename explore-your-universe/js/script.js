document.addEventListener("DOMContentLoaded", () =>{
    const observer = new IntersectionObserver(entries => {
        document.querySelector(".bar").classList.toggle("bar--bg", entries[0].intersectionRatio < 0.9);
    }, {
        threshold: 0.9
    });

    observer.observe(document.querySelector(".header"));
});