import {expect} from 'chai'
import Waterline from 'waterline'
import sailsMemoryAdapter from 'sails-memory'
import MongoAdapter from "sails-mongo"
import Task from '../Task.model'

const waterline = new Waterline();
const config = {
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
      // url:"mongodb://127.0.0.1:27017/db",
      host: "127.0.0.1",
      port: 27017,
      database: "db"
    }
  },
  defaults: {
    migrate: "alter",
  }
}
var dbs;


describe("User model", function() {
  beforeAll(function(done){
    waterline.loadCollection(Task)
    waterline.initialize(config, function  (err, ontology) {
      if (err) {
          return done(err);
      }
      done()
    });
  })
  
  it("should be findOne user by {1}", async()=>{
    let Task = waterline.collections.task;
    let expected={
      id:"1"
    }
    // let user=await User.findOne("5f5cc301e4b557000962bd09")
    await Task.update({_id:"5f5cc301e4b557000962bd09"},{
        successTotal:2
    })
    // console.log(user)
    // expect(user).to.include(expected)
  })

  
});
