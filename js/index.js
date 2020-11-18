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
    const experienceItem = document.createElement('li');
    experienceItem.classList.add('base-spacing');
    experienceItem.classList.add('bottom-spacing');

    const experienceTitle = document.createElement('h2');
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
    const educationItem = document.createElement('li');
    educationItem.classList.add('base-spacing');
    educationItem.classList.add('bottom-spacing');

    const educationTitle = document.createElement('h2');
    educationTitle.textContent=item.name;    
    educationTitle.classList.add('inline');

    educationItem.appendChild(educationTitle);
    
    const educationDuration = document.createElement('p');
    educationDuration.textContent=item.duration;
    educationDuration.classList.add('align-right');
    educationDuration.classList.add('text-bolder');
    educationItem.appendChild(educationDuration);

    const educationContent = document.createElement('p');
    educationContent.textContent=item.summary;
    educationContent.classList.add('updown-double-spacing');
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