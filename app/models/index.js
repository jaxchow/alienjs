"use strict";
import Waterline from "waterline";
import sailsDesk from "sails-disk";
import MongoAdapter from "sails-mongo"

let orm = new Waterline();

export function initialize(callback) {
	var Task = require("./Task.model")
	var TaskRelation = require("./TaskRelation.model")
	var Body = require("./Body.model")
	var User = require("./User.model");
	var Catalog = require('./Catalog.model')
	var Data = require("./Data.model")
	var Device = require("./Device.model")
	var DeviceLog = require("./DeviceLog.model")
	orm.loadCollection(Task);
	orm.loadCollection(TaskRelation);
	orm.loadCollection(Body);
	orm.loadCollection(User);
	orm.loadCollection(Catalog);
	orm.loadCollection(Data);
	orm.loadCollection(Device);
	orm.loadCollection(DeviceLog);
	orm.initialize(
		{
			adapters: {
				default: "mongo",
				mongo: MongoAdapter,
				host: "127.0.0.1",
				port: 27017,
				database: "db"

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
					// url:"mongodb://127.0.0.1:27017/db",
					host: "127.0.0.1",
					port: 27017,
					database: "db"
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
