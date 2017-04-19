app.directive('focusing', ['$timeout', function($timeout) {
  return {
    restrict: 'A',
    link : function($scope, $element) {
      $timeout(function() {
        $element[0].focus();
      });
    }
  };
}]);

app.directive('confirmOnExit', function() {
    return {
        link: function($scope, elem, attrs, ctrl) {
            window.onbeforeunload = function(){
                if ($scope[attrs["name"]].$dirty) {
                    return "Your edits will be lost.";
                }
            };
        }
    };
});
