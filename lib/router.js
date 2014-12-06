Router.configure({
  layoutTemplate: 'base',
  loadingTemplate: 'loading'
});

Router.map(function() {
  this.route('tweet_stream', {path: '/'});
  this.route('notifications', {path: '/notifications'});
  this.route('profile', {path: '/profile'});
});
