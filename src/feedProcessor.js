import _ from 'lodash';
import axios from 'axios';
import parser from './parser.js';

export default (state) => _.forEach(state.urls, (url) => {
  const timer = 5000;
  // eslint-disable-next-line  no-param-reassign
  state.feeds = [];
  // eslint-disable-next-line  no-param-reassign
  state.posts = [];
  // eslint-disable-next-line  no-param-reassign
  state.error = '';

  axios.get(`https://hexlet-allorigins.herokuapp.com/get?disableCache=true&url=${encodeURIComponent(url)}`)
    .then((result) => {
      const id = _.uniqueId();
      const parsedFeed = parser(id, result.data.contents);
      const newFeed = {
        title: parsedFeed.title,
        description: parsedFeed.description,
        id,
      };
      state.feeds.push(newFeed);
      console.log('feeds:', state.feeds);

      const refreshFeed = () => {
        axios.get(`https://hexlet-allorigins.herokuapp.com/get?disableCache=true&url=${encodeURIComponent(url)}`)
          .then((res) => {
            const updatedFeed = parser(id, res.data.contents);
            const newPosts = _.differenceWith(updatedFeed.items, state.posts,
              (v1, v2) => v1.url === v2.url);
            // eslint-disable-next-line  no-param-reassign
            state.posts = _.union(state.posts, newPosts);
            newFeed.timerId = setTimeout(refreshFeed, timer);
          })
          .catch((err) => {
            // Очередное обновление фида не сработало
            console.log('error inner get:', err);
          });
      };

      refreshFeed();
    })
    .catch((err) => {
      // eslint-disable-next-line  no-param-reassign
      state.error = 'invalidRSS';
      console.log('error 1 get:', err);
    });
});
