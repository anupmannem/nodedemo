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

  // get posts from instagram user - 
  // edges returns array of multiple objects
  let { entry_data: { ProfilePage: { [0]: { graphql: { user: { edge_owner_to_timeline_media: { edges } } } } } } } = JSON.parse(script_regex[1]);
  let posts = [];
  // iterating over edges array to get the posts  
  for (let edge of edges) {
    let { node } = edge;  // get node from each edge
    posts.push({
      id: node.id,     // get node id
      shortcode: node.shortcode,
      timestamp: node.taken_at_timestamp,
      likes: node.edge_liked_by.count,
      comments: node.edge_media_to_comment.count,
      video_views: node.video_view_count,
      caption: node.edge_media_to_caption.edges[0].node.text,
      image_url: node.display_url,
    });
  }
  // pick the required fields
  let instagram_data = {
    followers: user.edge_followed_by.count,
    following: user.edge_follow.count,
    uploads: user.edge_owner_to_timeline_media.count,
    full_name: user.full_name,
    picture_url: user.profile_pic_url_hd,
    posts,
  };

  console.log(instagram_data);
  // when using debugger, set a breakpoint at 
  // this debugger, and inspect elements 
  // debugger;
})();
