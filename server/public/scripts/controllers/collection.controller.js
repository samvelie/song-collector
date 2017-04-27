app.controller('CollectionController', ['SongFactory', 'AuthFactory', '$uibModal', '$filter', '$scope', '$window', function(SongFactory, AuthFactory, $uibModal, $filter, $scope, $window) {
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
    SongFactory.updateSong(song).then(function() {
      self.songInfoForm.$dirty = false;
      alertify.success('Updates Saved!');
    });
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

  self.viewMoreOnClick = function(bool, type, index, isNew) {
    self.viewMore = bool;
    console.log('type', type);
    if(bool === true && type == 'attachments' && isNew === false) {
      self.lightboxImage = SongFactory.attachments.attachments[index].image_url;
    } else if (bool === true && type == 'notation' && isNew === false) {
      self.lightboxImage = SongFactory.attachments.notation[index].image_url;
      console.log('light box image', self.lightboxImage);
    } else if(type=='notation' && isNew === true) {
      self.lightboxImage = SongFactory.notationUploaded.list[0].url;
    } else if(type=='attachments' && isNew === true) {
      self.lightboxImage = SongFactory.filesUploaded.list[0].url;
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

  self.scaleModeOptions = [
    {id:1, name: 'merp'},
    {id:2, name: 'merpaderp'},
    {id:3, name: 'celina'}
  ];

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

  // have a promise so that after a song is deleted, user gets redirected back to the main card view
  // need to create a confirmation popup and an alert of deletion popup
  self.deleteFunction = function(songId) {
    SongFactory.deleteSong(songId).then(function() {
      self.songClicked = false;
      self.editingRhythm = false;
      self.editingExtractableRhythm = false;
      alertify.error('Song Deleted!');
      self.songInfoForm.$dirty = false;
    });
  };

  self.showSong = function(songId) {
    if(self.songClicked && self.songInfoForm.$dirty) {
      alertify.confirm('Unsaved Updates', 'There are unsaved changes. Would you like to see another song before saving this one?',
      function(){
        whenSongShouldShowOnClick(songId);
      },
      function(){return;}
      ).set('labels', {ok:'Go without saving', cancel:'Stay here'});
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

$scope.$on('$locationChangeStart', function (event, next) {
  if (self.songClicked && self.songInfoForm.$dirty) {
    event.preventDefault();
    alertify.confirm('Unsaved Updates', 'There are unsaved changes. Would you like to leave without saving?',
    function(){
      console.log(next);
      self.songInfoForm.$dirty=false;
      $window.open(next, "_self");
    },
    function(){ return;}
  ).set('labels', {ok:'Yes, leave without saving', cancel:'Stay here.'});
}
});

self.showFullCardView = function () {
  if (self.songInfoForm.$dirty) {
    alertify.confirm('Unsaved Updates', 'There are unsaved changes. Would you like to see another song before saving this one?',
    function(){
      self.songClicked=false;
      self.songInfoForm.$dirty=false;
      $scope.$apply();
    },
    function(){return;}
    ).set('labels', {ok:'Go without saving', cancel:'Stay here'});
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
  console.log('index', index);
  console.log('SongFactory.attachments.notation[index].image_url', SongFactory.attachments.notation[index].image_url);
};

function getSignedRequest(file, songId){
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/sign-s3?file-name=' + file.name + '&file-type=' + file.type);
  xhr.onreadystatechange = function(){
    if(xhr.readyState === 4){
      if(xhr.status === 200){
        var response = JSON.parse(xhr.responseText);
        uploadFile(file, response.signedRequest, response.url, songId);
      }
      else{
        alert('Could not get signed URL.');
      }
    }
  };
  xhr.send();
}

function uploadFile(file, signedRequest, url, songId){
  var xhr = new XMLHttpRequest();
  xhr.open('PUT', signedRequest);
  xhr.onreadystatechange = function() {
    if(xhr.readyState === 4){
      if(xhr.status === 200){
        document.getElementById('preview').src = url;
        document.getElementById('avatar-url').value = url;
        SongFactory.sendToDatabase(url, songId);
      }
      else{
        alert('Could not upload file.');
      }
    }
  };
  xhr.send(file);
}

self.initUpload = function(songId){
  var files = document.getElementById('file-input').files;
  var file = files[0];
  console.log('file init', file);
  if(file === null){
    return alert('No file selected.');
  }
  getSignedRequest(file, songId);
};
}]);
