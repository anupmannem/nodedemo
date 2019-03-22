const request = require('request-promise');
const cheerio = require('cheerio');

// movie - The Silence of the Lambs
const URL = 'https://www.imdb.com/title/tt0102926/?ref_=nv_sr_1';

(async () => {
  const response = await request({
    uri: URL,
    // request header for the page
    // using the header with request library
    // we spoof our application as a browser
    header: {
      'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
      'accept-encoding': 'gzip, deflate, br',
      'accept-language': 'en-US,en;q=0.9',
      'cache-control': 'max-age=0',
      'referer': 'https://www.imdb.com/',
      'upgrade-insecure-requests': '1',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36',
    },
    // telling request library to use gzip to
    // decompress response if given in gzip format (optional)
    // to findout if a website is using compression in response
    // use developer tools and look for content-encoding property
    // under response headers
    gzip: true,
  });
  let $ = cheerio.load(response);
  // get title from h1
  const title = $('div[class="title_wrapper"] > h1').text();
  // excepted output - The Silence of the Lambs (1991)
  const rating = $('span[itemprop="ratingValue"]').text();
  console.log(title, rating);
})();
