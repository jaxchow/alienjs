import Router from 'koa-router'

let router= Router({
  prefix: 'rank'
})

// 用户排行(已登录)
router.get('/:userId',async (ctx,next)=>{
  let Data = ctx.app.context.db.data;
  let Catalog = ctx.app.context.db.catalog;
  let User = ctx.app.context.db.user;
  let userId = Number(ctx.params.userId)
  let param = ctx.query // startDate endDate startNum endNum type
  let endDate = param.endDate+'T23:59:59Z'
  let myData = {}
  let catalogData = await Catalog.findOne(param.catalogId)
  if(!catalogData){
    ctx.body = {}
  }else{
    // 排行的用户数据
    let list = await Data.find(
      {
        where:{
          updatedAt:{
            '>':param.startDate,
            '<':endDate
          },
          catalogId:param.catalogId
        },
        groupBy:['userId'],
        sum:['calorie','value']
      }
    )
    .sort('value desc','calorie desc')

    for(let i = 0;i<list.length;i++){
      let userData = await User.findOne(list[i].userId)
      list[i].user = userData?userData:{}
      list[i].rank = i+1
    }

    for(let i = 0;i<list.length;i++){
      if(list[i].userId == userId){
        myData = list[i]
        break
      }
    }
    let cutList = list.slice(param.startNum,Number(param.endNum)+1)
    ctx.body = {
      myData:myData,
      total:list.length,
      list:cutList,
      catalogId:catalogData.id,
      type:catalogData.type,
      unit:catalogData.unit
    }
  }
});

// 用户排行(未登录)
router.get('/',async (ctx,next)=>{
  let Data = ctx.app.context.db.data;
  let Catalog = ctx.app.context.db.catalog;
  let User = ctx.app.context.db.user;
  let param = ctx.query // startDate endDate startNum endNum type
  let endDate = param.endDate+'T23:59:59Z'
 
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
  for(let i = 1;i<=list.length;i++){
    let userData = await User.find(list[i-1].userId)
    list[i-1].user = userData
    list[i-1].rank = i+Number(param.startNum)
  }
  let catalogData = await Catalog.findOne(param.catalogId)
  if(!catalogData){
    ctx.body={}
  }else{
    let total = await Data.count(
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
    )
    ctx.body = {
      total:total,
      list:list,
      catalogId:catalogData.id,
      type:catalogData.type,
      unit:catalogData.unit,
    }
  }
  
});

router.allowedMethods();

export default router
