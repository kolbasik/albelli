(function(angular){
    'use strict';

    function PhotosListController(PhotosService) {
        var vm = this;

        vm.photos = PhotosService.photos || [];
        vm.select = function(photo) {
            PhotosService.select(photo);
        }
    }
    PhotosListController.$inject = ['PhotosService'];

    function PhotosList(){
        return {
            templateUrl: 'photos/list/list.html',
            scope: {},
            controllerAs: 'vm',
            controller: 'PhotosListController'
        };
    }

    angular.module('Photos.List', ['Photos.Service'])
        .controller('PhotosListController', PhotosListController)
        .directive('photosList', PhotosList)

})(angular);