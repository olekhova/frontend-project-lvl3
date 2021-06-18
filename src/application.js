import * as yup from 'yup';
import onChange from 'on-change';
import _ from 'lodash';
// import axios from 'axios';

const feedbackEl = document.querySelector('.feedback');
const form = document.querySelector('form');
const inputEl = form.querySelector('[name="url"]');
const submitButton = form.querySelector('[type="submit"]');

const schema = yup.object().shape({
  url: yup.string().url().required().matches(/\.(rss)$/),
});

const validate = (fields) => {
  try {
    schema.validateSync(fields, { abortEarly: false });
    return {};
  } catch (e) {
    return _.keyBy(e.inner, 'path');
  }
};

const updateValidationState = (watchedState) => {
  const ret = watchedState;
  const errors = validate(ret.form.fields);
  ret.form.valid = _.isEqual(errors, {});
  ret.form.errors = errors;
  return ret;
};

export default () => {
  const state = {
    form: {
      processState: 'filling',
      fields: {
        url: '',
      },
      valid: true,
      errors: {},
    },
    feeds: [],
    posts: [],
  };

  let watchedState = onChange(state, (path, value) => {
    switch (path) {
      /* case 'form.processState':
        processStateHandler(value);
        break;  */
      case 'form.valid':
        if (!value) {
          submitButton.disabled = !value;
          feedbackEl.innerHTML = 'Ссылка должна быть валидным URL';
          inputEl.classList.add('is-invalid');
        } else {
          submitButton.disabled = !value;
          feedbackEl.innerHTML = '';
          inputEl.classList.remove('is-invalid');
        }
        break;
      /* case 'form.errors':
        renderErrors(fieldElements, value);
        break; */
      default:
        break;
    }
  });

  inputEl.addEventListener('input', (e) => {
    e.preventDefault();
    watchedState.form.fields.url = e.target.value;
    watchedState = updateValidationState(watchedState);
    console.log('updateValidation:', watchedState);
  });
  /*
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(e);
    try {
      schema.validateSync(data);
    }
    catch {
      watchedState.form.valid = false;
    }
  });
*/

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    watchedState.form.processState = 'sending';
    try {
      // await axios.post(routes.usersPath(), watchedState.form.fields);
      watchedState.form.processState = 'finished';
    } catch (err) {
      // В реальных приложениях также требуется корректно обрабатывать сетевые ошибки
      watchedState.form.processError = 'network error';
      watchedState.form.processState = 'failed';
      // здесь это опущено в целях упрощения приложения
      throw err;
    }
  });
};
