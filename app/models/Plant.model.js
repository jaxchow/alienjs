import Waterline from 'waterline'
//用户附加表
var Plant = Waterline.Collection.extend({
  identity: 'plant',
  connection: 'default',
  attributes: {
    userId:{
      type:'integer',
      autoIncrement: true,
      unique: true,
      primaryKey: true,
    },
    //我想要
    want:{
      type:'string',
    },
    //每周运动
    weekly:{
      type:'string'
    },
    //健康状态
    health: {
      type: 'string',
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


module.exports= Plant;
