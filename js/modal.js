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