import Waterline from 'waterline'
//我的数据表
var Data = Waterline.Collection.extend({
  identity: 'data',
  connection: 'default',
  attributes: {
    id:{
      type:'integer',
      autoIncrement: true,
      unique: true,
      primaryKey: true,
    },
    // 设备id
    deviceId:{
      type:'integer',
    },
    // 用户id
    userId:{
      type:'integer'
    },
    // 设备类型id
    catalog_id: {
      type: 'integer',
    },
    // 单位数量
    value: {
      type: 'integer',
    },
    // 设备单位
    unit: {
      type: 'string',
    },
    // 卡路里（千卡）
    calorie: {
      type: 'integer',
    },
    // 运动时间（s）
    time: {
      type: 'integer',
    },
    // 甩脂数（g）
    fatcut: {
      type: 'integer',
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


module.exports= Data;
