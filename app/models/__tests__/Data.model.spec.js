import {expect} from 'chai'
import Waterline from 'waterline'
import MongoAdapter from "sails-mongo"

import Data from '../Data.model'

const waterline = new Waterline();
const config = {
  adapters: {
    mongo: MongoAdapter,
  },
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
  }
}
var dbs;


describe("Data model", function() {
  beforeAll(function(done){
    waterline.loadCollection(Data)
    waterline.initialize(config, function  (err, ontology) {
      if (err) {
          return done(err);
      }
      done()
    });
  })
  

  it('findOne',async()=>{
    let Data = waterline.collections.data;
    let data = await Data.findOne("5fd770111d3815c566cd3192")
    console.log(data)
  })
});
