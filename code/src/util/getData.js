import axios from 'axios';

function getStratz(gql, config) {
  return axios({
    url: 'https://api.stratz.com/graphql',
    method: 'post',
    headers: {
      "Accept": "*/*",
      "Accept-Language": "zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2",
      "content-type": "application/json",
      "authorization": `Bearer ${config.token}`
    },
    data: gql,
  })
}

const wait = (time) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  })
}

async function getDetail(id, config) {
  const gql = `{"operationName":"GetMatchMapsVision","variables":{"id":${id}},"query":"query GetMatchMapsVision($id: Long\u0021) {\\n  match(id: $id) {\\n  players {\\n      playerSlot\\n position\\n           steamAccount {\\n        id\\n      }\\n       }\\n    playbackData {\\n      wardEvents {\\n        indexId\\n        time\\n        positionX\\n        positionY\\n        wardType\\n        action\\n        fromPlayer\\n        playerDestroyed\\n        __typename\\n      }\\n   }\\n       }\\n  }\\n"}`;

  try {
    const { data } = await getStratz(gql, config);
    return data.data.match;
  } catch {
    return null;
  }
}

async function getList(config, log) {
  let allList = [];
  const request = async (before) => {
    try {
      let gql;
      if (before) {
        gql = `{"operationName":"PlayerMatchesSummary","variables":{"steamId":${config.id},"request":{"before": ${before},"startDateTime":${config.start},"endDateTime":${config.end},"skip":0,"take":20}},"query":"query PlayerMatchesSummary($request: PlayerMatchesRequestType!, $steamId: Long!) {\\n  player(steamAccountId: $steamId) {\\n    steamAccountId\\n    matches(request: $request) {\\n id \\n endDateTime \\n}\\n}\\n}   "} `;
      } else {
        gql = `{"operationName":"PlayerMatchesSummary","variables":{"steamId":${config.id},"request":{"startDateTime":${config.start},"endDateTime":${config.end},"skip":0,"take":20}},"query":"query PlayerMatchesSummary($request: PlayerMatchesRequestType!, $steamId: Long!) {\\n  player(steamAccountId: $steamId) {\\n    steamAccountId\\n    matches(request: $request) {\\n id \\n endDateTime \\n}\\n}\\n}   "} `;
      }
      const list = await getStratz(gql, config).then((res) => {
        return res.data.data.player.matches;
      });
      return list;
    } catch (e) {
      console.log(e);
      return [];
    }
  }
  log('获取第1页');
  let result = await request();
  let i = 0;
  while (result.length) {
    i+=1;
    log(`获取第${i+1}页`);
    allList = allList.concat(result);
    await wait(1000);
    result = await request(allList[allList.length - 1].id);
  }
  return allList;
}

export { getList, getDetail, wait };