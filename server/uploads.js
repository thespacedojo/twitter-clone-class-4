Slingshot.createDirective("myFileUploads", Slingshot.S3Storage, {
  bucket: "twitter-clone-class-4-profiles",
  allowedFileTypes: ["image/png", "image/jpeg", "image/gif"],
  maxSize: 0,
  acl: "public-read",

  authorize: function () {
    //Deny uploads if user is not logged in.
    if (!this.userId) {
      var message = "Please login before posting files";
      throw new Meteor.Error("Login Required", message);
    }

    return true;
  },

  key: function (file) {
    //Store file into a directory by the user's username.
    var user = Meteor.users.findOne(this.userId);
    return user.username + "/" + file.name;
  }
});
