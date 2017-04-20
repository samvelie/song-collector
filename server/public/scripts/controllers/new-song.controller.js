app.controller('NewSongController', ['SongFactory','$location', '$scope', function(SongFactory,$location, $scope) {

  var self = this;

  self.songError = false;
  self.fileUpload = SongFactory.fileUpload; //function for uploading
  self.filesUploaded = SongFactory.filesUploaded; //files for single song
  self.notationUpload = SongFactory.notationUpload; // function for uploading notation
  self.notationUploaded = SongFactory.notationUploaded; // notation files for single song
  console.log(self.notationUploaded);
  self.titlePlaceholder = "Title";
  self.dropdowns = SongFactory.dropdowns;
  self.lightboxImage = '';
  self.viewMore = false;
  self.newSongObject = {};

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
      SongFactory.saveNewSong(newSongObject);
      console.log('saved!');
      self.songError = false;
    }
  };

  $scope.$on('$locationChangeStart', function (event, next, current) {
          if (self.newSongForm.$dirty && !confirm('There are unsaved changes. Would you like to exit the new song form?')) {
            event.preventDefault();
          }
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
    buttonDefaultText: 'Select the teachable elements'
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
      self.lightboxImage = SongFactory.filesUploaded.list[0].url;
    } else if (type == 'notation' && preview === true) {
      self.lightboxImage = SongFactory.notationUploaded.list[0].url;
    }

  };

}]);
