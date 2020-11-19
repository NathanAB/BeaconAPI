const Router = require('express-promise-router');

const { fetchThumbnail } = require('../../../utils/instagram');

const router = new Router();

// API route to pull instagram thumbnails
router.get('/:imageId', async (req, res) => {
  const { imageId } = req.params;
  const imageUrl = await fetchThumbnail(imageId);
  if (imageUrl) {
    res.json(imageUrl);
  } else {
    res.sendStatus(400);
  }
});

module.exports = router;
