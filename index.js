import {
  getFollowersFollowingsDiffs,
  getFollowersOnly,
  makePostLikersFile,
} from "./lib/scraper.js";
import { getPosts } from "./server/posts_graphql.js";
import { getPostLikes } from "./server/likes.js";
import axios from "axios";

async function getPostLikesMain() {
  console.time("getPosts");
  // Pete todo un-harcode this limit to 300
  const posts = await getPosts(300); // specifiy limit here
  console.time("getPostLikesAll");
  // Bl4BmJigDiD
  console.log("The number of posts retrieved is: " + posts.length);
  var likersArray = [];
  var counter = 0;

  //Pete Todo: obviously this should be json or command line driven config
  let notBeforeDate = new Date("December 20, 2019");
  console.log("notBeforeDate:" + JSON.stringify(notBeforeDate));
  console.log(notBeforeDate.getTime());
  console.log(notBeforeDate);

  for (let post of posts) {
    const postCaption = post.edge_media_to_caption.edges[0].node.text;
    console.log("post:" + JSON.stringify(postCaption));
    console.log(
      "post.taken_at_timestamp:" + JSON.stringify(post.taken_at_timestamp)
    );
    // have to multiply by 1000 to convert it
    let jsTimestamp = post.taken_at_timestamp * 1000;
    let postDate = new Date(jsTimestamp);
    console.log("postDate" + JSON.stringify(postDate));
    // if (postDate < notBeforeDate) {
    counter++;
    console.log("getPostLikesCounter:" + counter);
    await getPostLikes(
      1100,
      post.shortcode,
      postDate.toDateString(),
      // Pete todo I haven't tested this!  But this will hopefully remove line breaks from the text
      // Pete todo also commas are gonna be misinterpreted as columns here so strip them out of the text
      postCaption.slice(0, 70).replace(/(\r\n|\n|\r)/gm, " "),
      likersArray
    );
    // }
  }

  await makePostLikersFile(likersArray);
  // console.log("likersArray:" + JSON.stringify(likersArray));
}

async function followersFollowings() {
  const jsonData = await getFollowersFollowingsDiffs();
}

async function followersOnly() {
  const jsonData = await getFollowersOnly();
}

// Main entry point to the application
//getPostLikesMain();
followersFollowings();
// followersOnly();
