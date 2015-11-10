angular.module('app.services', ['ionic'])

.service('InstagramService', ['$http', function($http) {
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
      },
      getData: function(lat, lng) {
        return $http({
          method: 'GET',
          url: '/igcall?lat=' + lat + '&lng=' + lng
        })
      }
    }
}]);
