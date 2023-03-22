import { getList, getDetail, wait } from './getData';
import analyse from './analyse';

async function main(config, log) {
  const result = [];
  log('比赛列表获取中');
  const list = await getList(config, log);
  console.log('meowlist', list);
  log('获取到', list.length, '个比赛数据');
  for (let i = 0; i<list.length;i+=1) {
    log('正在获取比赛数据', list[i].id);
    const data = await getDetail(list[i].id, config);
    if (data) {
      log('正在分析比赛数据', list[i].id, `${i + 1}/${list.length}`);
      const analyseResult = analyse(data, config.id, log);
      if (analyseResult) {
        result.push({...analyseResult,...list[i]});
        log('分析完成', list[i].id);
      }
      await wait(1000);
    } else {
      log('但是什么也没找到');
    }
  }
  log('所有数据分析完成');
  if (!result.length) {
    return {
      result: [],
      avgCatch: 0,
      avgAlive: 0,
    };
  }
  const avgCatch = (result.map(({observerBreak}) => Number(observerBreak)).filter((i) => !isNaN(i)).reduce((a, b) => a + b) / result.length).toFixed(5);
  const avgAlive = (result.map(({observerPower}) => Number(observerPower)).filter((i) => !isNaN(i)).reduce((a, b) => a + b) / result.length).toFixed(5);
  return {
    result,
    avgCatch,
    avgAlive,
  };
}

export default main;
