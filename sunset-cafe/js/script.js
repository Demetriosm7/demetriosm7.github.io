//Script for Header Hamburger Button
const hamburgerButton = document.querySelector('#hamburgerButton');
const body = document.querySelector('body');
const header = document.querySelector('.header');
const overlay = document.querySelector('.overlay');
const fadeElements = document.querySelectorAll('.has-fade');

hamburgerButton.addEventListener('click', function(){
    console.log('click hamburger');   
    
    if(header.classList.contains('open')){ // Close Hamburger Menu.
        body.classList.remove('noscroll');
        header.classList.remove('open');
        fadeElements.forEach(function(element){
            element.classList.remove('fade-in');
            element.classList.add('fade-out');
        });
    }
    else { // Open Hamburger Menu
        body.classList.add('noscroll');
        header.classList.add('open');
        fadeElements.forEach(function(element){
            element.classList.remove('fade-out');
            element.classList.add('fade-in');
        });
    }
});