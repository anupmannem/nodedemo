const request = require('request-promise');
const cheerio = require('cheerio');

// movie - The Silence of the Lambs
const URL = 'https://www.imdb.com/title/tt0102926/?ref_=nv_sr_1';

(async () => {
  const response = await request(URL);
  let $ = cheerio.load(response);
  // get title from h1
  let title = $('div[class="title_wrapper"] > h1').text();
  // excepted output - The Silence of the Lambs (1991)
  let rating = $('span[itemprop="ratingValue"]').text();
  console.log(title, rating);
})();
