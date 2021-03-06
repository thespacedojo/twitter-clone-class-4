Meteor.publish('tweets', function() {
  userCursor = Users.find({_id: this.userId})
  user = userCursor.fetch()[0]
  cursor = []
  ids = []
  self = this
  ids.push(user.profile.followingIds);
  ids.push(this.userId)
  followingIds = _.flatten(ids)
  cursor.push(Tweets.find({userId: {$in: followingIds}}, {sort: {tweetedAt: -1}}))
  users = Users.find({_id: {$in: followingIds}}, {fields: {username: 1, 'profile.name': 1}})
  cursor.push(users)

  userCursor.observeChanges({
    changed: function(id, user) {
      ids = user.profile.followingIds
      ids.push(self.userId)
      flatIds = _.flatten(ids)
      addedFollowingIds = _.difference(flatIds, followingIds)
      removedFollowingIds = _.difference(followingIds, flatIds)
      console.log(addedFollowingIds)
      followingIds = user.profile.followingIds
      if (addedFollowingIds) {
        users = Users.find({_id: {$in: addedFollowingIds}}, {fields: {username: 1, 'profile.name': 1}})
        _(users.fetch()).each(function (user) {
          console.log(user)
          self.added('users', user._id, user)
          tweets = Tweets.find({userId: user._id})
          _(tweets.fetch()).each(function(tweet) {
            console.log(tweet)
            self.added('tweets', tweet._id, tweet)
          })
        })
      }

      if (removedFollowingIds) {
        users = Users.find({_id: {$in: removedFollowingIds}}, {fields: {username: 1, 'profile.name': 1}})
        _(users.fetch()).each(function (user) {
          console.log(user)
          self.removed('users', user._id)
          tweets = Tweets.find({userId: user._id})
          _(tweets.fetch()).each(function(tweet) {
            console.log(tweet)
            self.removed('tweets', tweet._id)
          })
        })
      }
    }
  })

  return cursor
})

Meteor.publish('notifications', function() {
  tweetsCursor = Tweets.find({mentionIds: {$in: [this.userId]}})
  userIds = _.pluck(tweetsCursor.fetch(), "userId");
  usersCursor = Users.find({_id: {$in: userIds}}, {fields: {username: 1, "profile.name": 1}})
  return [tweetsCursor, usersCursor]
});

Meteor.publish('profile', function(username) {
  return Meteor.users.find({username: username}, {fields: {emails: 0, services: 0}});
});
Meteor.publish('profileTweets', function(username) {
  user = Meteor.users.findOne({username: username}, {fields: {emails: 0, services: 0}});
  return Tweets.find({userId: user._id})
});


Meteor.publish('usernames', function(selector, options, colName) {
  collection = global[colName];
  sub = this;
  console.log(selector);
  console.log(options);
  handle = collection.find(selector, options).observeChanges({
    added: function(id, fields) {
      sub.added('autocompleteRecords', id, fields);
    },
    changed: function(id, fields) {
      sub.changed('autocompleteRecords', id, fields);
    },
    removed: function(id) {
      sub.removed('autocompleteRecords', id)
    }
  })
  sub.ready();
  sub.onStop(function() { handle.stop() })
});
