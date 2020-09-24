'use strict';

axios.get('./data.json')
.then((response)=>{
  const data = response.data;
  const projects = data.projects;
  // spread operator from ES6
  // const projects = [...data.projects.web, ...data.projects.app];

  const projectSection = document.querySelector('#projects');

  const projectWeb = projects.web.map((project)=>createProjectItem(project, 'web')).join('');
  const projectApp = projects.app.map((project)=>createProjectItem(project, 'app')).join('');
  
  // projects.map((project)=>console.log(project.img_src));
  projectSection.innerHTML = projectWeb+projectApp;
  
  const contentButton = document.querySelector('.content__button');
  contentButton.classList.add('content__button--active');

  const contentButtons = document.querySelector('.content__btn-group');
  
  sortProject(false);
  contentButtons.addEventListener('click', (event) => sortProject(event));
})
.catch((error) => {
  console.log(error);
});

// 메인 화면 - scroll시 사이드바 스크롤파이 메뉴
window.addEventListener('scroll', highlightNavMenu);

// 사이드바 > 이벤트 위임
const sidebar_anchor = document.querySelector('.sidebar__menu');
sidebar_anchor.addEventListener('click', addScrollFunction);



function sortProject(event) {
  // default값 지정
  let webOrApp = 'WEB';
  event ? webOrApp = event.target.textContent : false;
  const projects = document.querySelectorAll('.projects__item');

  if (webOrApp==='WEB') {
    projects.forEach((project)=> {
    project.classList.contains('web') ? 
    project.classList.remove('invisible') : project.classList.add('invisible');
    });

  } else if (webOrApp==='APP') {

    projects.forEach((project)=> {
      project.classList.contains('app') ?
       project.classList.remove('invisible') : project.classList.add('invisible');
     });

  } else {
      console.log(`Data doesn't match with WEB or APP`);
  }
}

function createProjectItem(project, tagClass) {
  return `
  <div class="projects__item ${tagClass}" data-head="${project.head}">
    <img src="${project.img_src}" class="img-responsive" alt="" data-head="${project.head}">
    <div class="projects-caption" data-head="${project.head}">
      <h4 class="projects-head" data-head="${project.head}">${project.head}</h4>
      <p class="projects-subhead" data-head="${project.head}">${project.subhead}</p>
    </div>
  </div>`;
}

function highlightNavMenu() {  
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

function addScrollFunction (event) {  
  event.preventDefault();
  const target = event.target;
  const dataset = target.dataset;

  const target_section = document.querySelector(`#${dataset.target}`);
  target_section.scrollIntoView({behavior: 'smooth'});
}