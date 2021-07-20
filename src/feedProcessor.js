import _ from 'lodash';
import axios from 'axios';
import parser from './parser.js';

export default (state) => _.forEach(state.urls, (url) => {
  const timer = 500000;
  // eslint-disable-next-line  no-param-reassign
  state.feeds = [];
  // eslint-disable-next-line  no-param-reassign
  state.posts = [];

  axios.get(`https://hexlet-allorigins.herokuapp.com/get?disableCache=true&url=${encodeURIComponent(url)}`).then((result) => {
    const id = _.uniqueId();
    const parsedFeed = parser(id, result.data.contents);
    const newFeed = {
      title: parsedFeed.title,
      description: parsedFeed.description,
      id,
    };
    state.feeds.push(newFeed);

    const refreshFeed = () => {
      axios.get(`https://hexlet-allorigins.herokuapp.com/get?disableCache=true&url=${encodeURIComponent(url)}`).then((res) => {
        const updatedFeed = parser(id, res.data.contents);
        console.log('hasPosts:', state.posts);
        console.log('updateFeedPosts:', updatedFeed.items);
        const newPosts = _.differenceWith(updatedFeed.items, state.posts,
          (v1, v2) => v1.url === v2.url);
        console.log('newPosts:', newPosts);
        // eslint-disable-next-line  no-param-reassign
        state.posts = _.union(state.posts, newPosts);
        newFeed.timerId = setTimeout(refreshFeed, timer);
      });
    };

    refreshFeed();
  });
});
