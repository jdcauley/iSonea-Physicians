App = Ember.Application.create();
 




// Routers

Posts.Router.map(function() {
  this.resource('posts', { path: '/' });
});

// Models

Posts.Post = DS.Model.extend({
  title: DS.attr('string'),
  content: DS.attr('string')
});

Posts.PostsRoute = Ember.Route.extend({
  model: function() {
    return this.store.find('posts');
  }
});

// Helpers

var showdown = new Showdown.converter();
 
Ember.Handlebars.helper('format-markdown', function(input) {
  if (input == undefined)
    return "";
    return new Handlebars.SafeString(showdown.makeHtml(input));
});