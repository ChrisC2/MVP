'use strict';

// Declare app level module which depends on views, and components
var myApp = angular.module('myApp', [])
//-----------------------------------------------------------------------
// Controller creates the Google Maps View and fetches Current Location
.controller("MapsController", function ($scope, shareCoordinates){
  $scope.initMap = function () {
    var el = document.getElementById("map");
    //Create new map view
    var map = new google.maps.Map(el, {
         center: {lat: 34.050, lng: -118.250},
         zoom: 15
      });
      console.log("MAP CREATED :", map)
      //creates window
      var infoWindow = new google.maps.InfoWindow({map: map})
       //HTML5 geolocation:
       if (navigator.geolocation) {
         navigator.geolocation.getCurrentPosition(function(position) {
           var pos = {
             lat: position.coords.latitude,
             lng: position.coords.longitude
           };
           //Store coordinates in service for access to Igcontroller;
           shareCoordinates.setLat(position.coords.latitude);
           shareCoordinates.setLng(position.coords.longitude);
           console.log("lat: ", shareCoordinates.getLat());
           console.log("lng :", shareCoordinates.getLng())
           infoWindow.setPosition(pos); //takes object of coordinates
           infoWindow.setContent('You are here  ');
           map.setCenter(pos);

         }, function() {
           handleLocationError(true, infoWindow, map.getCenter());
         });
       } else {
         handleLocationError(false, infoWindow, map.getCenter());
       }

   }


});
//----------------------------------------------------------------------------
//Instagram controller. Calls GET request to IG API through factory
myApp.controller("IgController", function ($scope, InstagramService){
//Array stores photo URL's
$scope.photoStorage = [];
//resets the photoStorage array to an empty array
$scope.reset = function () {
  $scope.photoStorage = [];
}
$scope.getPhotos = function () {
//filters GET request object
var fetch = function () {
  var results = InstagramService.getData()
    .then(function (resObject) {
      resObject.data.forEach(function (item) {
        var urls = item.images.standard_resolution.url
        $scope.photoStorage.push(urls);
      })
        console.log("controller storage: ", $scope.photoStorage)
      });
    }
    // If there is nothing in $scope.photoStorage fetch and populate the array
  if($scope.photoStorage[0] === null) {
    fetch();
    } else {
      // Else the array has already been populated. Clear first then repopulate with new images
      $scope.reset();
      fetch();
    }
  }
});
//--------------------------------------------------------------------------
//Service created to store and reference location variables for Instagram's API call
myApp.service("shareCoordinates", function () {
  var lat;
  var lng;
  return {
    getLat: function () {
      return lat;
    },
    getLng: function () {
      return lng
    },
    setLat: function(value) {
      lat = value;
            },
    setLng: function(value) {
      lng = value;
            }
  }

})
//----------------------------------------------------------------------------
//Factory calls Instagram API. Fetches Data using the coordinates stored within Service
myApp.factory("DataFactory", function ($http, shareCoordinates) {

var getData = function (search) {
  return $http({
    method: "GET",
    url: "https://api.instagram.com/v1/media/search?lat=" + shareCoordinates.getLat() + "&lng="+ shareCoordinates.getLng() + "&distance=5000&access_token=" + tokenKey.key,
    data: search
  }).then(function(res) {
    console.log(res.data)
    return res.data
  })
}
  return {
    getData: getData
  }
})
