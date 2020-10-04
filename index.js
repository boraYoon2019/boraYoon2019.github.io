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

  
  // 프로젝트 탭 > 이벤트 위임
  const tab_Buttons = document.querySelector('.content__btn-group');
  sortProject(false);
  tab_Buttons.addEventListener('click', (event) => sortProject(event));
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
  // 이후 선택된 탭에 따라 값 변경
  event ? webOrApp = event.target.textContent : false;
  const projects = document.querySelectorAll('.projects__item');

  if (webOrApp==='WEB') {
    projects.forEach((project)=> {
      project.classList.contains('web') ? 
      project.classList.remove('invisible') : project.classList.add('invisible');
    });

    const app_tab = document.querySelector('#app_tab');
    app_tab.classList.remove('content__button--active');

    const web_tab = document.querySelector('#web_tab');
    web_tab.classList.add('content__button--active');

  } else if (webOrApp==='APP') {

    projects.forEach((project)=> {
      project.classList.contains('app') ?
       project.classList.remove('invisible') : project.classList.add('invisible');
     });
    
    const web_tab = document.querySelector('#web_tab');
    web_tab.classList.remove('content__button--active');

    const app_tab = document.querySelector('#app_tab');
    app_tab.classList.add('content__button--active');

  } else {
      console.log(`Data doesn't match with WEB or APP`);
  }
}

function createProjectItem(project, tagClass) {
  // 뻘짓 로그
  // console.log(Object.entries(project.skills).splice(1, 1));
  // const skill_array=Object.entries(project.skills)
  // .filter((value)=>value[1].length>0)  
  // 필터 length 안먹었음!
  // .map((value)=>value.splice(1, 1));
  // console.log(skill_array);
  
  // skills에 해당하는 json 객체를 이중 배열로 변경
  const skill_array=Object.entries(project.skills)
  // 이중 배열에서 실제 객체 배열을 가진(데이터가 있는) 2번째 인덱스의 값(project 배열임)만 추출해 하나의 배열로 만듬=합침(concat). 
  .reduce((pre, value)=> {
      const array = pre.concat(value[1]);
      return array;
  }, [])
  // 해당 배열의 각 값을 ' '로 연결해서 이은 string 으로 변경.
  .join(' ');
  // console.log(skill_array);

  return `
  <div class="projects__item ${tagClass}" data-head="${project.head}">
    <img src="${project.thumbnail}" class="img-responsive" alt="프로젝트 이미지" data-head="${project.head}">
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