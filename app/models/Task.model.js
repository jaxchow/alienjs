import Waterline from 'waterline'
//设备类型表
var Task = Waterline.Collection.extend({
  identity: 'task',
  connection: 'mongo',
  autoCreatedAt: false,
  autoUpdatedAt: false,
  attributes: {
    id:{
      type:'objectid',
      unique: true,
      primaryKey: true,
    },
    name:{
      type:'string',
    },
    description:{
      type:'string'
    },
    time:{
      type:'number'
    },
    number:{
      type:'number'
    },
    trainingType:{
      type:'string'
    }
  },
});


module.exports= Task;
