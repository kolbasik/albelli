describe('Photos Service: ', function () {

    window.onerror = function(error){
        console.log(error);
    };

    var $timeout, $rootScope, $scope, PhotosService, Photo;
    beforeEach(module('Photos.Service'));
    beforeEach(inject(function (_$timeout_, _$rootScope_, _PhotosService_, _Photo_) {
        $timeout = _$timeout_;
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();
        PhotosService = _PhotosService_;
        Photo = _Photo_;

    }));

    describe('Constructor', function () {

        it('should exist', function () {
            expect(PhotosService).to.be.ok;
        });

        it('should initialize the progress field.', function () {
            expect(PhotosService).to.have.property('progress');
            expect(PhotosService.progress).to.equal(0);
        });

        it('should initialize the photos field.', function () {
            expect(PhotosService).to.have.property('photos');
            expect(PhotosService.photos).to.be.empty;
        });

        it('should initialize the selected field.', function () {
            expect(PhotosService).to.have.property('selected');
            expect(PhotosService.selected).to.be.empty;
        });

    });

    describe('Select', function () {

        it('should mark the photo as selected.', function () {
            var photo = new Photo();

            PhotosService.select(photo);

            expect(photo.selected).to.equal(true);
        });

        it('should mark the previous selected photo as unselected.', function () {
            var photo = new Photo();

            PhotosService.select(photo);
            PhotosService.select(new Photo());

            expect(photo.selected).to.equal(false);
        });

    });

    describe('Upload', function () {

        it('should work with empty arguments.', function(done) {

            PhotosService.upload().then(function(){
                done();
            });

            $scope.$apply();
        });

    });

});