import { finiteQuery } from "./helpers.js";
import { QUERY_IDS } from "../data/query_ids.js";

const { profileFollowersQueryId } = QUERY_IDS;

export async function getProfileFollowedBy(limit) {
  if (!limit) return undefined;
  console.log(
    `Loading users current profile followed by (limit ${limit} items).`
  );

  const nodeTransformationFunction = (data) => {
    if (!data.user)
      throw new Error(
        '"Followed by" GraphQL query does not contain user object'
      );
    if (!data.user.edge_followed_by)
      throw new Error(
        '"Followed by" GraphQL query does not contain edge_followed_by object'
      );
    const followedBy = data.user.edge_followed_by;
    console.log(
      "PMG:followedBy.page_info:" + JSON.stringify(followedBy.page_info)
    );
    const pageInfo = followedBy.page_info;
    const endCursor = pageInfo.end_cursor;
    const users = followedBy.edges.map((followedByItem) => {
      const { node } = followedByItem;
      return {
        id: node.id,
        full_name: node.full_name,
        username: node.username,
        profile_pic_url: node.profile_pic_url,
        is_private: node.is_private,
        is_verified: node.is_verified,
      };
    });
    return { nextPageCursor: endCursor, data: users };
  };

  // Pete Todo remove this hardcoding
  const variables = {
    id: 5525087531, // my user id not sure if this is number or string
    include_reel: false,
    fetch_mutual: false,
  };
  console.log("calling finiteQuery");
  return finiteQuery(
    profileFollowersQueryId,
    variables,
    nodeTransformationFunction,
    limit
  );
}
