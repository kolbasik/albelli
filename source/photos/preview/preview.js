(function(window, angular){
    'use strict';

    function PhotosPreviewController(PhotosService) {
        var vm = this;

        vm.photos = PhotosService.selected || [];
        vm.upload = function(files) {
            return PhotosService.upload(files);
        };
        vm.progress = function() {
            return PhotosService.progress;
        };
    }
    PhotosPreviewController.$inject = ['PhotosService'];

    function PhotosPreview(){
        return {
            templateUrl: 'photos/preview/preview.html',
            scope: {},
            controllerAs: 'vm',
            controller: 'PhotosPreviewController'
        };
    }

    function PhotosPreloader(){
        return {
            template: '<div class="progress"><div class="determinate" style="width: 0"></div></div>',
            scope: {
                progress: '='
            },
            link: function(scope, element) {
                element.hide();
                var $determinate =element.find('.determinate');
                scope.$watch('progress', function (newValue, oldValue) {
                    if (newValue == oldValue) return;
                    var value = newValue;
                    if (value > 99) {
                        element.hide();
                    } else{
                        element.show();
                        $determinate.css('width', (value || 0) + "%");
                    }
                })
            }
        };
    }

    function PhotosDragAndDropDirective(){
        var document = angular.element(window.document);
        return {
            link: function(scope, element, attrs){
                var className = attrs['photos-dnd'] || 'photos-dnd';
                element.on('dragenter', onDragStart);
                element.on('drop', onDragEnd);
                document.on('mouseenter', onDragEnd); // TODO: needs to unsubscribed on destroeyng the directive

                function onDragStart(){
                    element.addClass(className);
                }

                function onDragEnd() {
                    element.removeClass(className);
                }
            }
        };
    }

    angular.module('Photos.Preview', ['Photos.Service'])
        .controller('PhotosPreviewController', PhotosPreviewController)
        .directive('photosPreview', PhotosPreview)
        .directive('photosPreloader', PhotosPreloader)
        .directive('photosDnd', PhotosDragAndDropDirective)

})(window, angular);