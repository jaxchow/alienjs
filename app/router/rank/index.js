import Router from 'koa-router'

let router= Router({
  prefix: 'rank'
})

// 用户排行
router.get('/',async (ctx,next)=>{
	let result = Object.create(null)
  let Data = ctx.app.context.db.data;
  let userId = ctx.params.userId
  let param = ctx.query // startDate endDate startNum endNum type
  let endDate = param.endDate+' 23:59:59'
  let myData = await Data.find().where(
    {
      updatedAt:{
        '>=':param.startDate,
        '<=':endDate
      },
      catalogId:param.type,
      userId:userId
    }
  )
  let list = await Data.find().where(
    {
      updatedAt:{
        '>=':param.startDate,
        '<=':endDate
      },
      catalogId:param.type
    }
  )
  result['exception']=false
  result['msg']='请求成功'
  result['total']=list.length
  result['list']=list
	ctx.body = result
});

router.allowedMethods();

export default router
