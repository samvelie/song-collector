app.controller('CollectionController', ['SongFactory', function(SongFactory) {
  var self = this;
  console.log('in CollectionController');
  //full song collection
  self.songs = SongFactory.songCollection;
  self.editSongObject = {};
  //boolean to hide/show single song
  self.songClicked = false;

  self.editingRhythm = false;
  self.editingExtractableRhythm = false;

  self.oneSong = SongFactory.oneSong; //single song information
  self.fileUpload = SongFactory.fileUpload; //function for uploading
  self.filesUploaded = SongFactory.filesUploaded; //files for single song
  self.attachments = SongFactory.attachments; //attachments for single song
  self.dropdowns = SongFactory.dropdowns;

  self.te_id = SongFactory.oneSong.details.teachable_elements_id;
  self.te_value = SongFactory.oneSong.details.teachable_elements;
  // self.testmodel = [{id: 1 }];
  var taco = [
    {
      "id": 1,
      "teachable_elements": "Two eigth note anacrusis"
    }
  ];

  console.log('taco[0]', taco[0]);
  console.log('self.testmodel is', self.testmodel);


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
    self.oneSong.details.extractableRhythmArray = SongFactory.prepareExtractableRhythmForFont(rhythmString);
  };


  // self.htmlPopover = '<b style="color: red">I can</b> have <div class="label label-success">HTML</div> content';
  self.htmlPopover = 'Share this song:<input type="text" class="form-control" placeholder="Email address"><button class="btn btn-default" type="submit">';

  self.dynamicPopover = {
    content: 'Hello, World!',
    templateUrl: 'myPopoverTemplate.html',
    title: 'Share this song:'
  };

}]);
