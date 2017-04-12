app.controller('NewSongController', ['SongFactory', function(SongFactory) {

  var self = this;

  self.fileUpload = SongFactory.fileUpload;
  self.attachments = SongFactory.attachments;
  // self.showPicker = SongFactory.showPicker;

  self.dropdowns = SongFactory.dropdowns;
  self.newSongObject = {};

  self.saveNewSong = SongFactory.saveNewSong;

  self.teachableElementsModel = [];
  self.teachableElementsSettings = {
    displayProp: 'teachable_elements',
    closeOnBlur: true,
    clearSearchOnClose: true,
    showCheckAll: false,
    enableSearch: true,
    smartButtonMaxItems: 10,
    scrollableHeight: '300px',
    scrollable: true
  };


}]);
