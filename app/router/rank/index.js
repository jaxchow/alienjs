import Router from 'koa-router'
import {successResData,failedRes} from '../../Utils/RouterResultUtils'

let router= Router({
  prefix: 'rank'
})

// 用户排行(已登录)
router.get('/:userId',async (ctx,next)=>{
  let Data = ctx.app.context.db.data;
  let Catalog = ctx.app.context.db.catalog;
  let User = ctx.app.context.db.user;
  let userId = ctx.params.userId
  let param = ctx.query // startDate endDate startNum endNum catalogId
  if(!param.catalogId){
    ctx.body=failedRes('缺少参数：catalogId')
    return
  }else if(!param.startDate){
    ctx.body=failedRes('缺少参数：startDate')
    return
  }else if(!param.endDate){
    ctx.body=failedRes('缺少参数：endDate')
    return
  }else if(!param.endNum){
    ctx.body=failedRes('缺少参数：endNum')
    return
  }else if(!param.startNum){
    ctx.body=failedRes('缺少参数：startNum')
    return
  }
  let endDate = param.endDate+'T23:59:59Z'
  let myData = {}
  let catalogData = await Catalog.findOne(param.catalogId)
  if(!catalogData){
    ctx.body = failedRes('请输入正确catalogId')
    return
  }else{
    // 排行的用户数据
    let originlist = await Data.find(
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
    // .sort('value desc')
    const list= originlist.sort((a,b)=>{
      return b.value-a.value
    })

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
    ctx.body = successResData({
      myData:myData,
      total:list.length,
      list:cutList,
      catalogId:catalogData.id,
      type:catalogData.type,
      unit:catalogData.unit
    })
  }
});

// 用户排行(未登录)
router.get('/',async (ctx,next)=>{
  let Data = ctx.app.context.db.data;
  let Catalog = ctx.app.context.db.catalog;
  let User = ctx.app.context.db.user;
  let param = ctx.query // startDate endDate startNum endNum catalogId
  if(!param.catalogId){
    ctx.body=failedRes('缺少参数：catalogId')
    return
  }else if(!param.startDate){
    ctx.body=failedRes('缺少参数：startDate')
    return
  }else if(!param.endDate){
    ctx.body=failedRes('缺少参数：endDate')
    return
  }else if(!param.endNum){
    ctx.body=failedRes('缺少参数：endNum')
    return
  }else if(!param.startNum){
    ctx.body=failedRes('缺少参数：startNum')
    return
  }
  let endDate = param.endDate+'T23:59:59Z'
 
  // 排行的用户数据
  
  let catalogData = await Catalog.findOne(param.catalogId)
  if(!catalogData){
    ctx.body=failedRes('请输入正确catalogId')
  }else{
    let originlist = await Data.find(
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
    
    let list = originlist.sort((a,b)=>{
      return b.value-a.value
    })
    for(let i = 1;i<=list.length;i++){
      let userData = await User.findOne(list[i-1].userId)
      list[i-1].user = userData?userData:{}
      list[i-1].rank = i
    }
    let cutList = list.slice(param.startNum,Number(param.endNum)+1)

    ctx.body = successResData({
      total:list.length,
      list:cutList,
      catalogId:catalogData.id,
      type:catalogData.type,
      unit:catalogData.unit,
    })
  }
  
});

router.allowedMethods();

export default router
