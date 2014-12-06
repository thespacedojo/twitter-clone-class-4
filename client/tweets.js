Template.tweets.created = function() {
  Session.set('lastSeenTweets', new Date());
}

Template.tweets.events({
  'click .showNewTweets': function(event, template) {
    Session.set('lastSeenTweets', new Date())
  }
})
