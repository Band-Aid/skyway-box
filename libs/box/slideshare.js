var backbone = require('backbone')
  , _ = require('underscore')
  , EventEmitter = require('events').EventEmitter

////////////////////////////////////////////
// template html (underscore)
//
// todo: once full screen called then exit, event handler for each button gone away. to prevent this, we disable fullscreen feature but it should be fixed.
var template_ = [
  "<iframe frameborder='0' width='100%' height='100%' src='<%= expiring_embed_link.url %>' allowfullscreen='true' webkitallowfullscreen='true' mozallowfullscreen='true' oallowfullscreen='true' msallowfullscreen='true'></iframe>"
//  "<iframe frameborder='0' width='100%' height='100%' src='<%= expiring_embed_link.url %>'></iframe>"
].join("")

////////////////////////////////////////////
// Backbone Model
//
var Model = Backbone.Model.extend({
  urlRoot: '/embedlink'
});

////////////////////////////////////////////
// Backbone View
//
var View = Backbone.View.extend({
  initialize: function() {
  },
  template: _.template(template_),
  render: function() {
    console.log(this.model.attributes);
    this.$el.html(this.template(this.model.attributes));
  }
});

////////////////////////////////////////////
// Component
//
class SlideShare extends EventEmitter {
  constructor(element, access_token) {
    super();

    this.access_token = access_token;
    this.el = element;

    this.model = new Model();
    this.view = new View({el: this.el, model: this.model});
  }

  show(embedlinkObj) {
    this.model.set(embedlinkObj);
    this.view.render();
  }

  renew_token(new_token) {
    if(!new_token) throw "new_token must be set";

    this.access_token = new_token;
  }

  fetch(file_id) {
    console.log(file_id);
    this.model
      .set("id", file_id)
      .fetch({"data": {"access_token": this.access_token}})
      .success(() => {
        // to share fetched embed_link, fire event
        var embedlinkObj = _.clone(this.model.attributes);
        console.log(embedlinkObj);
        this.emit("embedlink", embedlinkObj);

        // render it on my screen
        this.view.render();
      })
  }
}

module.exports = SlideShare;
