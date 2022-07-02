export function getYesterday() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday;
}

export function isBeforeYesterdayMorning(time: Date) {
  const yesterday = getYesterday();
  yesterday.setHours(0, 0, 0, 0);
  return time.getTime() < yesterday.getTime();
}

export function isBeforeToday(time: Date) {
  const todayMorning = new Date();
  todayMorning.setHours(0, 0, 0, 0);

  return time.getTime() < todayMorning.getTime();
}

export function isYesterday(time: Date) {
  const yesterday = getYesterday();

  return time.getDate() === yesterday.getDate();
}

export function timeWhenStrike(lastPost: Date, lastStrike: Date) {
  const postExpiration = new Date(lastPost);
  postExpiration.setHours(0, 0, 0, 0);
  postExpiration.setDate(postExpiration.getDate() + 2);


  const strikeExpiration = new Date(lastStrike);
  strikeExpiration.setHours(0, 0, 0, 0);
  strikeExpiration.setDate(strikeExpiration.getDate() + 1);

  return (
    postExpiration.getTime() > strikeExpiration.getTime()
      ? postExpiration
      : strikeExpiration
  );
}

export function deservesStrike(lastPost: Date, lastStrike: Date): boolean {
  const userStrikeTime = timeWhenStrike(lastPost, lastStrike);
  return userStrikeTime.getTime() <= new Date().getTime();
}
