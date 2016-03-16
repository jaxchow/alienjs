import {expect} from 'chai'
import Waterline from 'waterline'
import sailsMemoryAdapter from 'sails-memory'

import User from '../User.model'

const waterline = new Waterline();
const config = {
  adapters: {
    'sails-memory': sailsMemoryAdapter
  },
  connections: {
    default: {
      adapter: 'sails-memory'
    }
  }
}
var dbs;


describe("User model", function() {
  before(function(done){
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
      id:'1',
      username:'jaxchow',
      email:'jaxchow@gmail.com',
      password:"1234"
    }
    let user=await User.create(expected)
    //console.log(user)
    expect(user).to.include(expected)
  //  done()
  })
  it("should be findOne user by {1}", async()=>{
    let User = waterline.collections.user;
    let expected={
      id:"1",
      username:'jaxchow',
      email:'jaxchow@gmail.com',
      password:"1234"
    }
    let user=await User.findOne("1")
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
});
