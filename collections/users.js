Users = Meteor.users

Users.helpers({
  tweets: function() {
    return Tweets.find({userId: this._id, tweetedAt: {$lt: Session.get('lastSeenTweets')}}, {sort: {tweetedAt: -1}});
  },
  newTweets: function() {
    return Tweets.find({userId: this._id, tweetedAt: {$gt: Session.get('lastSeenTweets')}});
  }
});

Meteor.methods({
  follow: function(followId) {
    Users.update(this.userId, {$push: {"profile.followingIds": followId}});
  },
  unfollow: function(followId) {
    Users.update(this.userId, {$pull: {"profile.followingIds": followId}});
  }
});
