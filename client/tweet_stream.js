Template.TweetStream.helpers({
  settings: function() {
    return {
      position: "bottom",
      limit: 5,
      rules: [
        {
          token: '@',
          collection: 'Users',
          field: "username",
          subscription: 'usernames',
          matchAll: true,
          template: Template.userPill
        }
      ]
    }
  }
});

Template.TweetStream.events({
  'submit form': function(event, template) {
    event.preventDefault();
    tweet = template.$('.tweet-text').val();
    loc = {}
    if (Session.get('location'))
      loc = {lat: Session.get('location').coords.latitude, long: Session.get('location').coords.longitude}
    Tweets.insert({text: tweet, location: loc}, function() {
      template.$('.tweet-text').val(null)
    })
  }
});
