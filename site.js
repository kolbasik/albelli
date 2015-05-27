(function(window, Materialize){
    'use strict';

    if(Materialize) {
        window.onerror = function onError(errorMsg, url, line, column, errorObj) {
            var message = [
                'Error: ' + errorMsg,
                'Script: ' + url,
                'Line: ' + line + ', Column: ' + column,
                'StackTrace: ' +  errorObj.stack
            ].join('\n');
            Materialize.toast(message.substring(0, 100), 4000);
            return false;
        };
    }

})(window, window.Materialize);
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
(function(window, angular, URL){
    'use strict';

    function Photo(file) {
        if (!file) file = {};
        this.title = file.name + ' / ' + file.size + ' bytes';
        this.name = file.name;
        this.size = file.size;
        this.file = file.file;
        this.src = URL.createObjectURL(file);
        this.thumbnail = '';
        this.selected = false;
    }

    function PhotosService($q, $timeout) {
        this.$q = $q;
        this.$timeout = $timeout;
        this._files = [];
        this._total = 0;
        this.progress = 0;
        this.photos = [];
        this.selected = [];
    }
    PhotosService.$inject = ['$q', '$timeout'];

    PhotosService.prototype._append = function(photos) {
        if (this.photos.length === 0) {
            this.select(photos[0]);
        }
        this.photos.push.apply(this.photos, photos);
    };

    PhotosService.prototype.select = function(photo) {
        var previous = this.selected[0];
        if (previous) {
            previous.selected = false;
        }
        photo.selected = true;
        this.selected[0] = photo;
    };

    PhotosService.prototype.upload = function(files, options) {
        var that = this,
            deferred = that.$q.defer(),
            defaults = {
                batch: 5,
                timeout: 50,
                thumbnail: 200
            };
        options = angular.extend({}, defaults, options || {});

        if (!files || files.length === 0) {
            deferred.resolve(that);
        }
        else {
            that._files.push.apply(that._files, files);
            that._total = that._files.length;

            that.partial = function partial(){
                if(that._files.length === 0) {
                    return deferred.resolve(that);
                }
                var photos = that._files.splice(0, options.batch).map(function(file){
                    return new Photo(file);
                });
                that.$q.all(photos.map(function(photo){
                    return that.resize(photo.src, options.thumbnail).then(function(thumbnail) {
                        photo.thumbnail = thumbnail;
                    });
                })).then(function() {
                    that._append(photos);
                    that.progress = 100 - (that._files.length / that._total) * 100;
                    deferred.notify(that.progress);
                    that.$timeout(that.partial, options.timeout);
                }, function(error){
                    deferred.reject(error);
                });
            };
            that.$timeout(that.partial, options.timeout);
        }

        return deferred.promise;
    };

    PhotosService.prototype.resize = function(src, width, type, quality){
        var that = this;

        type = type || 'image/jpeg';
        quality = quality || 0.92;

        return this.$q(function(resolve){
            var canvas = document.createElement('canvas'),
                ctx = canvas.getContext("2d"),
                image = new Image();

            image.onload = function () {
                canvas.width = width;
                canvas.height = canvas.width * (image.height / image.width);
                ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

                that.$timeout(function () {
                    canvas.toBlob(function (blob) {
                        that.$timeout(function () {
                            var dst = URL.createObjectURL(blob);
                            resolve(dst);
                        });
                    }, type, quality );
                }, 0);
            };
            image.src = src;
        });
    };

    angular.module('Photos.Service', [])
        .factory('Photo', function () { return Photo; })
        .service('PhotosService', PhotosService);

})(window, angular, window.URL || window.webkitURL);
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