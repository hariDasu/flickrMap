window.Wine = Backbone.Model.extend({

    urlRoot: "/faves",

    idAttribute: "_id",


window.WineCollection = Backbone.Collection.extend({

    model: Fave,

    url: "/faves"

});
