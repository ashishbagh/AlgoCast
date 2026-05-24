class Twitter {
  constructor() {
    this.tweetMap = new Map();
    this.followMap = new Map();
    this.time = 0;
  }

  /**
   * @param {number} userId
   * @param {number} tweetId
   * @return {void}
   */
  postTweet(userId, tweetId) {
    if (!this.tweetMap.has(userId)) {
      this.tweetMap.set(userId, []);
    }

    this.tweetMap.get(userId).push([tweetId, this.time]);
    this.time++;
  }

  /**
   * @param {number} userId
   * @return {number[]}
   */
  getNewsFeed(userId) {
    const tweets = [];
    const followees = new Set(this.followMap.get(userId) || []);
    followees.add(userId);

    for (const followeeId of followees) {
      const userTweets = this.tweetMap.get(followeeId) || [];
      for (const tweet of userTweets) {
        tweets.push(tweet);
      }
    }

    tweets.sort((a, b) => b[1] - a[1]);
    return tweets.slice(0, 10).map(([tweetId, time]) => tweetId);
  }

  /**
   * @param {number} followerId
   * @param {number} followeeId
   * @return {void}
   */
  follow(followerId, followeeId) {
    if (!this.followMap.has(followerId)) {
      this.followMap.set(followerId, new Set());
    }
    this.followMap.get(followerId).add(followeeId);
  }

  /**
   * @param {number} followerId
   * @param {number} followeeId
   * @return {void}
   */
  unfollow(followerId, followeeId) {
    if (!this.followMap.has(followerId)) return;
    this.followMap.get(followerId).delete(followeeId);
  }
}
