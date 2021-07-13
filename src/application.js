import * as yup from 'yup';
import _ from 'lodash';
import view from './view.js';
import processFeeds from './feedProcessor.js';

const formEl = document.querySelector('form');
const inputEl = formEl.querySelector('[name="url"]');

const schema = yup.object().shape({
  url: yup.string().url().required(),
});

const validate = (fields) => {
  try {
    // console.log('Validating:', fields);
    schema.validateSync(fields, { abortEarly: false });
    return {};
  } catch (e) {
    // console.log('Полученные ошибки:', e);
    return e.message;
  }
};

export default () => {
  const state = {
    form: {
      processState: '',
      field: {
        url: '',
      },
      valid: true,
      error: '',
    },
    urls: [],
    feeds: [],
    posts: [],
  };

  const watchedState = view(state);

  formEl.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    watchedState.form.field.url = formData.get('url');

    const errors = validate(watchedState.form.field);
    // console.log('Результат валидации:', errors);
    watchedState.form.valid = _.isEqual(errors, {});
    // console.log('updateValidation:', watchedState.form.valid);
    if (!watchedState.form.valid) {
      watchedState.form.errors = 'Ссылка должна быть валидным URL';
      watchedState.form.processState = 'finished';
      inputEl.focus();
      return;
    }
    if (watchedState.urls.includes(watchedState.form.field.url)) {
      watchedState.form.errors = 'RSS уже существует';
      // console.log('Уже добавлен');
      watchedState.form.processState = 'finished';
      inputEl.focus();
      return;
    }
    watchedState.form.errors = '';
    watchedState.form.processState = 'adding';
    watchedState.urls.push(watchedState.form.field.url);
    // console.log('Список фидов:', watchedState.feeds);
    processFeeds(watchedState);

    watchedState.form.processState = 'finished';
    formEl.reset();
    inputEl.focus();
  });
};
