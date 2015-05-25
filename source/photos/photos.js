(function(angular){
    'use strict';

    function PhotoService() {
        this.photos = [];
    }

    function PhotosView(){
        return {
            templateUrl: 'photos/photos.html'
        };
    }

    var PhotosApp = angular.module('PhotosApp', ['Photos.List', 'Photos.Preview', 'Photos.Upload']);
    PhotosApp.service('PhotoService', PhotoService);
    PhotosApp.directive('photosView', PhotosView);


})(angular);