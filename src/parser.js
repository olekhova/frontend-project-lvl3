import _ from 'lodash';

export default (id, xml) => {
  const domparser = new DOMParser();
  try {
    const parsed = domparser.parseFromString(xml, 'application/xml');
    console.log('parsed xml:', parsed);
    const feed = {};
    feed.items = _.map(parsed.querySelectorAll('item'), (element) => ({
      title: element.querySelector('title').textContent,
      description: element.querySelector('description').textContent,
      url: element.querySelector('link').textContent,
      feedId: id,
      id: _.uniqueId(),
      isVisited: false,
    }));
    feed.title = parsed.querySelector('title').textContent;
    feed.description = parsed.querySelector('description').textContent;
    feed.id = id;
    return feed;
  } catch (exception) {
    console.log('error parsing xml: ', exception);
    throw new Error(`error parsing xml: ${exception}`);
  }
};
