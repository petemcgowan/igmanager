import { finiteQuery } from "./helpers.js";
import { QUERY_IDS } from "../data/query_ids.js";
import { igconfig_variables } from "../config/igconfig_variables.js";

const { profilePostsQueryId } = QUERY_IDS;

export async function getPosts(/*page, input, */ limit) {
  //const limit = input.resultsLimit;
  //if (!limit) return [];
  console.log(`Loading posts (limit ${limit} items).`);

  const nodeTransformationFunction = (data) => {
    let timeline;
    if (!data.user)
      throw new Error('"Posts" GraphQL query does not contain user');
    if (!data.user.edge_owner_to_timeline_media)
      throw new Error(
        '"Posts" GraphQL query does not contain edge_owner_to_timeline_media'
      );
    timeline = data.user.edge_owner_to_timeline_media;

    const pageInfo = timeline.page_info;
    const endCursor = pageInfo.end_cursor;
    const posts = timeline.edges.map((post) => post.node);
    return { nextPageCursor: endCursor, data: posts };
  };

  let queryId = profilePostsQueryId;

  if (
    !igconfig_variables.instagramId ||
    igconfig_variables.instagramId == undefined
  )
    throw new Error(
      "Instagram Id is not initialized, fill in the necessary config value"
    );

  let query = { id: igconfig_variables.instagramId };
  console.log("query:" + JSON.stringify(query));

  return finiteQuery(queryId, query, nodeTransformationFunction, limit);
}
