(function(angular){
    'use strict';


    function PhotosUploadController(PhotosService) {
        var vm = this;

        vm.upload = function(files) {
            PhotosService.upload(files);
        };
    }
    PhotosUploadController.$inject = ['PhotosService'];

    function PhotosUpload() {
        return {
            templateUrl: 'photos/upload/upload.html',
            scope: {},
            controllerAs: 'vm',
            controller: 'PhotosUploadController'
        };
    }

    angular.module('Photos.Upload', ['Photos.Service', 'ngFileUpload'])
        .controller('PhotosUploadController', PhotosUploadController)
        .directive('photosUpload', PhotosUpload);

})(angular);