import './scss/app.scss';
import * as yup from 'yup';
import { setLocale } from 'yup';
import i18next from 'i18next';
import _ from 'lodash';
import axios from 'axios';

import view from './view.js';
import processFeeds from './feedProcessor.js';
import resources from './locales';
import parser from './parser.js';

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
    },
    error: '',
    urls: [],
    feeds: [],
    posts: [],
  };

  const watchedState = view(state, i18nInstance);

  formEl.addEventListener('submit', (e) => {
    e.preventDefault();
    watchedState.error = '';
    const formData = new FormData(e.target);
    watchedState.form.field.url = formData.get('url');

    const errorsUrl = validate(watchedState.form.field);
    if (!_.isEqual(errorsUrl, {})) {
      watchedState.error = 'invalidUrl';
      watchedState.form.processState = 'finished';
      inputEl.focus();
      return;
    }
    if (watchedState.urls.includes(watchedState.form.field.url)) {
      watchedState.error = 'alreadyExists';
      watchedState.form.processState = 'finished';
      inputEl.focus();
      return;
    }
    watchedState.form.processState = 'adding';
    watchedState.error = 'ok';
    // check url
    axios.get(`https://hexlet-allorigins.herokuapp.com/get?disableCache=true&url=${encodeURIComponent(watchedState.form.field.url)}`)
      .then((result) => {
        const id = _.uniqueId();
        const parsedFeed = parser(id, result.data.contents);
        if (_.has(parsedFeed, 'title') && _.has(parsedFeed, 'description')) {
          watchedState.urls.push(watchedState.form.field.url);
          watchedState.form.processState = 'finished';
          watchedState.error = '';
          processFeeds(watchedState);
          formEl.reset();
          inputEl.focus();
        }
      })
      .catch(() => {
        watchedState.error = 'invalidRSS';
        formEl.reset();
        inputEl.focus();
      });
  });
};
