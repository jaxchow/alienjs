import {expect} from 'chai'
import Waterline from 'waterline'
import sailsMemoryAdapter from 'sails-memory'
import MongoAdapter from "sails-mongo"

import User from '../User.model'

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


describe("User model", function() {
  beforeAll(function(done){
    waterline.loadCollection(User)
    waterline.initialize(config, function  (err, ontology) {
      if (err) {
          return done(err);
      }
      done()
    });
  })
  it('should be add user model',async()=>{
    let User = waterline.collections.user;
    let expected={
      name:'jaxchow',
    }
		let user=await User.create(expected)
    expect(user).to.include(expected)
  })
  it("should be findOne user by {1}", async()=>{
    let User = waterline.collections.user;
    let expected={
      id:"1"
    }
    let user=await User.findOne("1")
    console.log(expect(user).to)
    expect(user).to.include(expected)
  })

  it("should be remove user by {1}", async()=>{
    let User = waterline.collections.user;
    let expected={
      username:'jaxchow',
      email:'jaxchow@gmail.com',
    }
    let user=await User.destroy("1")
    expect(user[0]).to.include(expected)
  })

  it('findOne',async()=>{
    let User = waterline.collections.user;
    let data = await User.findOne("5fddf7e0d8f14c43e36e5f72")
    console.log(data)
  })
});
