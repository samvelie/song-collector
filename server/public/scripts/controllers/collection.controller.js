app.controller('CollectionController', ['SongFactory', 'AuthFactory', '$uibModal', '$filter', function(SongFactory, AuthFactory, $uibModal, $filter) {
  var self = this;
  console.log('in CollectionController');
  //full song collection
  self.songs = SongFactory.songCollection;
  self.filteredResults = SongFactory.songCollection;
  self.editSongObject = {};
  //boolean to hide/show single song
  self.songClicked = SongFactory.songClicked;

  self.editingRhythm = false;
  self.editingExtractableRhythm = false;

  SongFactory.getAllSongs();

  self.oneSong = SongFactory.oneSong; //single song information
  self.fileUpload = SongFactory.fileUpload; //function for uploading
  self.filesUploaded = SongFactory.filesUploaded; //files for single song
  self.notationUpload = SongFactory.notationUpload; // function for uploading notation
  self.notationUploaded = SongFactory.notationUploaded; // notation files for single song
  self.attachments = SongFactory.attachments; //attachments for single song
  self.deleteAttachment = SongFactory.deleteAttachment; // delete attachment perhaps
  self.dropdowns = SongFactory.dropdowns; // retrieve dropdown values
  self.lightboxImage = '';
  self.viewMore = false;

  self.saveSongChanges = function(song) {//function for saving changes made on a song
      SongFactory.updateSong(song);
      self.songInfoForm.$dirty = false;
  };


  self.searchPage = function (input) {
    var searchObject = {};
    var key = input.searchFilter;
    var value = input.inputString;
    searchObject[key] = value;

    console.log('searching by', input);
    self.filteredResults.list = $filter('filter')(self.songs.list, input);

    console.log('self.songs', self.songs.list);


    console.log(self.filteredResults);
  };

  self.viewMoreOnClick = function(bool, type, index) {
    self.viewMore = bool;
    console.log('type', type);
    if(bool === true && type == 'attachments') {
      self.lightboxImage = SongFactory.attachments.attachments[index].image_url;
    } else if (bool === true && type == 'notation') {
      self.lightboxImage = SongFactory.attachments.notation[index].image_url;
    }
    console.log(self.lightboxImage);

  };

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

  // self.scaleModeOptionsTest = [
  //   {id:1, name: 'merp'},
  //   {id:2, name: 'merpaderp'},
  //   {id:3, name: 'celina'}
  // ];

  // JavaScript
  self.example6data = [ { id: 1, label: 'David' }, { id: 2, label: 'Jhon' }, { id: 3, label: 'Danny' } ];
  self.example6model = [self.example6data[0],self.example6data[2]];
  self.example6settings = {};

  self.example9model = [];

  self.oneSongScaleMode = [
    { id: 45 }
  ];

  self.example9data = [
    { id: 1, label: 'David' },
    { id: 2, label: 'Jhon' },
    { id: 3, label: 'Danny' }];

  self.scaleModeSettings = {
    displayProp: 'scale_mode',
    enableSearch: true,
    selectionLimit: 4,
    keyboardControls: true,
    smartButtonMaxItems: 4,
    scrollableHeight: '300px',
    scrollable: true,
    selectedToTop: true,
    closeOnBlur: true,
    clearSearchOnClose: true,
    showCheckAll: false,
    showUncheckAll: false,
  };

  self.example9settings = {
    displayProp: 'scale_mode_id',
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

  // self.scaleModeSelected = SongFactory.oneSong.details.scale_mode_array[0];

  self.scaleModeCustomTexts = {
    buttonDefaultText: 'Select scale / mode'
  };

  self.scaleModeOptions = [
    { id: 1, scale_mode: "Aeolian"},
    { id: 2, scale_mode: "Authentic do hexachord" },
    { id: 3, scale_mode: "Authentic do hexatone" },
    { id: 4, scale_mode: "Authentic do major" },
    { id: 5, scale_mode: "Authentic do pentachord" },
    { id: 6, scale_mode: "Authentic do pentatone" },
    { id: 7, scale_mode: "Authentic do tetratone" },
    { id: 8, scale_mode: "Authentic do trichord" },
    { id: 9, scale_mode: "Authentic do tritone" },
    { id: 10, scale_mode: "Authentic la hexatone" },
    { id: 11, scale_mode: "Authentic la pentachord" },
    { id: 12, scale_mode: "Authentic la pentatone" },
    { id: 13, scale_mode: "Authentic la tetratone" },
    { id: 14, scale_mode: "Authentic la tritone" },
    { id: 15, scale_mode: "Authentic mi bitone" },
    { id: 16, scale_mode: "Authentic mi tritone" },
    { id: 17, scale_mode: "Authentic sol hexachord" },
    { id: 18, scale_mode: "Authentic sol hexatone" },
    { id: 19, scale_mode: "Authentic sol pentatone" },
    { id: 22, scale_mode: "Do tetratone" },
    { id: 23, scale_mode: "Dorian" },
    { id: 24, scale_mode: "Extended do major" },
    { id: 25, scale_mode: "Extended do pentachord" },
    { id: 26, scale_mode: "Extended do pentatone" },
    { id: 27, scale_mode: "Extended la" },
    { id: 28, scale_mode: "Extended la minor" },
    { id: 29, scale_mode: "Extended la pentachord" },
    { id: 30, scale_mode: "Extended mi hexachord" },
    { id: 31, scale_mode: "Harmonic minor" },
    { id: 32, scale_mode: "Incomplete do major" },
    { id: 33, scale_mode: "Incomplete do pentatone" },
    { id: 34, scale_mode: "Incomplete la scale" },
    { id: 35, scale_mode: "Incomplete natural minor" },
    { id: 36, scale_mode: "Ionian" },
    { id: 37, scale_mode: "Locrian" },
    { id: 38, scale_mode: "Lydian" },
    { id: 39, scale_mode: "Major" },
    { id: 40, scale_mode: "Melodic minor" },
    { id: 41, scale_mode: "Mixed meter" },
    { id: 42, scale_mode: "Mixolydian" },
    { id: 43, scale_mode: "Natural minor" },
    { id: 44, scale_mode: "Phrygian" },
    { id: 45, scale_mode: "Plagal do major" },
    { id: 46, scale_mode: "Plagal do hexachord" },
    { id: 47, scale_mode: "Plagal do hexatone" },
    { id: 48, scale_mode: "Plagal do incomplete major" },
    { id: 49, scale_mode: "Plagal do incomplete blues scale" },
    { id: 50, scale_mode: "Plagal do pentachord" },
    { id: 51, scale_mode: "Plagal do tetratone" },
    { id: 52, scale_mode: "Plagal do tritone" },
    { id: 53, scale_mode: "Plagal la hexatone" },
    { id: 54, scale_mode: "Plagal la pentatone" },
    { id: 55, scale_mode: "Quarter note and two eighth notes" },
    { id: 56, scale_mode: "do hexachord" },
    { id: 57, scale_mode: "do hexatone" },
    { id: 58, scale_mode: "do tetrachord" },
    { id: 59, scale_mode: "do tritone" },
    { id: 60, scale_mode: "la hexachord" },
    { id: 61, scale_mode: "la pentatone" },
    { id: 62, scale_mode: "la tetratone" },
    { id: 63, scale_mode: "mi hexachord" },
    { id: 64, scale_mode: "mi pentachord" },
    { id: 65, scale_mode: "mi tritone" },
    { id: 66, scale_mode: "re pentachord" },
    { id: 68, scale_mode: "Soprano recorder" },
    { id: 69, scale_mode: "Plagal do pentatone" },
    { id: 20, scale_mode: "Authentic sol tetratone" },
    { id: 67, scale_mode: "sol tritone" },
    { id: 21, scale_mode: "Blues scale" }
];

  // have a promise so that after a song is deleted, user gets redirected back to the main card view
  // need to create a confirmation popup and an alert of deletion popup
  self.deleteFunction = function(songId) {
    SongFactory.deleteSong(songId).then(function() {
      self.songClicked = false;
      self.editingRhythm = false;
      self.editingExtractableRhythm = false;
      self.deleteSuccessMessage = 'Song Deleted';
      self.songInfoForm.$dirty = false;
    });
  };

  self.showSong = function(songId) {
    if(self.songClicked) {
      if(self.songInfoForm.$dirty) {
        var moveOn = confirm('You have unsaved changes, are you sure you want to go to another song?');
          if(moveOn) {
            whenSongShouldShowOnClick(songId);
          }
      } else {
        whenSongShouldShowOnClick(songId);
      }
    } else {
      whenSongShouldShowOnClick(songId);
    }
  };

  function whenSongShouldShowOnClick(songId) {
    console.log('show song of id ' + songId);
    SongFactory.showSong(songId);
    self.songClicked = true;
    self.editingRhythm = false;
    self.editingExtractableRhythm = false;
    self.editSongObject.teachableElementsModel = SongFactory.oneSong.details.teachable_elements_id_group;
    if(self.songInfoForm) {
      self.songInfoForm.$dirty = false;
    }
  }

  self.showFullCardView = function () {
    if (self.songInfoForm.$dirty) {
      var showAll = confirm('You have unsaved changes, are you sure you want to view all songs?');
        if(showAll) {
          self.songClicked=false;
        }
    } else {
      self.songClicked=false;
    }
  };

  self.multiSelectChange = {
    onItemSelect: function(item) {
      self.makeDirty();
    },
    onItemDeselect: function(item) {
      self.makeDirty();
    }
  };

  self.makeDirty = function() {
    self.songInfoForm.$setDirty();
  };


  self.expandFilter = function() {
    if(self.spanClicked) {
      self.spanClicked = false;
    } else {
      self.spanClicked = true;
    }
  };

  self.loseFocus = function(fieldId, rhythmString) {
    if(fieldId == 'rhythm') {
      self.editingRhythm = false;
    }
    if(fieldId == 'extractableRhythm') {
      self.editingExtractableRhythm = false;
    }
  };

  //placeholder function that needs to focus on input field as it appears
  self.findFocus = function(fieldId) {
    if(fieldId == 'rhythm') {
      self.editingRhythm = true;
    }
    if(fieldId == 'extractableRhythm') {
      self.editingExtractableRhythm = true;
    }
  };

  self.updateRhythmDisplay = function (rhythmString) {
    self.oneSong.details.rhythmArray = SongFactory.prepareRhythmForFont(rhythmString);
  };

  self.updateExtractableRhythmDisplay = function (extractableRhythmString) {
    self.oneSong.details.extractableRhythmArray = SongFactory.prepareExtractableRhythmForFont(extractableRhythmString);
  };

  // self.htmlPopover = '<b style="color: red">I can</b> have <div class="label label-success">HTML</div> content';
  self.htmlPopover = 'Share this song:<input type="text" class="form-control" placeholder="Email address"><button class="btn btn-default" type="submit">';

  self.dynamicPopover = {
    content: 'Email the notation images to:',
    templateUrl: 'sharePopover.html', // getting from collection-view.html
    // title: 'Share this song:',
  };

  self.deletePopover = {
    content: 'Delete this song?',
    templateUrl: 'deletePopover.html',// getting from collection-view.html
    // title: 'Delete this song?'
  };

  self.shareSong = function(emailAddress, index) {
    SongFactory.shareSong(emailAddress, SongFactory.attachments.notation[index].image_url, AuthFactory.userInfo, SongFactory.oneSong.details.song_title);
  };

}]);
