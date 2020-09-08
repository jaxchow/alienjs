import Waterline from 'waterline'
//设备类型表
var TaskRelation = Waterline.Collection.extend({
  identity: 'task',
  connection: 'mongo',
  attributes: {
    id:{
      type:'objectid',
      unique: true,
      primaryKey: true,
    },
    userId:{
      type:'string'
    },
    taskId:{
      type:'string'
    },
    dataId:{
      type:'string'
    },
  },
});


module.exports= TaskRelation;
