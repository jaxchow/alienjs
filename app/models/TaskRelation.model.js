import Waterline from 'waterline'
//任务关系表
var TaskRelation = Waterline.Collection.extend({
  identity: 'taskRelation',
  connection: 'mongo',
  autoCreatedAt: false,
  autoUpdatedAt: false,
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
