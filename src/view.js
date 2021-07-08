import onChange from 'on-change';

const feedbackEl = document.querySelector('.feedback');
const formEl = document.querySelector('form');
const submitButtonEl = formEl.querySelector('[type="submit"]');
const inputEl = formEl.querySelector('[name="url"]');

const renderValidation = (value) => {
  if (!value) {
    submitButtonEl.disabled = !value;
    feedbackEl.innerHTML = 'Ссылка должна быть валидным URL';
    inputEl.classList.add('is-invalid');
  } else {
    submitButtonEl.disabled = !value;
    feedbackEl.innerHTML = '';
    inputEl.classList.remove('is-invalid');
  }
};

const processStateHandler = (value) => {
  switch (value) {
    case 'sending':
      submitButtonEl.disabled = true;
      break;
    case 'failed':
      submitButtonEl.disabled = false;
      // renderProcessStateError();
      break;
    case 'finished':
      submitButtonEl.disabled = false;
      // renderProcessState();
      break;
    case 'adding':
      submitButtonEl.disabled = true;
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
      case 'form.valid':
        renderValidation(value);
        break;
      /* case 'form.errors':
        renderErrors(fieldElements, value);
        break; */
      default:
        break;
    }
  });
  return watchedState;
};
