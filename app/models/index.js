"use strict";
import Waterline from "waterline";
import sailsDesk from "sails-disk";
import MongoAdapter from "sails-mongo"

let orm = new Waterline();

export function initialize(callback) {
	var User = require("./User.model");
	var Catalog = require('./Catalog.model')
	var Plant = require("./Plant.model")
	var PlantInfo = require("./PlantInfo.model")
	var Data = require("./Data.model")
	var Device = require("./Device.model")
	orm.loadCollection(User);
	orm.loadCollection(Catalog);
	orm.loadCollection(Plant);
	orm.loadCollection(PlantInfo);
	orm.loadCollection(Data);
	orm.loadCollection(Device);
	orm.initialize(
		{
			adapters: {
				default: "mongo",
				mongo: MongoAdapter,
			},
			// config: {
			// 	filePath: "db/",
			// 	schema: false,
			// },
			connections: {
				default: {
					adapter: "mongo",
				},
				mongo: {
					adapter: "mongo",
					// url:"mongodb://127.0.0.1:27017/sails",
					host: "127.0.0.1",
					port: 27017,
					database: "sails"
				}
			},
			defaults: {
				migrate: "alter",
			},
		},
		callback
	);
	// console.log(orm)
	return orm;
}
