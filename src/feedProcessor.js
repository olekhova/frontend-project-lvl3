import _ from 'lodash';
import axios from 'axios';

export default (feeds) => {

  _.forEach(feeds, feed => {
    console.log('processing:', feed);
    axios.get(feed).then( result=> {
      console.log('Фид получен:', result);
    })
  });


  return [];
}