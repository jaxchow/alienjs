"use strict";
import Waterline from "waterline";
import sailsDesk from "sails-disk";

let orm = new Waterline();

export function initialize(callback) {
	var User = require("./User.model");
	var Catalog = require('./Catalog.model')
	var Plant = require("./Plant.model")
	var PlantInfo = require("./PlantInfo.model")
	var Data = require("./Data.model")
	var Device = require("./Device.model")
	var Article = require("./Article.model")
	orm.loadCollection(User);
	orm.loadCollection(Catalog);
	orm.loadCollection(Plant);
	orm.loadCollection(PlantInfo);
	orm.loadCollection(Data);
	orm.loadCollection(Device);
	orm.loadCollection(Article);
	orm.initialize(
		{
			adapters: {
				default: sailsDesk,
			},
			config: {
				filePath: "db/",
				schema: false,
			},
			connections: {
				default: {
					adapter: "default",
				},
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
