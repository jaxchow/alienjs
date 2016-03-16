"use strict";
import Waterline from 'waterline'
import sailsDesk from 'sails-disk'

let orm = new Waterline()

function initialize(callback){
  var User= require('./User.model');
  var Book= require('./Book.model');
  orm.loadCollection(User);
  orm.loadCollection(Book);
  orm.initialize({
    adapters: {
         'default': sailsDesk,
     },
     config: {
      filePath: 'db/',
      schema: false
     },
     connections: {
         'default': {
             adapter: 'default',
         }
     },
     defaults: {
         migrate: 'alter'
     }
  },callback)
  return orm

}

export default {initialize};
