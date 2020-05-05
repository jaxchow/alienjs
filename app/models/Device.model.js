import Waterline from 'waterline'
//我的设备表
var Device = Waterline.Collection.extend({
  identity: 'device',
  connection: 'default',
  autoCreatedAt: false,
  autoUpdatedAt: false,
  attributes: {
    id:{
      type:'string',
      unique: true,
      primaryKey: true,
    },
    // 用户id
    userId:{
      type:'integer',
    },
    // 设备类型id
    catalogId:{
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
    // 我的目标
    index:{
      type:'integer'
    },
    // 蓝牙设备id
    deviceId:{
      type:'string'
    },
    // 蓝牙特征值对应服务的uuid
    serviceId:{
      type:'string'
    },
    // 蓝牙特征值的uuid
    characteristicId:{
      type:'string'
    },
    // 特征值最新的值
    value:{
      type:'integer'
    }
  },
});


module.exports= Device;
