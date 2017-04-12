app.controller('NewSongController', ['SongFactory', function(SongFactory) {

  var self = this;

  self.message = 'This is the NewSongController View';

  // self.showPicker = SongFactory.showPicker;

  self.showPicker= function() {
    var client = filestack.init(fileStackAPI);
    console.log('merp');
      client.pick({
      }).then(function(result) {
          console.log(JSON.stringify(result.filesUploaded));
      });
  };

  self.example1model = [];
  self.example1data = [ {id: 1, label: "David"}, {id: 2, label: "Jhon"}, {id: 3, label: "Danny"} ];

}]);
