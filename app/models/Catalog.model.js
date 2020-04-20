import Waterline from 'waterline'
//用户附加表
var Catalog = Waterline.Collection.extend({
  identity: 'catalog',
  connection: 'default',
  attributes: {
    id:{
      type:'integer',
      autoIncrement: true,
      unique: true,
      primaryKey: true,
    },
    // 设备描述
    description:{
      type:'string',
    },
    // 设备图片
    pic:{
      type:'string'
    },
    // 设备类型
    type: {
      type: 'string',
    },
    // 设备单位
    unit: {
      type: 'string',
    },
    // 操作指南
    refs: {
      type: 'string',
    },
    // 推荐指数
    defaultValue: {
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


module.exports= Catalog;
