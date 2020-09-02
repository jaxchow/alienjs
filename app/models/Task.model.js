import Waterline from 'waterline'
//设备类型表
var Task = Waterline.Collection.extend({
  identity: 'task',
  connection: 'default',
  autoCreatedAt: false,
  autoUpdatedAt: false,
  attributes: {
    id:{
      type:'integer',
      autoIncrement: true,
      unique: true,
      primaryKey: true,
    },
    name:{
      type:'string',
    },
    description:{
      type:'string'
    }
  },
});


module.exports= Task;
