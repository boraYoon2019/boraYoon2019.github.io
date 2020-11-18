'use strict';

axios.get('../data/data.json')
.then((response)=>{
  const data = response.data;

  // about 섹션
  const about = data.about;
  
  const aboutSubhead = document.querySelector('.content__subhead');  
  aboutSubhead.textContent = about.title;

  
  const aboutContainer= document.querySelector('.container__about');
  for (const paragraph of about.content) {
    const aboutParagraph = document.createElement('p');
    
    aboutParagraph.classList.add('content__paragraph');
    aboutParagraph.textContent = paragraph;

    aboutContainer.appendChild(aboutParagraph);
  }

  // project 섹션
  const projects = data.projects;
  const projectSection = document.querySelector('#projects');

  // console.time('create_projectItem');
  const projectWeb = projects.web.map((project)=>create_projectItem(project, 'web')).join('');
  const projectApp = projects.app.map((project)=>create_projectItem(project, 'app')).join('');
  projectSection.innerHTML = projectWeb+projectApp;  
  // console.timeEnd('create_projectItem');
  
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
  skillArticle.appendChild(create_skillContent(skills, true));

  // 경력 섹션
  // console.time('experience');
  const experience = data.experience;
  const experienceList = document.querySelector('.content__experience ul');

  for (const exp of experience) {
    const experienceItem = make_element_withClassesArray('li', ['base-spacing','bottom-spacing']);

    const experienceTitle = make_element_withClassesArray('h2', ['inline']);
    experienceTitle.textContent=exp.company;

    experienceItem.appendChild(experienceTitle);

    if(exp.link !== "") {
      const experienceLink = document.createElement('a');
      experienceLink.setAttribute('href', exp.link);
      experienceLink.textContent='('+exp.link+')';
      experienceItem.appendChild(experienceLink);
    }
    
    const experiencePosition = make_element_withClassesArray('h4', ['align-right']);
    experiencePosition.textContent=exp.position;
    experiencePosition.style.color='#3f1fb0';
    experienceItem.appendChild(experiencePosition);

    const experienceDuration = make_element_withClassesArray('p', ['align-right','text-bolder']);
    experienceDuration.textContent=exp.duration;
    experienceItem.appendChild(experienceDuration);

    const experienceContent = make_element_withClassesArray('p', ['updown-double-spacing']);
    experienceContent.textContent=exp.summary;
    experienceItem.appendChild(experienceContent);

    if(exp.skills !== "") {
      experienceItem.appendChild(create_skillContent(exp.skills, false));
    }

    experienceList.appendChild(experienceItem);
  }
  // console.timeEnd('experience');

  // 교육 섹션  
  // console.time('교육 섹션');
  const education = data.education;
  const educationList = document.querySelector('.content__education ul');

  for (const item of education) {
    const educationItem = make_element_withClassesArray('li', ['base-spacing','bottom-spacing']);

    const educationTitle = make_element_withClassesArray('h2', ['inline']);
    educationTitle.textContent=item.name;

    educationItem.appendChild(educationTitle);
    
    const educationDuration = make_element_withClassesArray('p', ['align-right','text-bolder']);
    educationDuration.textContent=item.duration;
    educationItem.appendChild(educationDuration);

    const educationContent = make_element_withClassesArray('p', ['updown-double-spacing']);
    educationContent.textContent=item.summary;
    educationItem.appendChild(educationContent);

    educationList.appendChild(educationItem);
  }
  // console.timeEnd('교육 섹션');
})
.catch((error) => {
  console.log(error);
});


// contact me 버튼
const contactMe_btn = document.querySelector('.contactMe');
contactMe_btn.addEventListener('click', ()=>{
  location.href='mailto:yunbora504@gmail.com';
});

// 메인 화면 - scroll시 사이드바 스크롤파이 메뉴
window.addEventListener('scroll', highlight_navMenu);

// 사이드바 > 이벤트 위임
const sidebar_anchor = document.querySelector('.sidebar__menu');
sidebar_anchor.addEventListener('click', scroll_IntoSectionFunction);

// 모바일 헤더 햄버거 메뉴 이벤트
const hamberger_menu = document.querySelector('.navbar__toggle');
showOrClose_Sidebar(hamberger_menu);