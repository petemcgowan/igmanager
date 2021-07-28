import { getProfileFollowedBy } from "../server/followed_by.js";
import { getProfileFollowing } from "../server/following.js";
import { getPostLikes } from "../server/likes.js";

import fs from "fs";

// TODO remember this will break(in time) when names change, but IDs don't.  It's IDs you want to check long-term

export async function makePostLikersFile(likersArray) {
  // *************************************************************
  // ***Likers***
  // *************************************************************

  // LIVE
  //const postLikes =  await getPostLikes(2000);
  // Writing to Likers JSON file
  let likersJsonWS = fs.createWriteStream(
    `json/IGLikers_` + getDateString() + ".json"
  );
  likersJsonWS.write(JSON.stringify(likersArray));
  likersJsonWS.end();
  // Write Likers Text file
  let likersWS = fs.createWriteStream(
    `txt/IGLikers_` + getDateString() + ".txt"
  );
  likersArray.forEach(function output(item, index, array) {
    // console.log("likerItem:" + JSON.stringify(item));
    likersWS.write(
      `${item.username}, ${item.shortcode}, ${item.id}, ${item.postDate}, ${item.postCaption}\n`
    );
  });
  likersWS.end();
  // ***NON-LIVE***
  // likersArray = fs.readFileSync('txt/IGLikers_2020-06-02.txt').toString().split("\n");;
}

export async function getFollowersOnly() {
  // *************************************************************
  // ***Followers***
  // *************************************************************
  var followersArray = [];
  // LIVE
  const followedBy = await getProfileFollowedBy(4800);
  //const followedBy = await getProfileFollowedBy(1);
  // Writing to followers JSON file
  let followersNamesJsonWS = fs.createWriteStream(
    `json/IGFollowersOnly_` + getDateString() + ".json"
  );
  followersNamesJsonWS.write(JSON.stringify(followedBy));
  followersNamesJsonWS.end();
  // Write Followers Text file
  let followerNamesWS = fs.createWriteStream(
    `txt/IGFollowersOnly_` + getDateString() + ".txt"
  );
  followedBy.forEach(function output(item, index, array) {
    console.log("followedByitem:" + JSON.stringify(item));
    followerNamesWS.write(`${item.username}\n`);
    followersArray.push(item.username);
  });
  followerNamesWS.end();
}

export async function getFollowersFollowingsDiffs() {
  // *************************************************************
  // ***Followers***
  // *************************************************************
  var followersArray = [];
  // LIVE
  const followedBy = await getProfileFollowedBy(4900);
  // Writing to followers JSON file
  let followersNamesJsonWS = fs.createWriteStream(
    `json/IGFollowers_` + getDateString() + ".json"
  );
  followersNamesJsonWS.write(JSON.stringify(followedBy));
  followersNamesJsonWS.end();
  // Write Followers Text file
  let followerNamesWS = fs.createWriteStream(
    `txt/IGFollowers_` + getDateString() + ".txt"
  );
  followedBy.forEach(function output(item, index, array) {
    console.log("followedByitem:" + JSON.stringify(item));
    followerNamesWS.write(`${item.username}\n`);
    followersArray.push(item.username);
  });
  followerNamesWS.end();
  // ***NON-LIVE***
  // followersArray = fs.readFileSync('txt/IGFollowers_2020-06-02.txt').toString().split("\n");;

  // *************************************************************
  // ***Followings***
  // *************************************************************
  var followingsArray = [];
  // LIVE
  const following = await getProfileFollowing(2000);
  // //Writing to followings JSON file
  let followingNamesJsonWS = fs.createWriteStream(
    `json/IGFollowing_` + getDateString() + ".json"
  );
  followingNamesJsonWS.write(JSON.stringify(following));
  followingNamesJsonWS.end();
  // //Writing to followings TEXT file
  let followingNamesTxtWS = fs.createWriteStream(
    `txt/IGFollowing_` + getDateString() + ".txt"
  );
  following.forEach(function output(item, index, array) {
    console.log("followingitem:" + JSON.stringify(item));
    followingNamesTxtWS.write(`${item.username}\n`);
    followingsArray.push(item.username);
  });
  followingNamesTxtWS.end();
  // ***NON-LIVE***
  // followingsArray = fs.readFileSync('txt/IGFollowing_2020-06-02.txt').toString().split("\n");

  // *************************************************************
  // ***Naughty Step**
  // *************************************************************
  // Who am I following, that isn't following back?
  let naughtyNamesWS = fs.createWriteStream(
    "txt/IGNaughtyStep_" + getDateString() + ".txt"
  );
  followingsArray.forEach(function output(item, index, array) {
    // item should be username
    if (!followersArray.includes(item)) {
      console.log("Naughty:" + item);
      naughtyNamesWS.write(`${item}\n`);
    }
  });
  naughtyNamesWS.end();
}

// Day in file name
function getDateString() {
  const date = new Date();
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}
