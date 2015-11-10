angular.module('app.controllers', ['ionic'])

.controller("MapsController", ['$scope', '$ionicLoading', 'InstagramService', function ($scope, $ionicLoading, InstagramService){

  $scope.loading = $ionicLoading.show({
          template: '<p class="loading-text">Getting Your Current Location...</p><ion-spinner icon="ripple"></ion-spinner>',
        });

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

           var marker = new google.maps.Marker({
             position: pos,
             map: map,
             title: 'You Are Here!'
           });
           //Store coordinates in service for access to Igcontroller;
           InstagramService.setLat(position.coords.latitude);
           InstagramService.setLng(position.coords.longitude);
           $ionicLoading.hide()
           map.setCenter(pos);
           $ionicLoading.hide()

         }, function() {
           handleLocationError(true, infoWindow, map.getCenter());
         });
       } else {
         handleLocationError(false, infoWindow, map.getCenter());
       }

   }


}])
//----------------------------------------------------------------------------
//Instagram controller. Calls GET request to IG API through factory
.controller("IgController", ['$scope', 'InstagramService', '$ionicModal', function ($scope, InstagramService, $ionicModal){
//Array stores photo URL's
$scope.photoStorage = [];

$ionicModal.fromTemplateUrl('index.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

$scope.openModal = function(index) {
  $scope.photo = $scope.photoStorage[index]
  $scope.modal.show();
 };
$scope.closeModal = function() {
   $scope.modal.hide();
 };

$scope.$on('$destroy', function() {
   $scope.modal.remove();
});
//resets the photoStorage array to an empty array
$scope.reset = function () {
  $scope.photoStorage = [];
}
$scope.getPhotos = function () {
//filters GET request object
var fetch = function () {
  var lat = InstagramService.getLat();
  var lng = InstagramService.getLng();
  InstagramService.getData(lat, lng)
  .then(function(resObject) {
      resObject.data.data.forEach(function (item) {
        var urls = item.images.standard_resolution.url;
        $scope.photoStorage.push(urls);
      })
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
}]);
