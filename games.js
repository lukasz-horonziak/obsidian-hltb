// This script is based on `Movie & Series Script` prepared in QuickAdd API documentation.

const notice = msg => new Notice(msg, 5000);

// I'm not sure if this is the correct API URL, but it's the only one I could find 
const API_URL = "https://howlongtobeat.com/api/ouch/86d5ef1971943765";

module.exports = {
    entry: start,
    settings: {
        name: "HLTB Script",
        author: "LH"
    }
}

let QuickAdd;

async function start(params, _settings) {
    QuickAdd = params;

    const query = await QuickAdd.quickAddApi.inputPrompt("Enter game title: ");
    if (!query) {
        notice("No query entered.");
        throw new Error("No query entered.");
    }

    const results = await getSearchResults(query);

    const choice = await QuickAdd.quickAddApi.suggester(results.map(formatTitleForSuggestion), results);
    if (!choice) {
        notice("No choice selected.");
        throw new Error("No choice selected.");
    }

    const getGame = await hltbGetGameDetails(choice.game_id);
    const getGameDetails = getGame.props.pageProps.game.data.game[0];
    const gameCoverUrl = getGame.props.pageProps.pageMetadata.image;

    QuickAdd.variables = {
        title: getGameDetails.game_name,
        description: getGameDetails.profile_summary,
        developer: getGameDetails.profile_dev,
        released: getGameDetails.release_world,
        reviewScore: getGameDetails.review_score,
        coverUrl: gameCoverUrl,
        completionMain: roundHalf(parseInt(getGameDetails.comp_main_avg) / 3600),
        completionPlus: roundHalf(parseInt(getGameDetails.comp_plus_avg) / 3600),
        completion100: roundHalf(parseInt(getGameDetails.comp_100_avg) / 3600),
        genreLinks: linkifyList(getGameDetails.profile_genre.split(",")),
        publisherLinks: linkifyList(getGameDetails.profile_pub.split(",")),
        platformLinks: linkifyList(getGameDetails.profile_platform.split(",")),
        fileName: replaceIllegalFileNameCharactersInString(getGameDetails.game_name),
    }
}

function formatTitleForSuggestion(resultItem) {
    return `${resultItem.game_name} (${resultItem.release_world})`;
}

function roundHalf(num) {
  return Math.round(num);
}

async function getSearchResults(query) {
    const searchResults = await apiPost(API_URL, {
      "searchType": "games",
      "searchTerms": [
          `${query}`
      ],
      "searchPage": 1,
      "size": 20,
      "searchOptions": {
          "games": {
              "userId": 0,
              "platform": "",
              "sortCategory": "popular",
              "rangeCategory": "main",
              "rangeTime": {
                  "min": null,
                  "max": null
              },
              "gameplay": {
                  "perspective": "",
                  "flow": "",
                  "genre": "",
                  "difficulty": ""
              },
              "rangeYear": {
                  "min": "",
                  "max": ""
              },
              "modifier": ""
          },
          "users": {
              "sortCategory": "postcount"
          },
          "lists": {
              "sortCategory": "follows"
          },
          "filter": "",
          "sort": 0,
          "randomizer": 0
      },
      "useCache": true
    });

    if (!searchResults.data || !searchResults.data.length) {
        notice("No results found.");
        throw new Error("No results found.");
    }

    return searchResults.data;
}

function linkifyList(list) {
    if (list.length === 0) return "";
    if (list.length === 1) return `\n  - "[[${list[0]}]]"`;

    return list.map(item => `\n  - "[[${item.trim()}]]"`).join("");
}

function replaceIllegalFileNameCharactersInString(string) {
    return string.replace(/[\\,#%&\{\}\/*<>$\'\":@]*/g, '');
}

async function apiPost(url, data) {
    let finalURL = new URL(url);

    const res = await request({
        url: finalURL.href,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'origin': 'https://howlongtobeat.com',
            'referer': 'https://howlongtobeat.com/',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        },
        body: JSON.stringify(data),
    });

    return JSON.parse(res);
}

async function hltbGetGameDetails(gameId) {
  const res = await request({
    url: `https://howlongtobeat.com/game/${gameId}`,
    method: 'GET',
  });

  const parser = new DOMParser();
  const doc = parser.parseFromString(res, 'text/html');
  const data = doc.getElementById('__NEXT_DATA__').text;

  return JSON.parse(data);
}