import Waterline from 'waterline'
import moment from 'moment'
// 用户表
var User = Waterline.Collection.extend({
  identity: 'user',
  connection: 'mongo',
  attributes: {
    id:{
      type:'objectid',
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
    // 手机号
    phoneNumber:{
      type:'string'
    },
    // 生日
    birthday: {
      type: 'string',
    }

});


module.exports= User;
