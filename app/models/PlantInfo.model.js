import Waterline from 'waterline'
//用户附加表
var PlantInfo = Waterline.Collection.extend({
  identity: 'plantinfo',
	connection: 'mongo',
  autoCreatedAt: false,
  autoUpdatedAt: false,
  attributes: {
    Id:{
      type:'string',
      unique: true,
      primaryKey: true,
    },
    // 选项 want weekly health
    options:{
      type:'string'
    },
    // 选项代号
    itemCode:
    {
      type:'integer'
    },
    // 选项内容
    itemContent:{
      tyep:'string'
    },
  },
});


module.exports= PlantInfo;
