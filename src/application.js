import * as yup from 'yup';
import _ from 'lodash';
import view from './view.js';
// import axios from 'axios';

import processFeeds from './feedProcessor.js';

const formEl = document.querySelector('form');
const inputEl = formEl.querySelector('[name="url"]');

const schema = yup.object().shape({
  url: yup.string().url().required().matches(/\.(rss)$/),
});

const validate = (fields) => {
  try {
    // console.log('Validating:', fields);
    schema.validateSync(fields, { abortEarly: false });
    return {};
  } catch (e) {
    return _.keyBy(e.inner, 'path');
  }
};

// const updateValidationState = (watchedState) => {
//   /*
//   const errors = validate(watchedState.form.fields);
//   watchedState.form.errors = errors;
//   watchedState.form.valid = _.isEqual(errors, {});
//   */
//   const result = watchedState;
//   const errors = validate(result.form.fields);
//   result.form.valid = _.isEqual(errors, {});
//   result.form.errors = errors;
//   return result;
// };

export default () => {
  const state = {
    form: {
      processState: '',
      fields: {
        url: '',
      },
      valid: true,
      errors: {},
    },
    feeds: [],
    posts: [],
  };

  const watchedState = view(state);
  // inputEl.addEventListener('input', (e) => {
  //   e.preventDefault();
  //   watchedState.form.fields.url = e.target.value;
  //   console.log('Validating:', watchedState.form);
  //   const errors = validate(watchedState.form.fields);
  //   watchedState.form.errors = errors;
  //   watchedState.form.valid = _.isEqual(errors, {});
  //   console.log('updateValidation:', watchedState.form.valid, watchedState.form.errors);
  // });

  formEl.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    watchedState.form.fields.url = formData.get('url');

    // watchedState.form.fields.url = e.target.value;
    console.log('Validating:', watchedState.form);
    const errors = validate(watchedState.form.fields);
    watchedState.form.errors = errors;
    watchedState.form.valid = _.isEqual(errors, {});
    console.log('updateValidation:', watchedState.form.valid, watchedState.form.errors);
    if (!watchedState.form.valid) {
      watchedState.form.processState = 'finished';
      inputEl.focus();
      return;
    }
    watchedState.form.processState = 'adding';
    //console.log('Validating2:', watchedState.form);
    if (watchedState.feeds.includes(watchedState.form.fields.url)) {
      console.log('Уже добавлен');
    } else {
      watchedState.feeds.push(watchedState.form.fields.url);
      console.log('Список фидов:', watchedState.feeds );
      processFeeds(watchedState.feeds);
    }



    /*
    try {
      axios.post(routes.usersPath(), watchedState.form.fields).then(() => {
        watchedState.form.processState = 'finished';
      });
    } catch (err) {
      // В реальных приложениях также требуется корректно обрабатывать сетевые ошибки
      watchedState.form.processError = 'network error';
      watchedState.form.processState = 'failed';
      // здесь это опущено в целях упрощения приложения
      throw err;
    }
    */

    watchedState.form.processState = 'finished';
    formEl.reset();
    inputEl.focus();
  });
};
