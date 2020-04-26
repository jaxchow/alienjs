import Router from 'koa-router'

let router= Router({
  prefix: 'rank'
})

// 用户排行(已登录)
router.get('/:userId',async (ctx,next)=>{
	let result = Object.create(null)
  let Data = ctx.app.context.db.data;
  let userId = Number(ctx.params.userId)
  let param = ctx.query // startDate endDate startNum endNum type
  let endDate = param.endDate+' 23:59:59'
  // 当前用户的数据
  let myData 
  // 排行的用户数据
  let list = await Data.find(
    {
      where:{
        updatedAt:{
          '>=':param.startDate,
          '<=':endDate
        },
        catalogId:param.type
      },
      groupBy:['userId'],
      sum:['calorie','value']
    }
  ).sort('value desc','calorie desc')

  for(let i = 0;i<list.length;i++){
    list[i].rank = i
  }

  for(let i = 0;i<list.length;i++){
    if(list[i].userId === userId){
      myData = list[i]
      break;
    }
  }

  result['exception']=false
  result['msg']='请求成功'
  result['total']=list.length
  result['list']=list
  result['myData']=myData
	ctx.body = result
});

// 用户排行(未登录)
router.get('/',async (ctx,next)=>{
	let result = Object.create(null)
  let Data = ctx.app.context.db.data;
  let param = ctx.query // startDate endDate startNum endNum type
  let endDate = param.endDate+' 23:59:59'
 
  // 排行的用户数据
  let list = await Data.find(
    {
      where:{
        updatedAt:{
          '>=':param.startDate,
          '<=':endDate
        },
        catalogId:param.type
      },
      groupBy:['userId'],
      sum:['calorie','value']
    }
  ).sort('value desc','calorie desc')
  
  for(let i = 0;i<list.length;i++){
    list[i].rank = i
  }

  result['exception']=false
  result['msg']='请求成功'
  result['total']=list.length
  result['list']=list
	ctx.body = result
});

router.allowedMethods();

export default router
