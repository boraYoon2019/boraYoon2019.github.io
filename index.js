'use strict';

const highlightNavMenu = () => {  
  let scroll_pos = window.pageYOffset;
  const sidebar_items = document.querySelectorAll('.sidebar__item');

  sidebar_items.forEach((item, index) => {
    const sections = document.querySelectorAll('.content__main > article')
    const activeSection = sections[index];

    const compare = activeSection.offsetTop+100 <= scroll_pos && 
    (activeSection.offsetTop+50 + activeSection.offsetHeight+50 > scroll_pos);
        
    if(scroll_pos > 100) {
      compare ? item.classList.add('sidebar__item--active') : item.classList.remove('sidebar__item--active')  
    }
  });
}

window.addEventListener('scroll', highlightNavMenu);

// 사이드바 > 이벤트 위임
const sidebar_anchor = document.querySelector('.sidebar__menu');
sidebar_anchor.addEventListener('click', addScrollFunction);

function addScrollFunction (event) {  
  event.preventDefault();
  const target = event.target;
  const dataset = target.dataset;

  const target_section = document.querySelector(`#${dataset.target}`);
  target_section.scrollIntoView({behavior: 'smooth'});
}
  const body = document.querySelector('body');
 // Get the modal
 const modal = document.getElementById('project-modal');
 
 // 이벤트 위임
 const projects__item = document.querySelector('#projects');

 // Get the <span> element that closes the modal
 const span = document.getElementsByClassName("close")[0];                                          

 // When the user clicks on the button, open the modal 


// 사이드바 > 이벤트 위임
projects__item.addEventListener('click', onProjectItemClick);

// When the user clicks on the projects__item, open the modal
function onProjectItemClick (event) {
  modal.style.display = "block";
  body.classList.add('modal-active');
}

 // When the user clicks on <span> (x), close the modal
 span.onclick = function() {
     modal.style.display = "none";
     body.classList.remove('modal-active');
 }

 // When the user clicks anywhere outside of the modal, close it
 window.onclick = function(event) {
     if (event.target == modal) {
         modal.style.display = "none";
         body.classList.remove('modal-active');
     }
 }
