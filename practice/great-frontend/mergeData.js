/**
 * @param {Array<{user: number, duration: number, equipment: Array<string>}>} sessions
 * @return {Array}
 */
function mergeData(sessions) {
  const result = {};

  for (let session of sessions) {
    const { user, duration, equipment } = session;
    if (!result[user]) {
      result[user] = session;
    } else {
      result[user].duration += duration;
      result[user].equipment = [
        ...new Set([...result[user].equipment, ...equipment]),
      ];
    }
  }

  return Object.values(result);
}

console.log(
  mergeData([
    { user: 8, duration: 50, equipment: ["bench"] },
    { user: 7, duration: 150, equipment: ["dumbbell", "kettlebell"] },
    { user: 8, duration: 50, equipment: ["bench"] },
    { user: 7, duration: 150, equipment: ["bench", "kettlebell"] },
  ]),
);
