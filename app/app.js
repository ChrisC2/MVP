'use strict';

// Declare app level module which depends on views, and components
var myApp = angular.module('myApp', [
  'ngRoute'
])
// myApp.config(['$routeProvider', function($routeProvider) {
//   $routeProvider.otherwise({redirectTo: '/view1'});
// }]);

.controller("map", function ($scope, mapFactory){
$scope.data = {};
  mapFactory.postMap()
    .then(function(data){
            console.log(data)
            console.log($scope.data, "incoming data");

            $scope.data = data;
        });

  $scope.initMap = function () {
      var map = new google.maps.Map(document.getElementById('map'), {
         center: {lat: -34.397, lng: 150.644},
         zoom: 6
      });
    }

    $scope.initMap();

// $scope.postMap($scope.data);
// $scope.getMap($scope.data);
// console.log("postMAP: ", $scope.postMap($scope.data));
// console.log("getMAP: ", $scope.getMap($scope.data));

});

myApp.factory("mapFactory", function ($http) {
// var getMap = function (map) {
//   return $http({
//     method: "GET",
//     url: "https://maps.googleapis.com/maps/api/js",
//     data: map
//   }).then(function(res) {
//     console.log(res.data);
//     return res.data
//   })
// }
  var postMap = function (map) {
    return $http({
      method: "POST",
      url: "https://maps.googleapis.com/maps/api/js",
      data: map
    })
    .then(function (resp) {
      console.log(resp.data)
      return resp.data
    });
  }

  return {
    postMap: postMap,
    // getMap: getMap
  }
})
