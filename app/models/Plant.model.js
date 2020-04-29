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
      type:'integer',
    },
    //每周运动
    weekly:{
      type:'integer'
    },
    //健康状态
    health: {
      type: 'integer',
    },
  },
});


module.exports= Plant;
