import Waterline from 'waterline'

var User = Waterline.Collection.extend({
  identity: 'user',
  connection: 'default',
  attributes: {
    id:{
      type:'string',
      autoIncrement: true,
      unique: true,
      primaryKey: true,
    },
    icon:{
      type:'string'
    },
    username:{
      type:'string',
    },
    gender: {
      type: 'string',
    },
    birthday: {
      type: 'date',
      before:function(){    
        return new Date()
      }
    },
    height: {
      type: 'integer',
    },
    weight: {
      type: 'integer',
    },
    waistline: {
      type: 'integer',
    },
    createdAt: {
      type: 'date',
      before:function(){    
        return new Date()
      }
    },
    updatedAt: {
      type: 'date',
      before:function(){    
        return new Date()
      }
    },
  },
});


module.exports= User;
