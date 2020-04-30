import Router from 'koa-router'

let router= Router({
  prefix: 'rank'
})

// 用户排行(已登录)
router.get('/:userId',async (ctx,next)=>{
  let Data = ctx.app.context.db.data;
  let Catalog = ctx.app.context.db.catalog;
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
        catalogId:param.catalogId
      },
      groupBy:['userId'],
      sum:['calorie','value']
    }
  ).sort('value desc','calorie desc').skip(param.startNum).limit(param.endNum-param.startNum+1)

  for(let i = 0;i<list.length;i++){
    if(list[i].userId === userId){
      myData = list[i]
      break;
    }
  }
  let catalogData = await Catalog.findOne(param.type)

	ctx.body = {
    myData:myData,
    list:list,
    catalogId:catalogData.id,
    type:catalogData.type,
    unit:catalogData.unit
  }
});

// 用户排行(未登录)
router.get('/',async (ctx,next)=>{
  let Data = ctx.app.context.db.data;
  let Catalog = ctx.app.context.db.catalog;
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
        catalogId:param.catalogId
      },
      groupBy:['userId'],
      sum:['calorie','value']
    }
  ).sort('value desc','calorie desc').skip(param.startNum).limit(param.endNum-param.startNum+1)
  let catalogData = await Catalog.findOne(param.type)
  
  console.log(catalogData)
	ctx.body = {
    list:list,
    catalogId:catalogData.id,
    type:catalogData.type,
    unit:catalogData.unit,
  }
});

router.allowedMethods();

export default router
