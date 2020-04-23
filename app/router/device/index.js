import Router from 'koa-router'

let router= Router({
  prefix: 'device'
})

// 设备数据
router.get('/data/:userId',async (ctx,next)=>{
  let result = Object.create(null)
  let userId = ctx.params.userId
  let param = ctx.query
  let Data = ctx.app.context.db.data;
  console.log(ctx.query)
  // let total = await Data.count()
  // let list = await Catalog.find()
  result['exception']=false
  result['msg']='请求成功'
  // result['total']=total
  // result['list']=list
	ctx.body = result
});
// 上报设备数据
router.post('/data/:userId',async (ctx,next)=>{
  let result = Object.create(null)
  let userId = ctx.params.userId
  let resbody = ctx.request.body
  let Data = ctx.app.context.db.data;
  const nowDate = new Date()
  const data =await Data.find({
      where:{
        userId:userId,
        deviceId:resbody.deviceId,
        catalogId:resbody.catalogId
      }})
  await Data.create(resbody)
  // let total = await Data.count()
  // let list = await Catalog.find()
  result['exception']=false
  result['msg']='请求成功'
  // result['total']=total
  // result['list']=list
	ctx.body = result
});

router.allowedMethods();

export default router
