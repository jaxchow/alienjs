import Waterline from 'waterline'
//设备类型表
var Catalog = Waterline.Collection.extend({
  identity: 'catalog',
  connection: 'default',
  autoCreatedAt: false,
  autoUpdatedAt: false,
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
    // 设备名称
    name: {
      type: 'string',
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
    // 最大值    
    maxValue: {
      type: 'integer',
    },
    // 是否启用 
    isUse: {
      type: 'string',
    },
    // 颜色值 
    colorValue: {
      type: 'string',
    },
  },
});


module.exports= Catalog;
