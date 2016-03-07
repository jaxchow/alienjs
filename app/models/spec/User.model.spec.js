import {expect} from 'chai'
import models from '../index.js'
import assert from 'assert'

var dbs;

function *setup(){
   return models.initialize(function(err, ontology){
  	if(err) throw err
  	dbs=ontology.collections
  	console.log('database adapter initialized connection')
  });
}

describe("User model", function() {
  var orm;
  before(function*() {
    orm = yield setup();
  });

  it("should be findOne user by 1", function*() {
    var expected={
      id:"1",
      username:'jaxchow'
    }
    let User=orm.collections.user
    let user=yield User.findOne("1")
    expect(user.toJSON()).to.eql(expected)

  });

  after(function*() {
  //  yield teardown();
  });
});
