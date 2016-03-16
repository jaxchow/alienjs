var Waterline = require('waterline');
var sailsMemoryAdapter = require('sails-memory');

var waterline = new Waterline();
var config = {
    adapters: {
        'sails-memory': sailsMemoryAdapter
    },
    connections: {
        default: {
            adapter: 'sails-memory'
        }
    }
}
/*
waterline.loadCollection(
	Waterline.Collection.extend(require('../models/Pet.js'))
);
waterline.initialize(config, function  (err, ontology) {
    if (err) {
        return done(err);
    }
    done();
});
*/

export default waterline
