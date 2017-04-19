app.controller('CollectionController', ['SongFactory', '$uibModal', '$filter', '$timeout', function(SongFactory, $uibModal, $filter, $timeout) {
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

  self.oneSong = SongFactory.oneSong; //single song information
  self.fileUpload = SongFactory.fileUpload; //function for uploading
  self.filesUploaded = SongFactory.filesUploaded; //files for single song
  self.notationUpload = SongFactory.notationUpload; // function for uploading notation
  self.notationUploaded = SongFactory.notationUploaded; // notation files for single song
  self.attachments = SongFactory.attachments; //attachments for single song
  self.dropdowns = SongFactory.dropdowns; // retrieve dropdown values
  self.lightboxImage = '';
  self.viewMore = false;
  self.te_id = SongFactory.oneSong.details.teachable_elements_id;
  self.te_value = SongFactory.oneSong.details.teachable_elements;

  self.saveSongChanges = SongFactory.updateSong;//function for saving changes made on a song

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



  // self.testmodel = [{id: 1 }];
  var taco = [
    {
      "id": 1,
      "teachable_elements": "Two eigth note anacrusis"
    }
  ];

  console.log('taco[0]', taco[0]);
  console.log('self.testmodel is', self.testmodel);

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

  // self.testmodel = [ taco[0] ];

  // self.testing = true;
  // self.testmodel = [{ id: 1 }, { id: 2 }];
  // self.testdata = [
  // 		{ id: 1, label: 'David' },
  // 		{ id: 2, label: 'Jhon' },
  // 		{ id: 3, label: 'Danny' },
  // 	];
  // self.testsettings = {
  // 		selectionLimit: 1,
  // 		selectedToTop: true,
  // 		idProperty: 'id',
  //     smartButtonMaxItems: 3,
  // 	};


  self.testing = true;
  self.testmodel = [{ id: 1 }, { id: 3 }, { id: 5 }];
  self.testdata = [
    { id: 1, teachable_elements: 'eighth note anacrusis' },
    { id: 2, teachable_elements: 'dotted quarter eighth' },
    { id: 3, teachable_elements: 'Aeolian' },
    { id: 4, teachable_elements: 'Asymmetrical meter' },
    { id: 5, teachable_elements: 'Binary (AB)' },
  ];
  self.testsettings = {
    displayProp: 'teachable_elements',
    selectedToTop: true,
    idProperty: 'id',
    smartButtonMaxItems: 3,
  };

  // self.testevents = {
  // 		onSelectionChanged() { // This event is not firing on selection of max limit
  // 			$log.debug('you changed selection');
  // 		},
  // 	};


  // self.editSongObject.teachableElementsModel = [
  //   { 'id' : 1, 'teachable_elements' : 'Two eighth note anacrusis' },
  // ];

  self.editSongObject.teachableElementsModel = [];

  self.teachableElementsSettings = {
    displayProp: 'teachable_elements',
    closeOnBlur: true,
    clearSearchOnClose: true,
    showCheckAll: false,
    enableSearch: true,
    smartButtonMaxItems: 10,
    scrollableHeight: '300px',
    scrollable: true,
    selectedToTop: true
  };
  // have a promise so that after a song is deleted, user gets redirected back to the main card view
  // need to create a confirmation popup and an alert of deletion popup
  self.deleteFunction = function(songId) {
    SongFactory.deleteSong(songId).then(function() {
      self.songClicked = false;
      self.editingRhythm = false;
      self.editingExtractableRhythm = false;
      self.deleteSuccessMessage = 'Song Deleted';
    });
  };

  self.showSong = function(songId) {
    console.log('show song of id ' + songId);
    SongFactory.showSong(songId);
    self.songClicked = true;
    self.editingRhythm = false;
    self.editingExtractableRhythm = false;
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
    content: 'Hello, World!',
    templateUrl: 'sharePopover.html', // getting from collection-view.html
    title: 'Share this song:',
  };

  self.deletePopover = {
    content: 'Are you sure you want to delete this song?',
    templateUrl: 'deletePopover.html',// getting from collection-view.html
    title: 'Delete this song?'
  };

}]);
