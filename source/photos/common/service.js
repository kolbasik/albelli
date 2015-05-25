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
                console.log('partial', that._files.length);

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