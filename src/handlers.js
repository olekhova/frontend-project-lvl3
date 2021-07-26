export default () => {
  const bodyEl = document.querySelector('body');
  const modalEl = document.querySelector('#modal');
  const modalTitleEl = modalEl.querySelector('.modal-title');
  const modalBodyEl = modalEl.querySelector('.modal-body');
  const modalLinkEl = modalEl.querySelector('.full-article');
  const closeEls = document.querySelectorAll('[data-bs-dismiss="modal"]');

  const openModal = (post) => {
    bodyEl.classList.add('modal-open');
    modalEl.classList.add('show');
    modalEl.setAttribute('style', 'display: block');
    modalEl.removeAttribute('aria-hidden');
    modalEl.setAttribute('aria-modal', 'true');
    modalTitleEl.innerHTML = post.title;
    modalBodyEl.innerHTML = post.description;
    modalLinkEl.setAttribute('href', post.url);
  };

  const closeModal = () => {
    bodyEl.classList.remove('modal-open');
    modalEl.classList.remove('show');
    modalEl.setAttribute('style', 'display: none');
    modalEl.removeAttribute('aria-modal');
    modalEl.setAttribute('aria-hidden', 'true');
  };

  const handleViewButton = (post, postUpdater) => {
    postUpdater.setVisited(post.id, true);
    openModal(post);
    closeEls.forEach((closeEl) => closeEl.addEventListener('click', () => closeModal()));
  };

  return { handleViewButton };
};
