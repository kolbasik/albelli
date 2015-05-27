(function(angular){
    'use strict';

    function PhotosView(){
        return {
            templateUrl: 'photos/photos.html'
        };
    }

    var PhotosApp = angular.module('PhotosApp', ['Photos.List', 'Photos.Preview', 'Photos.Upload']);
    PhotosApp.directive('photosView', PhotosView);

})(angular);