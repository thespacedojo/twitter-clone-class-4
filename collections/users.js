Users = Meteor.users

Users.helpers({
  tweets: function() {
    return Tweets.find({userId: this._id});
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
