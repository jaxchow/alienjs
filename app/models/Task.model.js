import Waterline from 'waterline'
//任务表
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
      type:'integer'
    },
    number:{
      type:'integer'
    },
    trainingType:{
      type:'string'
    }
  },
});


module.exports= Task;
