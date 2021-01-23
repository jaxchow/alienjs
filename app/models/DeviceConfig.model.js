import Waterline from 'waterline'
import moment from 'moment'
// 用户表
var DeviceConfig = Waterline.Collection.extend({
  identity: 'deviceconfig',
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
      type:'string',
    },
    //名称
    catalogId:{
      type:'string',
    },
    musicType:{
      type:'string'
    },
    musicName:{
      type:'string'
    },
    voicePlay:{
      type:'string'
    },
    voiceInterval:{
      type:'float'
    }
  }

});


module.exports= DeviceConfig;
