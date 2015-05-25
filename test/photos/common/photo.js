describe('Photos Service: Photo', function () {

    var Photo;
    beforeEach(module('Photos.Service'));
    beforeEach(inject(function (_Photo_) {
        Photo = _Photo_;
    }));

    describe('Constructor', function () {

        it('should exist.', function () {
            expect(Photo).to.exist;
        });

        it('should create the Photo object.', function () {
            var photo = new Photo({});
            expect(photo).to.exist;
        });

        it('should copy the file name.', function () {
            var name = "TEST";
            var photo = new Photo({ name: name });
            expect(photo.name).to.equal(name);
        });

        it('should copy the file size.', function () {
            var size = 42;
            var photo = new Photo({ size: size });
            expect(photo.size).to.equal(size);
        });

        it('should copy the file path.', function () {
            var file = "test.png";
            var photo = new Photo({ file: file });
            expect(photo.file).to.equal(file);
        });

        it('should copy the file path.', function () {
            var photo = new Photo({});

            expect(photo).to.have.property('src');
        });

        it('should initialize the thumbnail field.', function () {
            var photo = new Photo({});

            expect(photo.thumbnail).to.equal('');
        });

        it('should initialize the selected field.', function () {
            var photo = new Photo({});

            expect(photo.selected).to.equal(false);
        });

    });

});