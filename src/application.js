import './scss/app.scss';
import * as yup from 'yup';
import { setLocale } from 'yup';
import i18next from 'i18next';
import _ from 'lodash';
import view from './view.js';
import processFeeds from './feedProcessor.js';
import resources from './locales';

export default () => {
  const formEl = document.querySelector('form');
  const inputEl = formEl.querySelector('[name="url"]');

  const i18nInstance = i18next.createInstance();

  i18nInstance.init({
    lng: 'ru', // Текущий язык
    debug: true,
    resources,
  });

  setLocale({
    string: {
      url: i18nInstance.t('invalidUrl'),
    },
  });

  const schema = yup.object().shape({
    url: yup.string().required().url(),
  });

  const validate = (fields) => {
    try {
      schema.validateSync(fields, { abortEarly: false });
      return {};
    } catch (e) {
      return e.message;
    }
  };

  const state = {
    form: {
      processState: '',
      field: {
        url: '',
      },
      feedback: {
        isFormValid: false,
        isRssExist: false,
      },
    },
    urls: [],
    feeds: [],
    posts: [],
  };

  const watchedState = view(state, i18nInstance);

  formEl.addEventListener('submit', (e) => {
    e.preventDefault();
    watchedState.form.feedback = { isFormValid: true, isRssExist: false };
    const formData = new FormData(e.target);
    watchedState.form.field.url = formData.get('url');

    const errors = validate(watchedState.form.field);
    if (!_.isEqual(errors, {})) {
      watchedState.form.feedback = { isFormValid: false, isRssExist: false };
      watchedState.form.processState = 'finished';
      inputEl.focus();
      return;
    }
    if (watchedState.urls.includes(watchedState.form.field.url)) {
      watchedState.form.feedback = { isFormValid: true, isRssExist: true };
      watchedState.form.processState = 'finished';
      inputEl.focus();
      return;
    }
    watchedState.form.processState = 'adding';
    watchedState.urls.push(watchedState.form.field.url);
    processFeeds(watchedState);

    watchedState.form.processState = 'finished';
    formEl.reset();
    inputEl.focus();
  });
};
