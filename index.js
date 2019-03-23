const request = require('request-promise');
const cheerio = require('cheerio');

(async () => {
  // identify the account to scrap
  const USERNAME = 'willsmith';
  const BASE_URL = `https://instagram.com/${USERNAME}`;

  // make a request to get the account
  let response = await request(BASE_URL);
  // load the response to cheerio library
  let $ = cheerio.load(response);
  // get the script tag from html for javascript (which contains)
  // json information and return as html
  let script = $('script[type="text/javascript"]').eq(3).html();
  let script_regex = /window._sharedData = (.+);/g.exec(script);

  // parse through object.entry_data.ProfilePage[0].graphql.user
  // using es6 destructuing to get user property
  let { entry_data: { ProfilePage: { [0]: { graphql: { user } } } } } = JSON.parse(script_regex[1]);
  // pick the required fields
  let instagram_data = {
    followers: user.edge_followed_by.count,
    following: user.edge_follow.count,
    uploads: user.edge_owner_to_timeline_media.count,
    full_name: user.full_name,
    picture_url: user.profile_pic_url_hd,
  };

  console.log(instagram_data);
})();
