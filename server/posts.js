import { PAGE_TYPES, GRAPHQL_ENDPOINT }  from("../data/consts.js");
import { getPosts } from ("./posts_graphql.js");

const initData = {};
const posts = {};

/***
 * IMPORTANT Am I ever gonna need this file?  Can I just get rid of it?  I haven't ran it, and I don't think I'm calling it...
 *
 */

/**
 * Takes type of page and data loaded through GraphQL and outputs
 * correct list of posts based on the page type.
 * @param {String} pageType Type of page we are scraping posts from
 * @param {Object} data GraphQL data
 */
const getPostsFromGraphQL = (data) => {
  let timeline = data && data.user && data.user.edge_owner_to_timeline_media;

  const postItems = timeline ? timeline.edges : [];
  const hasNextPage = timeline ? timeline.page_info.has_next_page : false;
  return { posts: postItems, hasNextPage };
};

export const scrapePost = (request, itemSpec, entryData) => {
  const item = entryData.PostPage[0].graphql.shortcode_media;

  return {
    "#debug": {
      ...Apify.utils.createRequestDebugInfo(request),
      ...itemSpec,
      shortcode: item.shortcode,
      postLocationId: (item.location && item.location.id) || null,
      postOwnerId: (item.owner && item.owner.id) || null,
    },
    alt: item.accessibility_caption,
    url: `https://www.instagram.com/p/${item.shortcode}`,
    likesCount: item.edge_media_preview_like.count,
    imageUrl: item.display_url,
    firstComment:
      item.edge_media_to_caption.edges[0] &&
      item.edge_media_to_caption.edges[0].node.text,
    timestamp: new Date(parseInt(item.taken_at_timestamp, 10) * 1000),
    locationName: (item.location && item.location.name) || null,
    ownerUsername: (item.owner && item.owner.username) || null,
  };
};

