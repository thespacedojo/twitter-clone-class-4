Template.profileEdit.events({
  "submit form": function(event, template) {
    event.preventDefault();

    uploader = new Slingshot.Upload("myFileUploads");

    uploader.send(template.$("#profileImage")[0].files[0], function (error, downloadUrl) {
      debugger
      if (!error) {
        Meteor.users.update(Meteor.userId(), {$set: {"profile.imageUrl": downloadUrl}});
      }
    });

    data = SimpleForm.processForm(event.target);
    Users.update(Meteor.userId(), {$set: {profile: data}}, function(err) {
      if (err)
        CoffeeAlerts.warning("There was an error saving your profile.");
      else
        CoffeeAlerts.success("Your profile has been updated.");
    });
  }
});
