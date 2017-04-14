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

  self.checkAndDisplayRhythm = function(string) {
    console.log(string);
    var textString = '';
    var newString = string;
    if (string.indexOf("internal")>=0 || string.indexOf("(internal)")>=0) {
      newString = newString.replace('internal', '');
      newString = newString.replace('(internal)', '');
      textString += 'internal ';
    }
    if (string.indexOf("eighth")>=0) {
      newString = newString.replace('eighth', '');
      textString += 'eighth ';
    }
    if (string.indexOf("anacrusis")>=0 || string.indexOf("anacrusic")>=0) {
      newString = newString.replace('anacrusis', '');
      newString = newString.replace('anacrusic', '');
      textString += 'anacrusis ';
    }
    if (string.indexOf("all syncopated")>=0) {
      newString = newString.replace('all syncopated', '');
      textString += 'all syncopated ';
    }
    self.rhythm = [newString, textString];
  };

  self.checkAndDisplayExtractableRhythms = function(str) {
    var res = str.split(/\(([^)]+)\)/);

    for (var i = 0; i < res.length; i++) {
      if(i%2!==0) {
        res[i] = '(' + res[i] + ')';
      }
    }
    console.log(res);
    self.extractableRhythms = res;
  };


}]);
