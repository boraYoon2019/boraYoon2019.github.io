'use strict';

window.addEventListener("load", function() {
  alert("반갑습니다. 이 페이지는 포트폴리오 겸 개인 프로젝트입니다. :)");
  console.log("");
});

axios.get('../data/data.json')
.then((response)=>{
  const data = response.data;

  // about 섹션
  const about = data.about;
  
  const aboutSubhead = document.querySelector('.content__subhead');
  const aboutContent = document.querySelector('.content__paragraph');

  aboutSubhead.textContent = about.title;
  aboutContent.textContent = about.content;

  // project 섹션
  const projects = data.projects;
  const projectSection = document.querySelector('#projects');

  const projectWeb = projects.web.map((project)=>createProjectItem(project, 'web')).join('');
  const projectApp = projects.app.map((project)=>createProjectItem(project, 'app')).join('');
  projectSection.innerHTML = projectWeb+projectApp;
  
  const contentButton = document.querySelector('.content__button');
  contentButton.classList.add('content__button--active');
  
  // 프로젝트 탭 > 이벤트 위임
  const tab_Buttons = document.querySelector('.content__btn-group');
  sortProject(false);
  tab_Buttons.addEventListener('click', (event) => sortProject(event));

  // skills 섹션
  const skills = data.skills;
  // skill Article 내부 내용 채움
  const skillArticle = document.querySelector('.content__skills');
  skillArticle.appendChild(createSkillArticleLists(skills));

  // 경력 섹션
  const experience = data.experience;
  const experienceList = document.querySelector('.content__experience ul');

  for (const exp of experience) {
    const experienceItem = document.createElement('li');
    experienceItem.classList.add('double-spacing');

    const experienceTitle = document.createElement('h3');
    experienceTitle.textContent=exp.company;    
    experienceTitle.classList.add('inline');

    experienceItem.appendChild(experienceTitle);

    if(exp.link !== "") {
      const experienceLink = document.createElement('a');
      experienceLink.setAttribute('href', exp.link);
      experienceLink.textContent='('+exp.link+')';
      experienceItem.appendChild(experienceLink);
    }
    
    const experiencePosition = document.createElement('h4');
    experiencePosition.textContent=exp.position;
    experiencePosition.classList.add('align-right');
    experiencePosition.style.color='#3f1fb0';
    experienceItem.appendChild(experiencePosition);

    const experienceDuration = document.createElement('p');
    experienceDuration.textContent=exp.duration;
    experienceDuration.classList.add('align-right');
    experienceDuration.classList.add('text-bolder');
    experienceItem.appendChild(experienceDuration);

    const experienceContent = document.createElement('p');
    experienceContent.textContent=exp.summary;
    experienceContent.classList.add('updown-double-spacing');
    experienceItem.appendChild(experienceContent);

    if(exp.skills !== "") {
      // const experienceSkills = document.createElement('p');
      // experienceSkills.textContent=exp.summary;
      // experienceSkills.classList.add('double-spacing');
      // experienceItem.appendChild(experienceSkills);
    }
    experienceList.appendChild(experienceItem);
  }

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

function createSkillItems(skillList, skillArray, type) {
  let finalList = skillList;

  for(const skill of skillArray) {

    const skillItem = document.createElement('li');
    skillItem.classList.add(type === 'skill'? 'skills' : 'language');
    skillItem.textContent=skill;

    skillItem.addEventListener('click',(event)=>{

      try {        
        const preProjectItem = document.querySelectorAll('.projects__item--active');
        preProjectItem.forEach((targetItem)=>{
          targetItem.classList.remove('projects__item--active');
        });        
      } catch {
      }

      const targetProjectItems = document.querySelectorAll(`.${event.target.textContent}`);

      targetProjectItems.forEach((targetItem)=>{
        targetItem.classList.add('projects__item--active');
      });
      
      sortProject(false, targetProjectItems[0].classList[1]);
      if(window.matchMedia("(max-width: 540px)").matches) {
        targetProjectItems[0].scrollIntoView({behavior: 'smooth'});
      } else {
        document.querySelector('#projects').scrollIntoView({behavior: 'smooth'});
      }
    });
    
    finalList.appendChild(skillItem);
  }

  return finalList;
}

function createSkillList (skillContainer, skilLArray, type) {
  let finalSkillContainer = skillContainer;

  const skillTitle = document.createElement('h5');
  skillTitle.textContent=type+':';  
  finalSkillContainer.appendChild(skillTitle);

  const skillList = document.createElement('ul');
  skillList.classList.add('content__description');
  skillList.classList.add(type);

  finalSkillContainer.appendChild(createSkillItems(skillList, skilLArray, type));

  return finalSkillContainer;
}

function createSkillArticleLists(skills) {

  let skillContainer = document.createElement('div');
  skillContainer.classList.add('skill-list__container');
  
  skillContainer = createSkillList(skillContainer, skills.front, 'front');
  skillContainer = createSkillList(skillContainer, skills.server, 'server');
  skillContainer = createSkillList(skillContainer, skills.skill, 'skill');
  
  return skillContainer;
}

function sortProject(eventOrFalse, option) {

  // default값 지정
  let webOrApp = option;
  if(eventOrFalse === false && webOrApp===undefined) {
    webOrApp = 'web';
  } else if (eventOrFalse === false && webOrApp !== undefined) {
  } else {
    webOrApp = eventOrFalse.target.textContent;
  }

  const projects = document.querySelectorAll('.projects__item');

  if (webOrApp==='web') {
    projects.forEach((project)=> {
      project.classList.contains('web') ? 
      project.classList.remove('invisible') : project.classList.add('invisible');
    });

    const app_tab = document.querySelector('#app_tab');
    app_tab.classList.remove('content__button--active');

    const web_tab = document.querySelector('#web_tab');
    web_tab.classList.add('content__button--active');

  } else if (webOrApp==='app') {

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
  let skills_string=Object.entries(project.skills)
  // 이중 배열에서 실제 객체 배열을 가진(데이터가 있는) 2번째 인덱스의 값(project 배열임)만 추출해 하나의 배열로 만듬=합침(concat). 
  .reduce((preSpecArr, spec)=> {
    // spec[0] 은 front, server, skill > 제목 부분임
      const specArray = spec[1] !=='' ? preSpecArr.concat(spec[1]) : preSpecArr;
      return specArray;
  }, []);
  // 해당 배열의 각 값을 ' '로 연결해서 이은 string 으로 변경.

  // text용
  const skills_text=skills_string.join(', ');
  // 클래스용
  const skills_class=skills_string.join(' ');

  return `
  <div class="projects__item ${tagClass} ${skills_class}" data-head="${project.head}">
    <img src="${project.thumbnail}" class="img-responsive" alt="프로젝트 이미지" data-head="${project.head}">
    <div class="projects-caption" data-head="${project.head}">
      <h4 class="projects-head" data-head="${project.head}">${project.head}</h4>
      <p class="projects-feature" data-head="${project.head}">${project.feature}</p>
      <p class="projects-subhead base-spacing" data-head="${project.head}">${project.subhead}</p>
      <p class="projects-skills" data-head="${project.head}">${skills_text}</p>
    </div>
  </div>`;
}

function highlightNavMenu() {  
  let scroll_pos = window.pageYOffset;
  const sidebar_items = document.querySelectorAll('.sidebar__item');

  sidebar_items.forEach((item, index) => {
    const sections = document.querySelectorAll('.content__main > article');
    const activeSection = sections[index];
      
    const position = 100;
    const positionHalf =50;
    
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

  const targetSection = document.querySelector(`#${dataset.target}`);
  targetSection.scrollIntoView({behavior: 'smooth'});
  
  if(window.outerWidth < 540){
    const sidebarMobile = document.querySelector('.sidebar');
    sidebarMobile.classList.remove('show');  
    sidebarMobile.classList.add('close');
  }
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
