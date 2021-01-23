import Waterline from 'waterline'
//设备类型表
var Body = Waterline.Collection.extend({
  identity: 'body',
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
    value:{
      type:'float'
    },
    goalValue:{
      type:'float'
    },
    //weight height bust waist hips bmi heart
    valueType:{
      type:'string'
    },
    date:{
      type:'date'
    },
    // // 体重(kg)
    // weight:{
    //   type:'float',
    // },
    // // 目标体重(kg)
    // goalWeight:{
    //   type:'float',
    // },
    // // 身高(cm)
    // height:{
    //   type:'float'
    // },
    // // 目标身高(cm)
    // goalHeight:{
    //   type:'float'
    // },
    // // 胸围(cm)
    // bust:{
    //   type:'float'
    // },
    // // 目标胸围(cm)
    // goalBust:{
    //   type:'float'
    // },
    // // 腰围(cm)
    // waist: {
    //   type: 'float',
    // },
    // // 目标腰围(cm)
    // goalWaist: {
    //   type: 'float',
    // },
    // // 臀围(cm)
    // hips: {
    //   type: 'float',
    // },
    // // 目标臀围(cm)
    // goalHips: {
    //   type: 'float',
    // },
    // // BMI
    // bmi: {
    //   type: 'float',
    // },
    // // 目标BMI
    // goalBmi: {
    //   type: 'float',
    // },
    // // 心率(bmp)
    // heartRate: {
    //   type: 'integer',
    // },
    // // 目标心率(bmp)
    // goalHeartRate: {
    //   type: 'integer',
    // },
  },
});


module.exports= Body;
