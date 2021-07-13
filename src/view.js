import _ from 'lodash';
import onChange from 'on-change';

const feedbackEl = document.querySelector('.feedback');
const formEl = document.querySelector('form');
const submitButtonEl = formEl.querySelector('[type="submit"]');
const inputEl = formEl.querySelector('[name="url"]');
const feedsEl = document.querySelector('.feeds');
const feedsTitleEl = feedsEl.querySelector('h2');
const feedsUlEl = feedsEl.querySelector('ul');
const postsEl = document.querySelector('.posts');
const postsTitleEl = postsEl.querySelector('h2');
const postsUlEl = postsEl.querySelector('ul');

const renderErrorFeedback = (value) => {
  if (!value) {
    submitButtonEl.disabled = false;
    feedbackEl.classList.remove('text-danger');
    feedbackEl.innerHTML = '';
    inputEl.classList.remove('is-invalid');
  } else {
    submitButtonEl.disabled = false;
    feedbackEl.classList.add('text-danger');
    feedbackEl.innerHTML = `${value}`;
    inputEl.classList.add('is-invalid');
  }
};

const renderSuccessFeedback = () => {
  submitButtonEl.disabled = false;
  feedbackEl.classList.remove('text-danger');
  feedbackEl.innerHTML = 'RSS успешно загружен';
  inputEl.classList.remove('is-invalid');
};

const createFeedEl = (title, description) => {
  const liEl = document.createElement('li');
  liEl.className = 'list-group-item border-0 border-end-0';
  const h3El = document.createElement('h3');
  h3El.className = 'h6 m-0';
  h3El.innerHTML = `${title}`;
  const pEl = document.createElement('p');
  pEl.className = 'm-0 small text-black-50';
  pEl.innerHTML = `${description}`;
  liEl.append(h3El);
  liEl.append(pEl);
  return liEl;
};

const renderFeeds = (feeds) => {
  feedsTitleEl.innerHTML = 'Фиды';
  _.forEach(feeds, (feed) => {
    const feedLiEl = createFeedEl(feed.title, feed.description);
    feedsUlEl.append(feedLiEl);
  });
};

const createPostEl = (title, id, url) => {
  const liEl = document.createElement('li');
  liEl.className = 'list-group-item d-flex justify-content-between align-items-start border-0 border-end-0';
  const aEl = document.createElement('a');
  aEl.innerHTML = `${title}`;
  aEl.className = 'fw-bold';
  aEl.setAttribute('href', url);
  aEl.setAttribute('data-id', id);
  aEl.setAttribute('target', '_blank');
  // aEl.setAttribute('rel', 'noopener noreferrer');
  const buttonEl = document.createElement('button');
  buttonEl.innerHTML = 'Просмотр';
  buttonEl.className = 'btn btn-outline-primary btn-sm';
  buttonEl.setAttribute('type', 'type');
  buttonEl.setAttribute('data-id', id);
  // buttonEl.setAttribute('data-bs-toggle', 'modal');
  // buttonEl.setAttribute('data-bs-target', '#modal');
  liEl.append(aEl);
  liEl.append(buttonEl);
  return liEl;
};

const renderPosts = (posts) => {
  console.log('rendering posts:', posts);
  postsTitleEl.innerHTML = 'Посты';
  _.forEach(posts, (post) => {
    const postLiEl = createPostEl(post.title, post.id, post.url);
    postsUlEl.append(postLiEl);
  });
};

const processStateHandler = (value) => {
  switch (value) {
    case 'sending':
      submitButtonEl.disabled = true;
      break;
    case 'failed':
      submitButtonEl.disabled = false;
      break;
    case 'finished':
      submitButtonEl.disabled = false;
      break;
    case 'adding':
      submitButtonEl.disabled = true;
      renderSuccessFeedback();
      break;
    default:
      throw new Error(`Unknown state: ${value}`);
  }
};

export default (state) => {
  const watchedState = onChange(state, (path, value) => {
    switch (path) {
      case 'form.processState':
        processStateHandler(value);
        break;
      case 'form.errors':
        renderErrorFeedback(value);
        break;
      case 'feeds':
        renderFeeds(value);
        break;
      case 'posts':
        renderPosts(value);
        break;
      default:
        break;
    }
  });
  return watchedState;
};
