import Waterline from 'waterline'
//设备类型表
var Body = Waterline.Collection.extend({
  identity: 'body',
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
    // 体重(kg)
    weight:{
      type:'float',
    },
    // 身高(cm)
    height:{
      type:'float'
    },
    // 胸围(cm)
    bust:{
      type:'float'
    },
    // 腰围(cm)
    waist: {
      type: 'float',
    },
    // 臀围(cm)
    hips: {
      type: 'float',
    },
    // BMI
    bmi: {
      type: 'float',
    },
    // 心率(bmp)
    heartRate: {
      type: 'integer',
    },
  },
});


module.exports= Body;
