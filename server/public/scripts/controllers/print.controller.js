app.controller('PrintController', ['SongFactory', 'AuthFactory', '$routeParams', 'angularFilepicker',
  function(SongFactory, AuthFactory, $routeParams, angularFilepicker) {

    var self = this;

    console.log("print controller loaded");

    self.message = 'This is the PrintController View';

    self.songs = SongFactory.songCollection; // for the left-hand card view sidebar
    self.fileUpload = SongFactory.fileUpload;
    self.filesUploaded = SongFactory.filesUploaded; // will grab existing files uploaded by the user
    // self.removeImage = SongFactory.removeImage;
    self.oneSong = SongFactory.oneSong;
    self.showSong = SongFactory.showSong;
    self.attachments = SongFactory.attachments;
    self.userInfo = AuthFactory.userInfo;

  }
]);
