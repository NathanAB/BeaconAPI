const fetch = require('node-fetch');

const fb = {
  id: process.env.FACEBOOK_CLIENT_ID || console.error('Missing Facebook client id!'),
  secret: process.env.FACEBOOK_CLIENT_SECRET || console.error('Missing Facebook client secret!'),
};

const fetchThumbnail = async (imageId) => {
  const url = `https://graph.facebook.com/instagram_oembed?url=https://www.instagram.com/p/${imageId}/&access_token=${fb.id}|${fb.secret}&fields=thumbnail_url`;
  const res = await fetch(url);
  const json = await res.json();
  const imageUrl = json.thumbnail_url;
  return imageUrl;
};

module.exports = {
  fetchThumbnail,
};
