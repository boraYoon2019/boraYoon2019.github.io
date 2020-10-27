'use strict';

axios.get('./data.json')
.then((response)=>{
  const data = response.data;

  const about = data.about;
  const projects = data.projects;
  
  const aboutSubhead = document.querySelector('.content__subhead');
  const aboutContent = document.querySelector('.content__paragraph');

  aboutSubhead.textContent = about.title;
  aboutContent.textContent = about.content;

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

window.addEventListener('resize', () => {
  if(window.screen.width>540) {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.remove('close');
    sidebar.classList.add('show');
  } else if (window.screen.width<=540) {    
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.remove('show');
    sidebar.classList.add('close');
  } else {
    return;
  }
});

// 메인 화면 - scroll시 사이드바 스크롤파이 메뉴
window.addEventListener('scroll', highlightNavMenu);

// 사이드바 > 이벤트 위임
const sidebar_anchor = document.querySelector('.sidebar__menu');
sidebar_anchor.addEventListener('click', addScrollFunction);

// 모바일 헤더 햄버거 메뉴 이벤트
const hamberger_menu = document.querySelector('.navbar__toggle');
showOrCloseSidebar(hamberger_menu);

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
  
  // entries 함수 통해 skills에 해당하는 json 객체를 이중 배열로 변경
  const skills_string=Object.entries(project.skills)
  // 이중 배열에서 실제 객체 배열을 가진(데이터가 있는) 2번째 인덱스의 값(project 배열임)만 추출해 하나의 배열로 만듬=합침(concat). 
  .reduce((pre, value)=> {
      const array = value[1] !=='' ? pre.concat(value[1]) : pre;
      console.log(array);
      return array;
  }, [])
  // 해당 배열의 각 값을 ' '로 연결해서 이은 string 으로 변경.
  .join(', ');
  // console.log(skill_array);
  // const skill=Object.entries(project.skills);
  // console.log(skill);
// project.skills.front
// project.skills.server
// project.skills.skills
  return `
  <div class="projects__item ${tagClass}" data-head="${project.head}">
    <img src="${project.thumbnail}" class="img-responsive" alt="프로젝트 이미지" data-head="${project.head}">
    <div class="projects-caption" data-head="${project.head}">
      <h4 class="projects-head" data-head="${project.head}">${project.head}</h4>
      <p class="projects-feature" data-head="${project.head}">${project.feature}</p>
      <p class="projects-subhead" data-head="${project.head}">${project.subhead}</p>
      <p class="projects-skills" data-head="${project.head}">${skills_string}</p>
    </div>
  </div>`;
}

function highlightNavMenu() {  
  let scroll_pos = window.pageYOffset;
  const sidebar_items = document.querySelectorAll('.sidebar__item');

  sidebar_items.forEach((item, index) => {
    const sections = document.querySelectorAll('.content__main > article')
    const activeSection = sections[index];

    const filter = "win16|win32|win64|mac";
    let position = 100;
    let positionHalf =50;

    if(navigator.platform){    
      if(0 > filter.indexOf(navigator.platform.toLowerCase())){    
        // 모바일일 경우
        position = 50;
        positionHalf = 25;
      }   
    }
    

    const compare = activeSection.offsetTop+position <= scroll_pos && 
    ((activeSection.offsetTop+positionHalf) + (activeSection.offsetHeight+positionHalf) > scroll_pos);
        
    if(scroll_pos > position) {
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

function showOrCloseSidebar (hamberger_menu) { 
  const sidebar = document.querySelector('.sidebar');

  hamberger_menu.addEventListener('click', () => {
    hamberger_menu.classList.toggle('active');
    if (sidebar.classList[1] =='show') {      
      sidebar.classList.remove('show');  
      sidebar.classList.add('close');
    } else if ( !sidebar.classList[1] || sidebar.classList[1] =='close') {
      sidebar.classList.add('show');
      sidebar.classList.remove('close');
    }
  });
}
