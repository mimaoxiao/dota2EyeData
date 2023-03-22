function getEyeData(data, id, log) {
  if (!data.playbackData) {
    log('该比赛尚未解析');
    return;
  }
  const validPlayer = data.players.filter((i) => i.steamAccount.id.toString() === id.toString() && (i.position === 'POSITION_4' || i.position === 'POSITION_5'));

  if (!validPlayer.length) {
    log('打的不是辅助的比赛有什么分析的必要吗.jpg');
    return;
  }
  const player = validPlayer[0].playerSlot;
  try {
    const sentryUse = data.playbackData.wardEvents.filter((i) => i.wardType === 'SENTRY' && i.action === 'SPAWN' && i.fromPlayer === player).length;
    const observerSuccess = data.playbackData.wardEvents.filter((i) => i.wardType === 'OBSERVER' && i.action === 'DESPAWN' && i.playerDestroyed === player).length;
    let observerBreak = 0;
    if (sentryUse !== 0 && observerSuccess > 0) {
      observerBreak = (observerSuccess/sentryUse).toFixed(3);
    }
  
    const observerUse = data.playbackData.wardEvents.filter((i) => i.wardType === 'OBSERVER' && i.action === 'SPAWN' && i.fromPlayer === player).length;
    const observerDie = data.playbackData.wardEvents.filter((i) => i.wardType === 'OBSERVER' && i.action === 'DESPAWN' && i.fromPlayer === player && i.playerDestroyed !== null).length;
    let observerPower = 0;
    if (observerUse !== 0 && observerUse > observerDie) {
      observerPower = ((observerUse - observerDie)/observerUse).toFixed(3);
    }
    return {
      sentryUse,
      observerSuccess,
      observerBreak,
      observerUse,
      observerDie,
      observerPower,
    };
  } catch (e) {
    console.log(e);
    return;
  }
}

export default getEyeData;
