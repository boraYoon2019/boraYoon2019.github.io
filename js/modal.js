  // 모달 팝업 세팅 관련

  const body = document.querySelector('body');
  const modal = document.getElementById('project-modal');

  // Get the <span> element that closes the modal
  const close_btn = document.getElementsByClassName("modal-close")[0];

  //서버 통신을 통해 json 데이터를 받아온다는 가정하에 코드 작성 및 구현
  axios.get('../data/projects.json')
  .then((response)=>{
    // 프로젝트 데이터 > 클릭 이벤트에 전달
    const projects_array=response.data.projects;

    // 프로젝트 아이템에 이벤트 위임
    let projects__items = document.querySelector('#projects');
    projects__items.addEventListener('click', (event)=>onProjectItemClick(event, projects_array));

  })
  .catch((error) => {
    // 실제 서버 통신은 아니므로, 에러날 일이 없어 따로 구현하지 않음.
    console.log(error);
  });

  // 모달 X 버튼 클릭 시
  close_btn.onclick = function() {
    modal.style.display = "none";
    body.classList.remove('modal-active');
    const modal__content__layout = document.querySelector('.modal__content__layout');
    const modal__content = document.querySelector('.modal__content');
    modal__content__layout.removeChild(modal__content);
  }

  // 모달 띄워져 있을 때, 모달 밖 공간 클릭 시
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
      body.classList.remove('modal-active');
      const modal__content__layout = document.querySelector('.modal__content__layout');
      const modal__content = document.querySelector('.modal__content');
      modal__content__layout.removeChild(modal__content);
    }
  }