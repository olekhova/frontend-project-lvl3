import _ from 'lodash';
import onChange from 'on-change';
import handlers from './handlers.js';

export default (state, i18nInstance) => {
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
        break;
      default:
        throw new Error(`Unknown state: ${value}`);
    }
  };

  const postUpdater = { setVisited: null };

  const renderFeedback = (value) => {
    switch (value) {
      case '':
      case 'ok':
        submitButtonEl.disabled = false;
        feedbackEl.classList.remove('text-danger');
        feedbackEl.innerHTML = i18nInstance.t('rssLoaded');
        inputEl.classList.remove('is-invalid');
        break;
      case 'invalidUrl':
        submitButtonEl.disabled = false;
        feedbackEl.classList.add('text-danger');
        feedbackEl.innerHTML = i18nInstance.t('invalidUrl');
        inputEl.classList.add('is-invalid');
        break;
      case 'alreadyExists':
        submitButtonEl.disabled = false;
        feedbackEl.classList.add('text-danger');
        feedbackEl.innerHTML = i18nInstance.t('alreadyExists');
        inputEl.classList.add('is-invalid');
        break;
      case 'invalidRSS':
        submitButtonEl.disabled = false;
        feedbackEl.classList.add('text-danger');
        feedbackEl.innerHTML = i18nInstance.t('invalidRSS');
        inputEl.classList.add('is-invalid');
        break;
      default:
        throw new Error(`Unknown error: ${value}`);
    }
  };

  const createFeedEl = (title, description) => {
    const liEl = document.createElement('li');
    liEl.className = 'list-group-item border-0 border-end-0';
    const h3El = document.createElement('h3');
    h3El.className = 'h6 m-0';
    h3El.innerHTML = title;
    const pEl = document.createElement('p');
    pEl.className = 'm-0 small text-black-50';
    pEl.innerHTML = description;
    liEl.append(h3El);
    liEl.append(pEl);
    return liEl;
  };

  const renderFeeds = (feeds) => {
    feedsTitleEl.innerHTML = i18nInstance.t('feedsTitle');
    feedsUlEl.innerHTML = '';
    _.forEach(feeds, (feed) => {
      const feedLiEl = createFeedEl(feed.title, feed.description);
      feedsUlEl.append(feedLiEl);
    });
  };

  const createPostEl = (post) => {
    const {
      title, id, url, isVisited,
    } = post;
    const liEl = document.createElement('li');
    liEl.className = 'list-group-item d-flex justify-content-between align-items-start border-0 border-end-0';
    const aEl = document.createElement('a');
    aEl.innerHTML = title;
    aEl.className = isVisited ? 'fw-normal' : 'fw-bold';
    aEl.setAttribute('href', url);
    aEl.setAttribute('data-id', id);
    aEl.setAttribute('target', '_blank');
    aEl.setAttribute('rel', 'noopener noreferrer');
    const buttonEl = document.createElement('button');
    buttonEl.innerHTML = i18nInstance.t('view');
    buttonEl.className = 'btn btn-outline-primary btn-sm';
    buttonEl.setAttribute('type', 'button');
    buttonEl.setAttribute('data-id', id);
    buttonEl.setAttribute('data-bs-toggle', 'modal');
    buttonEl.setAttribute('data-bs-target', '#modal');
    buttonEl.addEventListener('click', () => handlers.handleViewButton(post, postUpdater));
    liEl.append(aEl);
    liEl.append(buttonEl);
    return liEl;
  };

  const renderPosts = (posts) => {
    postsTitleEl.innerHTML = i18nInstance.t('postsTitle');
    postsUlEl.innerHTML = '';
    _.forEach(posts, (post) => {
      const postLiEl = createPostEl(post);
      postsUlEl.append(postLiEl);
    });
  };

  const watchedState = onChange(state, (path, value) => {
    switch (path) {
      case 'form.processState':
        processStateHandler(value);
        break;
      case 'error':
        renderFeedback(value);
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
    if (path.startsWith('posts.') && path.endsWith('.isVisited')) {
      renderPosts(state.posts);
    }
  });

  postUpdater.setVisited = (postId, visited) => {
    _.find(watchedState.posts, (post) => post.id === postId).isVisited = visited;
  };

  return watchedState;
};
