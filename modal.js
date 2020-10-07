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
  console.log(event.target);
  const projectName= event.target.dataset.head;

  axios.get('./projects.json')
  .then((response)=>{
    // console.log(response.data.projects);
    
    // json 객체를 이중 배열로 변경
    const projects_array=Object.entries(response.data.projects);
    
    console.log(projects_array);
    const clickedProject = 
    projects_array
    // 이중 배열에서 실제 객체 배열을 가진(데이터가 있는) 2번째 인덱스의 값(project 배열임)만 추출해 하나의 배열로 만듬=합침(concat) 
    .reduce((pre, value)=> {
      const array = pre.concat(value[1]);
      return array;
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
  const modal__content__layout = document.querySelector('.modal__content__layout');
  
  // 모달 만들기 
  const modal__content = document.createElement('div');
  modal__content.classList.add('modal__content');
  modal__content__layout.appendChild(modal__content);

  const head = document.createElement('h2');
  head.classList.add('modal-head');
  head.classList.add('base-spacing');  
  head.textContent=clickedProject.head;
  modal__content.appendChild(head);
  
  const slider = document.createElement('div');
  slider.classList.add('slider');
  modal__content.appendChild(slider);

  const subhead = document.createElement('h3');
  subhead.classList.add('modal-subhead'); 
  subhead.textContent=clickedProject.subhead;
  modal__content.appendChild(subhead);

  const skillsList = document.createElement('span');
  skillsList.classList.add('modal__skills-list');
  skillsList.classList.add('base-spacing');  
  modal__content.appendChild(skillsList);

  const description = document.createElement('p');
  description.classList.add('modal__description');
  description.classList.add('base-spacing');
  modal__content.appendChild(description);


  // 내용 채우기
  const imgs = clickedProject.img_src;

  for (img of imgs) {
    console.log('img 생성완료');
    const imgTag = document.createElement('img');
    imgTag.classList.add('modal__slider-img');
    imgTag.setAttribute('src', img);
    slider.appendChild(imgTag);
  }

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