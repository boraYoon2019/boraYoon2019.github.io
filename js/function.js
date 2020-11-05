// 전체 혹은 공유 function
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

function create_skillContent(skills, isInSkillSection) {

  let skillContainer = document.createElement('div');

  skillContainer.classList.add('skill-list__container');
  const skillKeyArray = ['front','server','skill'];

  for (key of skillKeyArray) {
    (()=> {
      if(skills[key] !=='' || skills[key] !==undefined) {
        console.log("if(skills[key] !=='')",skills[key]);
        isInSkillSection === true?
        skillContainer = append_skillList_inSection(skillContainer, skills[key], key)
        :
        skillContainer = append_skillList(skillContainer, skills[key], key)
      } else {
        console.log("else",skills[key]);
      }
    })();
    
  }

  return skillContainer; 
}

function append_skillList (skillContainer, skillArray, type) {
  let finalSkillContainer = skillContainer;
  let flexContainer = document.createElement('div');
  flexContainer.classList.add('row-flex');

  const skillTitle = document.createElement('h5');
  skillTitle.textContent=type+':　';
  flexContainer.appendChild(skillTitle);

  const skillList = document.createElement('ul');
  if(skillArray !=='') {
    flexContainer.appendChild(append_skillItems(skillList, skillArray, type));
  }
  
  finalSkillContainer.appendChild(flexContainer);

  return finalSkillContainer;
}

function append_skillItems(skillList, skillArray, type) {
  let finalList = skillList;

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
  console.log('append_skillList_inSection');
  let finalSkillContainer = skillContainer;
  
  const skillTitle = document.createElement('h5');
  skillTitle.textContent=type+':';  
  finalSkillContainer.appendChild(skillTitle);

  const skillList = document.createElement('ul');
  skillList.classList.add('content__description');
  skillList.classList.add(type);

  if(skillArray !=='') {
    console.log('skillArray',skillArray);
    finalSkillContainer.appendChild(append_skillItems_InSection(skillList, skillArray, type));
  }
  
  return finalSkillContainer;
}

function append_skillItems_InSection(skillList, skillArray, type) {
  let finalList = skillList;

  console.log('append_skillItems_InSection skillArray', skillArray);
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

  targetProjectItems.forEach((targetItem)=>{
    targetItem.classList.add('projects__item--active');
  });
  
  // project itme은 두번째 class가 web 혹은 app 구분 기준임으로 첫번째 대상 프로젝트로 sortProject 기준으로 사용함.
  sortProject(false, targetProjectItems[0].classList[1]);

  if(window.matchMedia("(max-width: 540px)").matches) {
    // 첫번째 대상 프로젝트로 스크롤!
    targetProjectItems[0].scrollIntoView({behavior: 'smooth'});
  } else {
    console.log('bigger than max-width: 540px');
    document.querySelector('#PROJECTS').scrollIntoView({behavior: 'smooth'});
  }  
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

function highlight_navMenu() {  
  let scroll_pos = window.pageYOffset;
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
  event.preventDefault();
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
function onProjectItemClick (event) {

  const projectName= event.target.dataset.head;

  // 모달이 클릭됨과 동시에 서버 통신을 통해 json 데이터를 받아온다는 가정하에 코드 작성 및 구현 
  axios.get('../data/projects.json')
  .then((response)=>{
    
    // json 객체를 이중 배열로 변경
    const projects_array=Object.entries(response.data.projects);
    
    const clickedProject = 
    projects_array
    // 이중 배열에서 실제 객체 배열을 가진(데이터가 있는) 2번째 인덱스의 값(project 배열임)만 추출해 하나의 배열로 만듬=합침(concat) 
    .reduce((preData, projectData)=> {
      // projectData[0] 은 웹인지 앱인지 나누는 부분임.
      const projectInfo = preData.concat(projectData[1]);
      return projectInfo;
    }, [])
    // 그 후, project head가 일치하는 것만 찾아냄.
    .find((project)=>project.head === projectName);

    modalSetting(clickedProject);
    modal.style.display = "block";
    body.classList.add('modal-active');

  })
  .catch((error) => {
    // 실제 서버 통신은 아니므로, 에러날 일이 없어 따로 구현하지 않음.
    console.log(error);

  });
}

function modalSetting(clickedProject) {

  document.documentElement.style.setProperty('--slide', 0);

  const modal__content__layout = document.querySelector('.modal__content__layout');

  // 모달 만들기 
  const modal__content = document.createElement('div');
  modal__content.classList.add('modal__content');
  modal__content__layout.appendChild(modal__content);

  // 제목
  const head = document.createElement('h1');
  head.classList.add('modal-head');
  head.classList.add('base-spacing');  
  head.textContent=clickedProject.head;
  modal__content.appendChild(head);

  // 메인 슬라이드 컨테이너 태그 생성
  const slidesContainer = document.createElement('div');
  slidesContainer.classList.add('slides__container');

  // 슬라이드 이미지 컨테이너 태그 생성
  const slides = document.createElement('div');
  slides.classList.add('slides');

  // 메인 슬라이드 이미지 src array
  const imgs = clickedProject.img_src;

  for (img of imgs) {    
  // 메인 슬라이드 이미지 태그 생성
    const slideImg = document.createElement('img');
    slideImg.classList.add('slide');
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
      // radio 버튼 자체는 화면에 보이지 않으므로, check 처리해 줄 필요없어서 생략
      // if (!event.target.checked) {        
      //   radio = document.querySelectorAll('input[name=image]');
      //   radio.checked=false;
      // }
    });
    imgLabel.appendChild(imgInput);
    slideThumbnails.appendChild(imgLabel);
  });

  modal__content.appendChild(slideThumbnails);


  const box = document.createElement('div');
  box.classList.add('modal-subhead');

  const feature = document.createElement('h3');
  feature.classList.add('inline');
  feature.textContent=clickedProject.feature;
  box.appendChild(feature);

  const subhead = document.createElement('h2');
  subhead.classList.add('inline');
  subhead.textContent=clickedProject.subhead;
  box.appendChild(subhead);
  modal__content.appendChild(box);

  // skillList
  const skillsList = document.createElement('div');
  skillsList.classList.add('modal__skills-list');
  skillsList.classList.add('double-spacing');
  skillsList.appendChild(create_skillContent(clickedProject.skills));
  modal__content.appendChild(skillsList);

  const description = document.createElement('p');
  description.classList.add('modal__description');
  description.classList.add('double-spacing');
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