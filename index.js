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
  const title = $('div[class="title_wrapper"] > h1').text().trim();
  // excepted output - The Silence of the Lambs (1991)
  const rating = $('span[itemprop="ratingValue"]').text();
  // get poster img link
  const poster = $('div[class="poster"] > a > img').attr('src');
  // get total ratings for the movie
  // using javascript, document.querySelector('.imdbRating').children[1].firstChild.innerText
  const totalRatings = $('div[class="imdbRating"] > a').text();
  // get the release date
  const releaseDate = $('a[title="See more release dates"]').text().trim();
  // get genres for the movie in an array
  const genres = [];
  $('div[class="subtext"] a[href^="/search/"]').each((i, elm) => {
<<<<<<< HEAD
    // get the individual genre names
    const genre = $(elm).text();
    // push each genre into the array
=======
    const genre = $(elm).text();
    // get the individual genre names
>>>>>>> 81699022733442529bdc41cb3cc8c9116eda1cca
    genres.push(genre);
  });
  console.log(`Title: ${title}`);
  console.log(`Ratings: ${rating}`);
  console.log(`Poster: ${poster}`);
  console.log(`Total Ratings: ${totalRatings}`);
  console.log(`Release Date: ${releaseDate}`);
  console.log(`Genres: ${genres}`);
})();
