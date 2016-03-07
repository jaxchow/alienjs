import Waterline from 'waterline'
import {bcrypt} from 'bcrypt'

var User = Waterline.Collection.extend({
  identity: 'user',
  connection: 'default',
  attributes: {
    id:{
      type:'string',
      required:true
    },
    email: {
        type: 'string',
        required: true,
        email: true
    },
    password: {
        type: 'string',
        password: true,
        minLength: 6,
        maxLength: 21
    },
    passwordConfirmation: function(){
        return this.passwordConfirmation;
    }
  },
  //custom validation rules
  types: {
      password: function(password) {
          return password === this.passwordConfirmation;
      }
  },
  beforeCreate: function(values, next) {
      bcrypt.hash(values.password, 10, function(err, hash) {
          if(err)
              return next(err);
          values.password = hash;
          next();
      });
  }
});


module.exports= User;
