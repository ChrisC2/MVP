'use strict';

// Declare app level module which depends on views, and components
var myApp = angular.module('myApp', [])

.controller("MapsController", function ($scope, shareCoordinates){
  $scope.lat;
  $scope.lng;

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
           //Store coordinates in service for access;
           shareCoordinates.setLat(position.coords.latitude);
           shareCoordinates.setLng(position.coords.longitude);
           console.log("lat: ", shareCoordinates.getLat());
           console.log("lng :", shareCoordinates.getLng())
           infoWindow.setPosition(pos); //takes object of coordinates
           infoWindow.setContent('You are here');
           map.setCenter(pos);

         }, function() {
           handleLocationError(true, infoWindow, map.getCenter());
         });
       } else {
         handleLocationError(false, infoWindow, map.getCenter());
       }

   }


});


myApp.controller("IgController", function ($scope, DataFactory, shareCoordinates ){

$scope.photoStorage = [];
$scope.getPhotos = function () {
  var lat = shareCoordinates.getLat();
  var lng = shareCoordinates.getLng();
  console.log(lat, lng);
  var results = DataFactory.getData()
    .then(function (data) {
      data.data.forEach(function (item) {
        var urls = item.images.standard_resolution.url
        $scope.photoStorage.push(urls);
      })
console.log("controller storage: ", $scope.photoStorage)
});
}
});

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

myApp.factory("DataFactory", function ($http, shareCoordinates) {
var getData = function (search) {
  return $http({
    method: "GET",
    url: "https://api.instagram.com/v1/media/search?lat=" + shareCoordinates.getLat() + "&lng="+ shareCoordinates.getLng() + "&distance=5000&access_token=22125417.d904cd4.44abd06ef59d43e5b0fc7e9b4f347ebb",
    data: search
  }).then(function(res) {
    return res.data
  })


  }
  var postMap = function (map) {
    return $http({
      method: "POST",
      url: map,
      data: map
    })
    .then(function (resp) {
      console.log(resp.data)
      return resp.data
    });
  }

  return {
    // postMap: postMap,
    getData: getData
  }
})
