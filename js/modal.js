  // 모달 팝업 동작 세팅 관련 element 세팅
  const body = document.querySelector('body');
  // Get the modal
  const modal = document.getElementById('project-modal');

  // Get the <span> element that closes the modal
  const close_btn = document.getElementsByClassName("modal-close")[0];


  let projects__items = document.querySelector('#projects');

  // When the user clicks on the button, open the modal 
  // 프로젝트 아이템에 이벤트 위임
  projects__items.addEventListener('click', (event)=>onProjectItemClick(event));


// When the user clicks on the projects__items, open the modal
function onProjectItemClick (event) {
  // console.log(event.target);
  const projectName= event.target.dataset.head;

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
    imgInput.addEventListener('change', function (event) {
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

  const skillsList = document.createElement('span');
  skillsList.classList.add('modal__skills-list');
  skillsList.classList.add('double-spacing');
  modal__content.appendChild(skillsList);

  const description = document.createElement('p');
  description.classList.add('modal__description');
  description.classList.add('double-spacing');
  modal__content.appendChild(description);

  const language_array=Object.entries(clickedProject.skills)
  .filter((value)=> value[0] !== 'skills' && value[1].length>0)
  .reduce((pre, value)=> {
      const array = pre.concat(value[1]);
      return array;
  }, []);

  if(language_array.length !==0) {
    language_array.forEach((name)=>{
      makeSkillDiv('language', name, skillsList);
    });
  }

  if(clickedProject.skills.skills.length !==0) {
    clickedProject.skills.skills.forEach((name)=>{
      makeSkillDiv('skills', name, skillsList);
    });
  }
  // innerText vs textContent
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

function makeSkillDiv(category, name, skillsList){
  const skillDiv = document.createElement('div'); 
  category === "skills" ? skillDiv.className = "skills" : skillDiv.className = "language" ;
  skillDiv.textContent=name;
  skillsList.appendChild(skillDiv);
}


 // When the user clicks on <span> (x), close the modal
 close_btn.onclick = function() {
    modal.style.display = "none";
    body.classList.remove('modal-active');
    const modal__content__layout = document.querySelector('.modal__content__layout');
    const modal__content = document.querySelector('.modal__content');
    modal__content__layout.removeChild(modal__content);
 }

 // When the user clicks anywhere outside of the modal, close it
 window.onclick = function(event) {
     if (event.target == modal) {
         modal.style.display = "none";
         body.classList.remove('modal-active');
         const modal__content__layout = document.querySelector('.modal__content__layout');
         const modal__content = document.querySelector('.modal__content');
         modal__content__layout.removeChild(modal__content);
     }
 }