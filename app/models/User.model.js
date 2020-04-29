import Waterline from 'waterline'
// 用户表
var User = Waterline.Collection.extend({
  identity: 'user',
  connection: 'default',
  attributes: {
    id:{
      type:'integer',
      autoIncrement: true,
      unique: true,
      primaryKey: true,
    },
    unionId:{
      type:'string',
    }, 
    //名称
    name:{
      type:'string',
    },
    // 头像
    avatar:{
      type:'string'
    },
    // 性别
    sex: {
      type: 'string',
    },
    // 生日
    birthday: {
      type: 'date',
    },
    // 身高（cm）
    height: {
      type: 'integer',
    },
    // 体重（kg）
    weight: {
      type: 'integer',
    },
    // 腰围（cm）
    waistline: {
      type: 'integer',
    },
  }

});


module.exports= User;
