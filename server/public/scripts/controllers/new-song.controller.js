app.controller('NewSongController', ['SongFactory','$location', '$scope', '$timeout', '$window', function(SongFactory,$location, $scope, $timeout, $window) {

  var self = this;

  self.songError = false;
  self.filesUploaded = SongFactory.filesUploaded; //function for uploading
  self.fileUpload = function(details) {
    SongFactory.fileUpload(details).then(function() {
      $scope.$apply();
    }); //files for single song
  };
  self.notationUpload = function(details) {
    SongFactory.notationUpload(details).then(function() {
      $scope.$apply();
    }); // function for uploading notationj
  };
  self.notationUploaded = SongFactory.notationUploaded; // notation files for single song
  console.log(self.notationUploaded);
  self.titlePlaceholder = "Title";
  self.dropdowns = SongFactory.dropdowns;
  self.lightboxImage = '';
  self.viewMore = false;
  self.newSongObject = {};
  self.previewUrl = SongFactory.previewUrl;
  self.imageUpload = {typeOfFile: '', elementId: '', isNotation: ''};
  self.redirectToCollection = function() {
    $location.path('/collection');
  };

  self.cancelPopover = {
    content: 'Cancel this song?',
    templateUrl: 'cancelPopover.html',// getting from collection-view.html
    // title: 'Cancel this song?'
  };

  self.saveCatches = function(newSongObject) {
    if(newSongObject.title === '' || newSongObject.title === undefined) {
      console.log('you need a title!');
      self.titlePlaceholder = "Title is required!";
      self.songError = true;
    } else {
      var files = document.getElementById(self.imageUpload.elementId).files;
      var file = files[0];
      SongFactory.saveNewSong(newSongObject, self.imageUpload, file).then(function(){
        console.log('saved!');
        self.titlePlaceholder = "New Song Title";
        self.songError = false;
        self.newSongForm.$dirty = false;
        self.newSongObject = {};
        alertify.success('Saved New Song!');
        $location.path('/collection');
      });

    }
  };


  $scope.$on('$locationChangeStart', function (event, next) {
    console.log('location change: ', self.newSongForm.$dirty);
    if (self.newSongForm.$dirty) {
      event.preventDefault();
      alertify.confirm('Unsaved Song', 'There are unsaved changes. Would you like to exit the new song form without saving?',
        function(){
          console.log(next);
          self.newSongForm.$dirty=false;
          $window.open(next, "_self");
        },
        function(){ alertify.error('Cancel');}
      ).set('labels', {ok:'Leave without saving', cancel:'Stay on form'});
    }
    //previously working code (not a pretty alert)
    // if (self.newSongForm.$dirty && !confirm('There are unsaved changes. Would you like to exit the new song form?')) {
    //  event.preventDefault();
    // }
  });


  self.saveNewSong = SongFactory.saveNewSong;

  self.newSongObject.teachableElementsModel = [];
  self.teachableElementsSettings = {
    displayProp: 'teachable_elements',
    closeOnBlur: true,
    clearSearchOnClose: true,
    showCheckAll: false,
    enableSearch: true,
    smartButtonMaxItems: 5,
    scrollableHeight: '300px',
    scrollable: true,
    selectedToTop: true,
    keyboardControls: true,
    idProperty: 'id',
  };

  self.teachableElementsCustomTexts = {
    buttonDefaultText: 'Select teachable elements'
  };

  self.newSongObject.scaleModeModel = [];
  self.scaleModeSettings = {
    displayProp: 'scale_mode',
    closeOnBlur: true,
    clearSearchOnClose: true,
    showCheckAll: false,
    showUncheckAll: false,
    enableSearch: true,
    smartButtonMaxItems: 1,
    scrollableHeight: '300px',
    scrollable: true,
    selectedToTop: true,
    keyboardControls: true,
    idProperty: 'id',
    closeOnSelect: true,
    selectionLimit: 1
  };

  self.scaleModeCustomTexts = {
    buttonDefaultText: 'Select scale / mode'
  };

  self.checkAndDisplayRhythm = function(string) {
    self.rhythm = SongFactory.prepareRhythmForFont(string);
  };

  self.checkAndDisplayExtractableRhythms = function(string) {
    self.extractableRhythms = SongFactory.prepareExtractableRhythmForFont(string);
  };

  // view image preview modal
  self.viewMoreOnClick = function(bool, type, index, preview) {
    self.viewMore = bool; // used in ng-if on the front end
    console.log('type', type);
    if(bool === true && type == 'attachments' && preview === false) {
      self.lightboxImage = SongFactory.filesUploaded[index].image_url;
    } else if (bool === true && type == 'notation' && preview === false) {
      self.lightboxImage = SongFactory.notationUploaded[index].image_url;
    }
    if(type == 'attachments' && preview === true) {
      self.lightboxImage = SongFactory.previewUrl.attachment.url;
    } else if (type == 'notation' && preview === true) {
      self.lightboxImage = SongFactory.previewUrl.notation.url;
    }

  };

  self.uploadButton =function(typeOfFile, elementId) {
    self.imageUpload.typeOfFile = typeOfFile;
    self.imageUpload.elementId = elementId;
    console.log('typeOfFile', self.imageUpload);
    document.getElementById(elementId).onchange = function () {
      str = this.value;
      if(typeOfFile === 'notation') {
        self.imageUpload.isNotation = true;
        console.log('notation!', typeOfFile);
      self.previewUrl.notation.fileName = str.substring(str.lastIndexOf("\\") + 1);
    } else if (typeOfFile === 'attachment') {
      self.imageUpload.isNotation = false;
      console.log('attachment!', typeOfFile);
      self.previewUrl.attachment.fileName = str.substring(str.lastIndexOf("\\") + 1);

    }
      console.log('str' , self.previewUrl);
      $scope.$apply();
    };
  };

}]);
