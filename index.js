const fetch = require('node-fetch');
const cheerio = require('cheerio');

async function getPostData(path) {
  // Replace this with the domain of your WordPress site
  const wordpressDomain = 'example.wordpress.com';

  // Build the WordPress URL to fetch the post data
  const url = `https://${wordpressDomain}${path}`;

  // Fetch the WordPress post data
  const response = await fetch(url);
  const html = await response.text();
  const $ = cheerio.load(html);

  const title = $('meta[property="og:title"]').attr('content');
  const description = $('meta[property="og:description"]').attr('content');
  const image = $('meta[property="og:image"]').attr('content');

  return { title, description, image };
}

module.exports = async (req, res) => {
  const path = req.url;

  try {
    const { title, description, image } = await getPostData(path);

    // Redirect to the WordPress URL with the meta tags as query parameters
    const redirectUrl = `https://example.wordpress.com${path}?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}&image=${encodeURIComponent(image)}`;
    res.redirect(301, redirectUrl);
  } catch (error) {
    // If the WordPress URL doesn't exist, return a 404 error
    res.status(404).send('Page not found');
  }
};
