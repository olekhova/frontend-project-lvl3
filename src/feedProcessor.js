import _, { uniqueId } from 'lodash';
import axios from 'axios';
import parser from './parser.js';

export default (state) => _.forEach(state.urls, (url) => {
  // console.log('processing:', feed);
  // eslint-disable-next-line  no-param-reassign
  state.feeds = [];
  // eslint-disable-next-line  no-param-reassign
  state.posts = [];

  axios.get(`https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(url)}`).then((result) => {
    // console.log('Фид получен:', result.data.contents);
    const id = uniqueId();
    const parsedFeed = parser(id, result.data.contents);
    // eslint-disable-next-line  no-param-reassign
    state.feeds.push({ title: parsedFeed.title, description: parsedFeed.description, id });
    // eslint-disable-next-line  no-param-reassign
    state.posts = [...state.posts, ...parsedFeed.items];
    // console.log('new state:', state);
  });
});
