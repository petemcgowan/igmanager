import { getFollowersFollowingsDiffs } from "./lib/scraper";
import { makePostLikersFile } from "./lib/scraper";
const { getPosts } = require("./posts_graphql");
import { getPostLikes } from "./likes";
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

getPostLikesMain();
//followersFollowings();
