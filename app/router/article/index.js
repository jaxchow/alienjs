import Router from 'koa-router'

let router= Router({
  prefix: 'article'
})

// 文章推荐列表
router.get('/list',async (ctx,next)=>{
	let result = Object.create(null)
  let Article = ctx.app.context.db.article;
  let param = ctx.query // startNum endNum columnId？
  let list
  if(param.columnId){
  list = await Article.find().where(
    {
      columnId:param.columnId
    }
  )

  }
  
  result['exception']=false
  result['msg']='请求成功'
  result['total']=list.length
  result['list']=list
	ctx.body = result
});

router.allowedMethods();

export default router
