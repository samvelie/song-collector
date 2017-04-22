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
      SongFactory.saveNewSong(newSongObject).then(function(){
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

  //
  // var _selected;
  //
  // $scope.selected = undefined;
  // $scope.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
  // // Any function returning a promise object can be used to load values asynchronously
  // $scope.getLocation = function(val) {
  //   return $http.get('//maps.googleapis.com/maps/api/geocode/json', {
  //     params: {
  //       address: val,
  //       sensor: false
  //     }
  //   }).then(function(response){
  //     return response.data.results.map(function(item){
  //       return item.formatted_address;
  //     });
  //   });
  // };
  //
  // $scope.ngModelOptionsSelected = function(value) {
  //   if (arguments.length) {
  //     _selected = value;
  //   } else {
  //     return _selected;
  //   }
  // };
  //
  // $scope.modelOptions = {
  //   debounce: {
  //     default: 500,
  //     blur: 250
  //   },
  //   getterSetter: true
  // };
  //
  // $scope.statesWithFlags = [{'name':'Alabama','flag':'5/5c/Flag_of_Alabama.svg/45px-Flag_of_Alabama.svg.png'},{'name':'Alaska','flag':'e/e6/Flag_of_Alaska.svg/43px-Flag_of_Alaska.svg.png'},{'name':'Arizona','flag':'9/9d/Flag_of_Arizona.svg/45px-Flag_of_Arizona.svg.png'},{'name':'Arkansas','flag':'9/9d/Flag_of_Arkansas.svg/45px-Flag_of_Arkansas.svg.png'},{'name':'California','flag':'0/01/Flag_of_California.svg/45px-Flag_of_California.svg.png'},{'name':'Colorado','flag':'4/46/Flag_of_Colorado.svg/45px-Flag_of_Colorado.svg.png'},{'name':'Connecticut','flag':'9/96/Flag_of_Connecticut.svg/39px-Flag_of_Connecticut.svg.png'},{'name':'Delaware','flag':'c/c6/Flag_of_Delaware.svg/45px-Flag_of_Delaware.svg.png'},{'name':'Florida','flag':'f/f7/Flag_of_Florida.svg/45px-Flag_of_Florida.svg.png'},{'name':'Georgia','flag':'5/54/Flag_of_Georgia_%28U.S._state%29.svg/46px-Flag_of_Georgia_%28U.S._state%29.svg.png'},{'name':'Hawaii','flag':'e/ef/Flag_of_Hawaii.svg/46px-Flag_of_Hawaii.svg.png'};
  //

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
