import Waterline from 'waterline'
//设备类型表
var TaskRelation = Waterline.Collection.extend({
  identity: 'task',
  connection: 'default',
  attributes: {
    id:{
      type:'integer',
      autoIncrement: true,
      unique: true,
      primaryKey: true,
    },
    userId:{
      type:'integer'
    },
    taskId:{
      type:'integer'
    },
    dataId:{
      type:'integer'
    },
  },
});


module.exports= TaskRelation;
