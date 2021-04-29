import {
  getFollowersFollowingsDiffs,
  makePostLikersFile,
} from "./lib/scraper.js";
import { getPosts } from "./server/posts_graphql.js";
import { getPostLikes } from "./server/likes.js";
import axios from "axios";

async function getPostLikesMain() {
  console.time("getPosts");
  // Pete todo un-harcode this limit to 250
  const posts = await getPosts(1); // specifiy limit here
  console.time("getPostLikesAll");

  var likersArray = [];
  var counter = 0;
  const dataforLikeFile = 0;

  for (let post of posts) {
    //console.log("postEl:" + JSON.stringify(postEl));
    counter++;
    console.log("getPostLikesCounter:" + counter);
    console.time("getPostLikes" + counter);
    await getPostLikes(1100, post.shortcode, likersArray);
    console.timeEnd("getPostLikes" + counter);
    //console.log('postLikes:' + JSON.stringify(postLikes));
    // likesArray.push(postLikes);
  }
  console.timeEnd("getPostLikesAll");

  await makePostLikersFile(likersArray);
  console.log("likersArray:" + JSON.stringify(likersArray));
}

async function followersFollowings() {
  const jsonData = await getFollowersFollowingsDiffs();
}

// Main entry point to the application
getPostLikesMain();
//followersFollowings();
