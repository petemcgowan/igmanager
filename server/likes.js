import { finiteQuery } from "./helpers.js";
import { QUERY_IDS } from "../data/query_ids.js";

const { postLikesQueryId } = QUERY_IDS;

export async function getPostLikes(limit, postShortcode, likersArray) {
  if (!limit) return [];
  console.log(`Loading users who liked the post (limit  ${limit} items).`);

  const nodeTransformationFunction = (data) => {
    if (!data.shortcode_media)
      throw new Error(
        "Liked by GraphQL query does not contain shortcode_media"
      );
    if (!data.shortcode_media.edge_liked_by)
      throw new Error("Liked by GraphQL query does not contain edge_liked_by");

    const likedBy = data.shortcode_media.edge_liked_by;
    const pageInfo = likedBy.page_info;
    const endCursor = pageInfo.end_cursor;
    const likes = likedBy.edges.map((like) => {
      const { node } = like;
      var likeLine = {
        username: node.username,
        shortcode: postShortcode,
        id: node.id,
        // full_name: node.full_name,
        // profile_pic_url: node.profile_pic_url,
        // is_private: node.is_private,
        // is_verified: node.is_verified,
      };
      likersArray.push(likeLine);
      return likeLine;
    });
    return { nextPageCursor: endCursor, data: likes };
  };

  const variables = {
    // shortcode: 2312756487149320412,  //ID of post, not sure why I thought it was this, it was always shortcode
    shortcode: postShortcode,
    include_reel: false,
  };

  return finiteQuery(
    postLikesQueryId,
    variables,
    nodeTransformationFunction,
    limit
  );
}
