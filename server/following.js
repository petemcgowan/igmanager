import { finiteQuery } from "./helpers.js";
import { QUERY_IDS } from "../data/query_ids.js";
import { igconfig_variables } from "../config/igconfig_variables.js";

const { profileFollowingQueryId } = QUERY_IDS;

export async function getProfileFollowing(limit) {
  if (!limit) return undefined;
  console.log(`Loading users current profile follows (limit ${limit} items).`);

  const nodeTransformationFunction = (data) => {
    if (!data.user)
      throw new Error('"Following" GraphQL query does not contain user object');
    if (!data.user.edge_follow)
      throw new Error(
        '"Following" GraphQL query does not contain edge_follow object'
      );
    const following = data.user.edge_follow;
    console.log(
      "PMG:following.page_info:" + JSON.stringify(following.page_info)
    );
    const pageInfo = following.page_info;
    const endCursor = pageInfo.end_cursor;
    const users = following.edges.map((followingItem) => {
      const { node } = followingItem;
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

  const variables = {
    id: igconfig_variables.followingId,
    include_reel: false,
    fetch_mutual: false,
  };
  console.log("calling finiteQuery");
  return finiteQuery(
    profileFollowingQueryId,
    variables,
    nodeTransformationFunction,
    limit
  );
}
