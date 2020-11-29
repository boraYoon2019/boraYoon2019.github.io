// 전체 혹은 공유 function
function make_element_withClassesArray(elementName, classes) {
  
  const element = document.createElement(elementName);

  for (i=0; i<classes.length; i++) {
    element.classList.add(classes[i]);
  }
  
  return element;
}

function create_skillContent(skills, isInSkillSection) {

  let skillContainer = document.createElement('div');

  skillContainer.classList.add('skill-list__container');
  const skillKeyArray = ['front','server','skill'];

  for (key of skillKeyArray) {
    (()=> {
      if(skills[key] !=='' || skills[key] !==undefined) {
        isInSkillSection === true?
        skillContainer = append_skillList_inSection(skillContainer, skills[key], key)
        :
        skillContainer = append_skillList(skillContainer, skills[key], key)
      }
    })();
    
  }

  return skillContainer; 
}

function append_skillList (skillContainer, skillArray, type) {
  const finalSkillContainer = skillContainer;
  const flexContainer = make_element_withClassesArray('div',['row-flex']);

  if(skillArray !== '') {
    const skillTitle = document.createElement('h5');
    skillTitle.textContent= type+':　';
    flexContainer.appendChild(skillTitle);
  }

  const skillList = document.createElement('ul');
  if(skillArray !=='') {
    flexContainer.appendChild(append_skillItems(skillList, skillArray, type));
  }
  
  finalSkillContainer.appendChild(flexContainer);

  return finalSkillContainer;
}

function append_skillItems(skillList, skillArray, type) {
  const finalList = skillList;

  for(const skill of skillArray) {

    const skillItem = document.createElement('li');
    skillItem.classList.add(type === 'skill'? 'skills--general' : 'language--general');
    skillItem.textContent=skill;
    
    finalList.appendChild(skillItem);
  }

  return finalList;
}


// 메인 페이지 관련

function append_skillList_inSection (skillContainer, skillArray, type) {
  const finalSkillContainer = skillContainer;
  
  const skillTitle = document.createElement('h5');
  skillTitle.textContent=type+':';  
  finalSkillContainer.appendChild(skillTitle);

  const skillList = make_element_withClassesArray('ul', ['content__description', type]);

  if(skillArray !=='') {
    finalSkillContainer.appendChild(append_skillItems_InSection(skillList, skillArray, type));
  }
  
  return finalSkillContainer;
}

function append_skillItems_InSection(skillList, skillArray, type) {
  const finalList = skillList;

  if (skillArray !== '') {
    for(const skill of skillArray) {

      const skillItem = document.createElement('li');
      skillItem.classList.add(type === 'skill'? 'skills' : 'language');
      skillItem.textContent=skill;
      
      skillItem.addEventListener('click',skillItems_onClick);
      
      finalList.appendChild(skillItem);
    }
  }

  return finalList;
}

function skillItems_onClick(event){
  try {        
    const preProjectItem = document.querySelectorAll('.projects__item--active');
    preProjectItem.forEach((targetItem)=>{
      targetItem.classList.remove('projects__item--active');
    });        
  } catch {
  }

  const targetProjectItems = document.querySelectorAll(`.${event.target.textContent}`);
  
  // project itme은 두번째 class가 web 혹은 app 구분 기준임으로 첫번째 대상 프로젝트로 sortProject 기준으로 사용함.
  sortProject(false, targetProjectItems[0].classList[1]);

  if(window.matchMedia("(max-width: 540px)").matches) {
    // 첫번째 대상 프로젝트로 스크롤!
    targetProjectItems[0].scrollIntoView({behavior: 'smooth'});
  } else {
    document.querySelector('#PROJECTS').scrollIntoView({behavior: 'smooth'});
  }

  window.setTimeout(()=>{
    targetProjectItems.forEach((targetItem)=>{
     targetItem.classList.add('projects__item--active')
    })
  }, 650);

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

function create_projectItem(project, tagClass) {
  let skills = [];

  if (project.skills.front !== "") {
    skills = skills.concat(project.skills.front);
  }
  
  if (project.skills.server !== "") {
    skills = skills.concat(project.skills.server);
  }
  
  if (project.skills.skill !== "") {
    skills = skills.concat(project.skills.skill);
  }
  
  // text용
  const skills_text=skills.join(', ');
  // 클래스용
  const skills_class=skills.join(' ');

  return `
  <div class="projects__item ${tagClass} ${skills_class}" data-head="${project.head}" data-kind="${tagClass}">
    <img src="${project.thumbnail}" class="img-responsive" alt="프로젝트 이미지" data-head="${project.head}" data-kind="${tagClass}">
    <div class="projects-caption" data-head="${project.head}" data-kind="${tagClass}">
      <h4 class="projects-head" data-head="${project.head}" data-kind="${tagClass}">${project.head}</h4>
      <p class="projects-feature" data-head="${project.head}" data-kind="${tagClass}">${project.feature}</p>
      <p class="projects-feature" data-head="${project.head}" data-kind="${tagClass}"><b>${project.duration}</b></p>
      <p class="projects-subhead base-spacing" data-head="${project.head}" data-kind="${tagClass}">${project.subhead}</p>
      <p class="projects-skills" data-head="${project.head}" data-kind="${tagClass}">${skills_text}</p>
    </div>
  </div>`;
}

function highlight_navMenu() {  
  const scroll_pos = window.pageYOffset;
  const sidebar_items = document.querySelectorAll('.sidebar__item');

  sidebar_items.forEach((item, index) => {
    const sections = document.querySelectorAll('.content__main > article');
    const activeSection = sections[index];
    
    const compare = activeSection.offsetTop+100 <= scroll_pos && 
    ((activeSection.offsetTop+50) + (activeSection.offsetHeight+50) > scroll_pos);
        
    if(scroll_pos > 100) {
      compare ? item.classList.add('sidebar__item--active') : item.classList.remove('sidebar__item--active')  
    }
  });
}

function scroll_IntoSectionFunction(event) {
  
  if (event.target.className==='sidebar__menu') {
    return;
  }

  const target = event.target;
  const dataset = target.dataset;

  const targetSection = document.querySelector(`#${dataset.target}`);
  targetSection.scrollIntoView({behavior: 'smooth'});
  
  // 모바일 일 때는 사용자가 보기 편하도록 메뉴 클릭 후, 사이드바가 닫히도록 구현
  if(window.outerWidth < 540){
    const sidebarMobile = document.querySelector('.sidebar');
    sidebarMobile.classList.remove('show');  
    sidebarMobile.classList.add('close');
  }
}

function showOrClose_Sidebar (hamberger_menu) { 
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


// 프로젝트 모달 관련
function onProjectItemClick (event, projects_array) {
  if(event.target.id ==='projects') {
    return;
  }
  const projectName= event.target.dataset.head;
  const projectClass= event.target.dataset.kind;
  const clickedProject = 
    projects_array[projectClass]
    .find((project)=>project.head === projectName);

  modalSetting(clickedProject);
  modal.style.display = "block";
  body.classList.add('modal-active');
}

function modalSetting(clickedProject) {

  document.documentElement.style.setProperty('--slide', 0);

  const modal__content__layout = document.querySelector('.modal__content__layout');

  // 모달 만들기 
  const modal__content = make_element_withClassesArray('div', ['modal__content']);
  modal__content__layout.appendChild(modal__content);

  // 제목
  const head = make_element_withClassesArray('h1', ['modal-head','base-spacing']);
  head.textContent=clickedProject.head;
  modal__content.appendChild(head);

  const modalSubheadBox = make_element_withClassesArray('div', ['modal-subhead']);
  
  const feature = make_element_withClassesArray('h3', ['inline']);
  feature.textContent=clickedProject.feature;
  modalSubheadBox.appendChild(feature);

  const duration = make_element_withClassesArray('h3', ['inline']);
  duration.textContent=clickedProject.duration;
  modalSubheadBox.appendChild(duration);

  modal__content.appendChild(modalSubheadBox);

  // 메인 슬라이드 컨테이너 태그 생성
  const slidesContainer = make_element_withClassesArray('div', ['slides__container']);

  // 슬라이드 이미지 컨테이너 태그 생성
  const slides = make_element_withClassesArray('div', ['slides']);

  // 메인 슬라이드 이미지 src array
  const imgs = clickedProject.img_src;

  for (img of imgs) {    
  // 메인 슬라이드 이미지 태그 생성
    const slideImg = make_element_withClassesArray('img', ['slide']);
    slideImg.setAttribute('src', img);
    slides.appendChild(slideImg);
  }

  // 메인 슬라이드 이미지 채우기
  slidesContainer.appendChild(slides);
  modal__content.appendChild(slidesContainer);

  // 슬라이드 이미지 미리보기 태그 생성
  const slideThumbnails = document.createElement('div');
  slideThumbnails.classList.add('slides__controls');

  // 미리보기 이미지 내용 채우기
  imgs.forEach (function (img, index) {
    const imgLabel = document.createElement('label');
    imgLabel.setAttribute('style', `background-image: url(${img});`);
    
    const imgInput = document.createElement('input');
    imgInput.setAttribute('type', 'radio');
    imgInput.setAttribute('name', 'image');

    // 이미지 radio 클릭 때마다 --slide index 변경
    imgInput.addEventListener('change', (event) => {
      document.documentElement.style.setProperty('--slide', index);
    });
    imgLabel.appendChild(imgInput);
    slideThumbnails.appendChild(imgLabel);
  });

  modal__content.appendChild(slideThumbnails);

  // skillList
  const skillsList = make_element_withClassesArray('div', ['modal__skills-list','double-spacing']);
  skillsList.appendChild(create_skillContent(clickedProject.skills));
  modal__content.appendChild(skillsList);
  
  const subhead = document.createElement('h2');
  subhead.style.marginBottom = '0em';
  subhead.textContent=clickedProject.subhead;
  modal__content.appendChild(subhead);
  
  // 깃헙, 사이트 링크 anchor
  const moreBox = make_element_withClassesArray('div', ['link__item','row-flex']);

  if (clickedProject.link !== '') {    
    const pageAnchor = make_element_withClassesArray('a', ['link__item']);
    pageAnchor.setAttribute('target', '_blank');
    pageAnchor.setAttribute('href', clickedProject.link);

    const pageIcon = make_element_withClassesArray('i', ['fas','fa-hashtag']);
    pageIcon.style.padding = '.2rem';
    pageAnchor.appendChild(pageIcon);

    moreBox.appendChild(pageAnchor);
  }

  if (clickedProject.github !== '') {
    const githubAnchor = make_element_withClassesArray('a', ['link__item']);
    githubAnchor.setAttribute('target', '_blank');
    githubAnchor.setAttribute('href', clickedProject.github);

    const githubIcon = make_element_withClassesArray('i', ['fab','fa-github']);
    githubIcon.style.padding = '.2rem';
    githubAnchor.appendChild(githubIcon);

    moreBox.appendChild(githubAnchor);
  }
  modal__content.appendChild(moreBox);

  const description = make_element_withClassesArray('p', ['modal__description','double-spacing']);
  description.style.marginTop = '0em';
  description.style.paddingTop = '.2em';
  modal__content.appendChild(description);
  description.textContent=clickedProject.description;

  if(clickedProject.video !=="") {    
    const video = document.createElement('iframe');
    video.setAttribute('src', clickedProject.video);
    video.setAttribute('frameborder', '0');
    video.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
    video.setAttribute('allowFullScreen', '');
    modal__content.appendChild(video);
  }
}

function appendClass(classes, element) {
  for (className of classes) {
    element.classList.add(className);
  }
}