const requestPromise = require('request-promise');
const cheerio = require('cheerio');
const fs = require('fs');
const Json2csvParser = require('json2csv').Parser;
const request = require('request');

/*
  request library vs reques-promise
  request library original node library for handling
  requests.
  request-promise is wrap around the request library
  providing async await syntax
*/

// movie - The Silence of the Lambs
// restructuring from array to object
// useful when we want them to be dynamic
const URLS = [
  {
    url: 'https://www.imdb.com/title/tt0102926/?ref_=nv_sr_1',
    id: 'the_silence_of_the_lambs',
  },
  {
    url: 'https://www.imdb.com/title/tt2267998/?ref_=nv_sr_1',
    id: 'gone_girl',
  },
];

(async () => {
  let moviesData = [];

  for (let movie of URLS) {
    const response = await requestPromise({
      uri: movie.url,
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

    // get movie poster to local storage
    // to download any file, first create a file stream
    let file = fs.createWriteStream(`${movie.id}.jpg`);
    // making request for the poster
    // using promises
    await new Promise((resolve, reject) => {
      let stream = request({
        uri: poster,
        header: {
          'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
          'accept-encoding': 'gzip, deflate, br',
          'accept-language': 'en-US,en;q=0.9',
          'cache-control': 'max-age=0',
          'upgrade-insecure-requests': '1',
          'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36',
        },
        gzip: true,
      })
        .pipe(file)
        .on('finish', () => { // finish listener event to notify when download finishes
          console.log(`finished downloading the image ${movie.id}`);
          resolve();
        })
        .on('error', () => { // error listener event to reject the promise and throw an error
          reject(error);
        });
    })
      // catch the error thrown by rejecting the promise
      .catch((error) => console.log(`error while downloading ${movie.id} - ${error}`));
    // write the movies data to a JSON file
    // sync will tell node to wait for this
    // to finish first, before moving ahead
    // fs.writeFileSync('./data.json', JSON.stringify(moviesData), 'utf-8');

    // writing to CSV format
    // pick the fields to write to csv file
    // if you choose to get all fields, then this fields is not needed
    // const fields = ['title', 'rating'];
    // pass the fields to the json2csvParser
    // and parse the moviesData for those fields
    // const json2csvParser = new Json2csvParser({ fields });
    // const csv = json2csvParser.parse(moviesData);
    // write to csv file
    // fs.writeFileSync('./data.csv', csv, 'utf-8');
    // console.log(csv);
  }
})();
