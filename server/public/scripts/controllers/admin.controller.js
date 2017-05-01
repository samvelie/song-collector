app.controller('AdminController', ['SongFactory', 'UserFactory', function(SongFactory, UserFactory) {
  var self = this;
  self.dropdowns = SongFactory.dropdowns;
  self.newSort = {};
  self.expandScaleMode = false;
  self.expandTeachableElements = false;
  self.expandMeter = false;
  self.expandFormType = false;
  self.expandSongType = false;
  self.expandLanguage = false;
  self.users = UserFactory.users;
  self.setAdminStatus = UserFactory.setAdminStatus;
  self.setActiveStatus = UserFactory.setActiveStatus;

  UserFactory.getAllUsers();

  self.deleteSort = function(sort, tableName) {
    SongFactory.deleteSort(sort, tableName);
  };

  self.addNewSort = function(newSort, tableName) {
    SongFactory.addNewSort(newSort, tableName).then(function() {
      // for (var i = 0; i < dropdowns.scaleMode.length; i++) {
      //   console.log(dropdowns.scaleMode[i].scale_mode);
      //   if(self.newSort == dropdowns.scaleMode[i].scale_mode)
      //     console.log('new Sort', self.newSort + 'scale mode', dropdowns.scaleMode[i].scale_mode);
      // }
      self.newSort = {};
    });
  };

}]);
