import Waterline from 'waterline'

var User = Waterline.Collection.extend({
  identity: 'user',
  connection: 'default',
  attributes: {
    id:{
      type:'string',
      required:true
    },
    username:{
      type:'string',
      required:true
    },
    email: {
        type: 'string',
        required: true,
    },
    password: {
        type: 'string',
        required: true,
    },
    passwordConfirmation: function(){
        return this.passwordConfirmation;
    }
  },
});


module.exports= User;
