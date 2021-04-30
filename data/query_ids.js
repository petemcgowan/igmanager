import got from "got";

export let QUERY_IDS = {
  postCommentsQueryId: "97b41c52301f77ce508f55e66d17620e",
  postLikesQueryId: "d5d763b1e2acf209d62d22d184488e57",
  placePostsQueryId: "1b84447a4d8b6d6d0426fefb34514485",
  hashtagPostsQueryId: "174a5243287c5f3a7de741089750ab3b",
  profilePostsQueryId: "58b6785bea111c67129decbe6a448951",
  profileFollowingQueryId: "d04b0a864b4b54837c0d870b0e77e076",
  profileFollowersQueryId: "c76146de99bb02f6415203be841dd25a",
  profileChannelQueryId: "bc78b344a68ed16dd5d7f264681c4c76",
  profileTaggedQueryId: "ff260833edf142911047af6024eb634a",
  postQueryId: "fead941d698dc1160a298ba7bec277ac",
};

// async function initQueryIds() {
//     try {
//         const queryIdsUrl = 'https://api.apify.com/v2/key-value-stores/pPFcCAtcn7MoDfXpk/records/query-ids.json?disableRedirect=true';
//         const { body } = await got(queryIdsUrl, { json: true });
//         QUERY_IDS = body;
//     } catch (error) {
//         await Apify.utils.log.error('Could not get current query ids, using the predefined ones.');
//     }
// }
