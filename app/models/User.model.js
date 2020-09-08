import Waterline from 'waterline'
import moment from 'moment'
// 用户表
var User = Waterline.Collection.extend({
  identity: 'user',
	connection: 'mongo',
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
    // 手机号
    phoneNumber:{
      type:'string'
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
    getBirthday:function(){
	return moment(this.birthday).format('YYYY-MM-DD')
    },
    toJSON:function(){
      var obj = this.toObject();
      obj.birthday=this.getBirthday();
      return obj;
    }
  }

});


module.exports= User;
