app.controller('AdminController', ['SongFactory', function(SongFactory) {
  var self = this;
  self.dropdowns = SongFactory.dropdowns;
  self.newSort = {};
  self.expandScaleMode = false;
  self.expandTeachableElements = false;
  self.expandMeter = false;
  self.expandFormType = false;
  self.expandSongType = false;
  
  self.deleteSort = function(sort, tableName) {
    SongFactory.deleteSort(sort, tableName);
  };

  self.addNewSort = function(newSort, tableName){
    SongFactory.addNewSort(newSort, tableName).then(function(response) {
      self.newSort = {};
    });
  };

}]);
