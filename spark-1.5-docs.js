FileDiffs = new Mongo.Collection("FileDiffs");

if (Meteor.isClient) {
  Template.fileList.helpers({
    data: FileDiffs.find()
  });

  Template.diff.helpers({
    diffId: function() {
      return this._id + _.filter(this.location, function(x) { return x !== ','; }).join('');
    },
    addNonempty: function() {
      return this.add.length > 0;
    },
    removeNonempty: function() {
      return this.remove.length > 0;
    }
  });
}


if (Meteor.isServer) {
  Meteor.startup(function() {
    // Scaffolding
    if (FileDiffs.find().count() == 0) {
      _.each(JSON.parse(Assets.getText("data/data.json")), function(entry) {
        FileDiffs.insert(entry);
      });
    }
  })
}
