import Waterline from 'waterline'
//文章表
var Article = Waterline.Collection.extend({
  identity: 'article',
  connection: 'default',
  attributes: {
    id:{
      type:'integer',
      autoIncrement: true,
      unique: true,
      primaryKey: true,
    },
    // 栏目id
    columnId:{
      type:'integer',
    },
    // 标题
    title:{
      type:'string'
    },
    // 正文
    content: {
      type: 'string',
    },
    // 图片
    pic: {
      type: 'string',
    },
    // 浏览数
    views: {
      type: 'integer',
    },
    // 标签
    tag: {
      type: 'string',
    },
    // 点赞数
    praiseNumber: {
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


module.exports= Article;
