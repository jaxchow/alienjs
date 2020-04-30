import Router from 'koa-router'

let router= Router({
  prefix: 'user'
})

// 用户附加信息字典
router.get('/plantinfo',async (ctx,next)=>{
  let PlantInfo =ctx.app.context.db.plantinfo
  let data = await PlantInfo.find()
	ctx.body = data
})
// 用户信息
router.get('/:id',async (ctx,next)=>{
  let result = Object.create(null)
  let id = ctx.params.id
  let User =ctx.app.context.db.user
  let data =await User.findOne(id)
	ctx.body=data
})

// 用户设备

router.get('/:userId/device',async (ctx,next)=>{
  let Device = ctx.app.context.db.device;
  let Catalog = ctx.app.context.db.catalog;
  //这里应该将选出来的数据与设备类型表之间做关联的
  let deviceData = await Device.find({userId:ctx.params.userId})
  for(let i=0;i<deviceData.length;i++){
    let catalogData = await Catalog.findOne(deviceData[i].catalogId)
    deviceData[i].catalog = catalogData
  }

	ctx.body=deviceData
});

// 用户信息修改
router.patch('/:id',async (ctx,next)=>{
  let User = ctx.app.context.db.user
  let params = ctx.params
  let reqbody = ctx.request.body
  let data = await User.update(params,reqbody)
  ctx.body = data[0]
})

// 用户附加
router.get('/:id/plant',async (ctx,next)=>{
  let id = ctx.params.id
  let Plant =ctx.app.context.db.plant
  let data =await Plant.findOne(id)
	ctx.body=data
})


// 用户附加修改
router.patch('/:id/plant',async (ctx,next)=>{
  let Plant =ctx.app.context.db.plant
  let id = ctx.params.id
  let reqbody = ctx.request.body
  let data = await Plant.update({userId:id},reqbody)
  ctx.body = data[0]
})

router.allowedMethods();

export default router
