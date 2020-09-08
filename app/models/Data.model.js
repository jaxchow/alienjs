import Waterline from 'waterline'
//我的数据表
var Data = Waterline.Collection.extend({
  identity: 'data',
	connection: 'mongo',
  attributes: {
    id:{
      type:'string',
      unique: true,
      primaryKey: true,
    },
    // 设备id
    deviceId:{
      type:'string',
    },
    // 用户id
    userId:{
      type:'string'
    },
    // 设备类型id
    catalogId: {
      type: 'string',
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
      type: 'float',
    },
    //训练类型
    trainingType:{
      type: 'string'
    }
  },
});


module.exports= Data;
