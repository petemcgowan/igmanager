// const { CookieJar } = require('tough-cookie')
import got from "got";
import fs from "fs";
import { igconfig } from "../config/igconfig.js";

import { URLSearchParams } from "url";

const grapqlEndpoint = "https://www.instagram.com/graphql/query/";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getGotParams() {
  const cookieString = igconfig.cookieString;

  return {
    headers: {
      authority: "www.instagram.com",
      "cache-control": "max-age=0",
      "upgrade-insecure-requests": "1",
      // 'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Safari/537.36',
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36",
      accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
      "sec-fetch-site": "cross-site",
      "sec-fetch-mode": "navigate",
      "sec-fetch-user": "?1",
      "sec-fetch-dest": "document",
      "accept-language": "en-US,en;q=0.9",
      cookie: cookieString,
    },
    json: true,
  };
}

export async function finiteQuery(
  queryId,
  variables,
  nodeTransformationFunc,
  limit
) {
  const gotParams = await getGotParams();

  console.log(`Loading up to ${limit} items`);
  let hasNextPage = true;
  let endCursor = null;
  let results = [];
  while (hasNextPage && results.length < limit) {
    const queryParams = {
      query_hash: queryId,
      variables: {
        ...variables,
        first: 30,
      },
    };
    if (endCursor) {
      queryParams.variables.after = endCursor;
    }
    const searchParams = new URLSearchParams([
      ["query_hash", queryParams.query_hash],
      ["variables", JSON.stringify(queryParams.variables)],
    ]);
    console.log("PMG:searchParams:" + searchParams);

    console.log("calling query");
    const { nextPageCursor, data } = await query(
      gotParams,
      searchParams,
      nodeTransformationFunc
    );
    // console.log("returned from query, nextPageCursor:" + nextPageCursor);

    data.forEach((result) => results.push(result));

    if (nextPageCursor && results.length < limit) {
      endCursor = nextPageCursor;
      console.log(`So far loaded ${results.length} items`);
    } else {
      hasNextPage = false;
    }
    console.log(
      "END WHILE:hasNextPage:" +
        hasNextPage +
        ", results.length:" +
        results.length +
        ", limit:" +
        limit +
        ", endCursor:" +
        endCursor +
        ", nextPageCursor:" +
        nextPageCursor
    );
  }
  console.log("-------------------------------");
  console.log(`Finished loading ${results.length} items`);
  console.log("-------------------------------");

  return results.slice(0, limit);
}

function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

async function query(gotParams, searchParams, nodeTransformationFunc) {
  try {
    console.log("Sleeping for 2-5 seconds...");
    await sleep(randomIntFromInterval(2300, 6300));
    const { body } = await got(
      `${grapqlEndpoint}?${searchParams.toString()}`,
      gotParams
    );
    if (!body.data) throw new Error(`GraphQL query does not contain data`);
    return nodeTransformationFunc(body.data);
  } catch (error) {
    console.log("Error in Query:" + error);
  }

  ////////////////////////////////////////////////
  // let jsonResponse = await axios({
  //     method: 'GET',
  //     url: `${grapqlEndpoint}?${searchParams.toString()}`,
  //     // url: urlPart,
  //     headers: headerParam
  // })
  // .then( function (response) {
  //     console.log('calling nodeTransformationFunc');
  //     if (!response.data.data) throw new Error(`GraphQL query does not contain data`);
  //         return  nodeTransformationFunc(response.data.data);
  // })
  // // }
  // .catch(function (error) {
  //     // handle error
  //     console.log(error);
  // });

  console.log(`Could not load more items`);
  return { nextPageCursor: null, data: [] };
}

/**
 * Takes page type and outputs variable that must be present in graphql query
 * @param {String} pageType
 */
export const getCheckedVariable = (pageType) => {
  switch (pageType) {
    case PAGE_TYPES.PLACE:
      return "%22id%22";
    case PAGE_TYPES.PROFILE:
      return "%22id%22";
    case PAGE_TYPES.HASHTAG:
      return "%22tag_name%22";
    case PAGE_TYPES.POST:
      return "%22shortcode%22";
    default:
      throw new Error("Not supported");
  }
};
