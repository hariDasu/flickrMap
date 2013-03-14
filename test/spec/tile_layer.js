describe("mapbox.tileLayer", function() {
    var server;

    beforeEach(function() {
        server = sinon.fakeServer.create();
    });

    afterEach(function() {
        server.restore();
    });

    describe("#setTileJSON", function() {
        it("sets min and max zoom", function() {
            var layer = new mapbox.tileLayer();
            expect(layer.setTileJSON(helpers.tileJSON)).to.eql(layer);
            expect(layer.options.minZoom).to.equal(0);
            expect(layer.options.maxZoom).to.equal(17);
        });

        it("sets attribution", function() {
            var layer = new mapbox.tileLayer();
            layer.setTileJSON(helpers.tileJSON);
            expect(layer.options.attribution).to.equal('Data provided by NatureServe in collaboration with Robert Ridgely');
        });

        it("sets tms option", function() {
            var layer = new mapbox.tileLayer();
            layer.setTileJSON(L.extend({}, helpers.tileJSON, {scheme: 'tms'}));
            expect(layer.options.tms).to.equal(true);
        });

        it("sets bounds", function() {
            var layer = new mapbox.tileLayer();
            layer.setTileJSON(helpers.tileJSON);
            expect(layer.options.bounds).to.eql(new L.LatLngBounds([[-85.0511, -180], [85.0511, 180]]));
        });

        it("can be reinitialized", function() {
            var layer = new mapbox.tileLayer();

            layer.setTileJSON(helpers.tileJSON);
            layer.setTileJSON(L.extend({}, helpers.tileJSON, {attribution: 'Terms', bounds: undefined, scheme: 'tms'}));

            expect(layer.options.attribution).to.equal('Terms');
            expect(layer.options.tms).to.equal(true);
            expect(layer.options.bounds).to.equal(undefined);
        });
    });

    describe("#setId", function() {
        it('returns self', function() {
            var layer = new mapbox.tileLayer();
            expect(layer.setId('mapbox.map-0l53fhk2')).to.eql(layer);
        });

        it('loads TileJSON from the appropriate URL', function() {
            var layer = new mapbox.tileLayer();
            layer.setId('mapbox.map-0l53fhk2');

            server.respondWith("GET", "http://a.tiles.mapbox.com/v3/mapbox.map-0l53fhk2.json",
                [200, { "Content-Type": "application/json" }, JSON.stringify(helpers.tileJSON)]);
            server.respond();

            expect(layer.getTileJSON()).to.eql(helpers.tileJSON);
        });
    });

    describe("#getTileJSON", function() {
        it('gets tilejson', function() {
            var layer = new mapbox.tileLayer();
            layer.setTileJSON(helpers.tileJSON);
            expect(layer.getTileJSON()).to.eql(helpers.tileJSON);
        });
    });

    describe("#getTileUrl", function() {
        it("distributes over the URLs in the tiles property", function() {
            var layer = new mapbox.tileLayer();
            layer.setTileJSON(helpers.tileJSON);
            expect(layer.getTileUrl({x: 0, y: 0, z: 0})).to.equal('http://a.tiles.mapbox.com/v3/examples.map-8ced9urs/0/0/0.png');
            expect(layer.getTileUrl({x: 1, y: 0, z: 0})).to.equal('http://b.tiles.mapbox.com/v3/examples.map-8ced9urs/0/1/0.png');
            expect(layer.getTileUrl({x: 2, y: 0, z: 0})).to.equal('http://c.tiles.mapbox.com/v3/examples.map-8ced9urs/0/2/0.png');
            expect(layer.getTileUrl({x: 3, y: 0, z: 0})).to.equal('http://d.tiles.mapbox.com/v3/examples.map-8ced9urs/0/3/0.png');
            expect(layer.getTileUrl({x: 4, y: 0, z: 0})).to.equal('http://a.tiles.mapbox.com/v3/examples.map-8ced9urs/0/4/0.png');
        });
    });
});
