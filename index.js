const request = require('request-promise');
const cheerio = require('cheerio');
const fs = require('fs');

// movie - The Silence of the Lambs
const URLS = [
  'https://www.imdb.com/title/tt0102926/?ref_=nv_sr_1',
  'https://www.imdb.com/title/tt2267998/?ref_=nv_sr_1',
];

(async () => {
  let moviesData = [];

  for (let movie of URLS) {
    const response = await request({
      uri: movie,
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
    // load response into cheerio library
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
      // push each genre into the array
      const genre = $(elm).text();
      // get the individual genre names
      genres.push(genre);
    });

    // pushing scrapped info to movies array
    moviesData.push({
      title,
      rating,
      poster,
      totalRatings,
      releaseDate,
      genres,
    });
  }

  // write the movies data to a JSON file
  // sync will tell node to wait for this
  // to finish first, before moving ahead
  fs.writeFileSync('./data.json', JSON.stringify(moviesData), 'utf-8');

  console.log(moviesData);
})();
