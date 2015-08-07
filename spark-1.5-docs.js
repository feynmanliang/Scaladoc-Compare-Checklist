Files = new Mongo.Collection("Files");
Diffs = new Mongo.Collection("Diffs");

if (Meteor.isClient) {
  Template.username.events({
    'submit form': function(e) {
      e.preventDefault();
      NProgress.start();
      var username = $('[name="username"]').val();
      Session.set('username', username);
    }
  });

  Template.fileList.helpers({
    files: function() {
      var filesCursor = Files.find();
      NProgress.done();
      return filesCursor;
    },
    hasUsername: function() {
      return Session.get('username') !== undefined;
    },
    user: function() {
      return Session.get('username');
    }
  });

  Template.fileList.events({
    'click #logout': function() {
      Session.set('username', undefined);
    }
  });

  Template.file.helpers({
    diffs: function() {
      var filename = this.filename;
      return Diffs.find({ "filename": filename });
    }
  });

  Template.diff.helpers({
    diffId: function() {
      return this._id;
    },
    checked: function() {
      if (this.checked) {
        return "ok";
      } else {
        return "question-sign";
      }
    },
    in: function() {
      if (this.checked) {
        return '';
      } else {
        return "in";
      }
    },
    reviewer: function() {
      return this.reviewedBy;
    },
    addNonempty: function() {
      return this.add.length > 0;
    },
    removeNonempty: function() {
      return this.remove.length > 0;
    }
  });
  Template.diff.events({
    'click [role="button"]': function() {
      var user = Session.get('username');
      Diffs.update(this._id, { $set: {
        checked: !this.checked,
        reviewedBy: !this.checked ? user : undefined
      }});
    }
  });
}


if (Meteor.isServer) {
  Meteor.startup(function() {
    // Scaffolding
    if (Files.find().count() == 0) {
      _.each(JSON.parse(Assets.getText("data/files.json")), function(entry) {
        Files.insert(entry);
      });
    }
    if (Diffs.find().count() == 0) {
      _.each(JSON.parse(Assets.getText("data/diffs.json")), function(entry) {
        var diff = entry;
        diff.checked = false;
        Diffs.insert(diff);
      });
    }
  })
}
