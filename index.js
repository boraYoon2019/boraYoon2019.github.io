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