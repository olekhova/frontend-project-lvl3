import _, { uniqueId } from 'lodash';

export default (id, xml) => {
  const domparser = new DOMParser();
  const parsed = domparser.parseFromString(xml, 'application/xml');
  const feed = {};
  feed.items = _.map(parsed.querySelectorAll('item'), (element) => ({
    title: element.querySelector('title').textContent,
    description: element.querySelector('description').textContent,
    url: element.querySelector('link').textContent,
    feedId: id,
    id: uniqueId(),
  }));
  feed.title = parsed.querySelector('title').textContent;
  feed.description = parsed.querySelector('description').textContent;
  feed.id = id;
  console.log('feed', feed);
  return feed;
};
