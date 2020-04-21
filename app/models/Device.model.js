import Waterline from 'waterline'
//我的设备表
var Device = Waterline.Collection.extend({
  identity: 'device',
  connection: 'default',
  attributes: {
    id:{
      type:'integer',
      autoIncrement: true,
      unique: true,
      primaryKey: true,
    },
    // 用户id
    userId:{
      type:'integer',
    },
    // 设备类型id
    catalog_id:{
      type:'integer'
    },
    // 蓝牙地址
    mac: {
      type: 'string',
    },
    // 固件版本号
    version: {
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


module.exports= Device;
