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
  let User =ctx.app.context.db.user
  let token = ctx.request.header['token']
  let tokenData = await User.find({unionId:token})
  if(tokenData.length>0){
    let data =await User.findOne(ctx.params.id)
    if(data){
      ctx.body=data
    }else{
      ctx.body={}
    }
  }else{
    ctx.status = 401
  }
})

// 用户设备

router.get('/:userId/device',async (ctx,next)=>{
  let User =ctx.app.context.db.user
  let token = ctx.request.header['token']
  let tokenData = await User.find({unionId:token})
  if(tokenData.length>0){
    let Device = ctx.app.context.db.device;
    let Catalog = ctx.app.context.db.catalog;
    let deviceData = await Device.find({userId:ctx.params.userId})
    for(let i=0;i<deviceData.length;i++){
      let catalogData = await Catalog.findOne(deviceData[i].catalogId)
      deviceData[i].catalog = catalogData
    }
    ctx.body=deviceData
  }else{
    ctx.status=401
  }
  
});

// 用户信息修改
router.put('/:id',async (ctx,next)=>{
  let User =ctx.app.context.db.user
  let token = ctx.request.header['token']
  let tokenData = await User.find({unionId:token})
  if(tokenData.length>0){
    let reqbody = ctx.request.body
    let data = await User.update(ctx.params,reqbody)
    if(data[0]){
      ctx.body = data[0]
    }else{
      ctx.body = {}
    }
  }else{
    ctx.status=401
  }
})

// 用户附加
router.get('/:id/plant',async (ctx,next)=>{
  let User =ctx.app.context.db.user
  let token = ctx.request.header['token']
  let tokenData = await User.find({unionId:token})
  if(tokenData.length>0){
    let Plant =ctx.app.context.db.plant
    let data =await Plant.findOne(ctx.params.id)
    if(data){
      ctx.body=data
    }else{
      ctx.body={}
    }
  }else{
    ctx.status=401
  }
})


// 用户附加修改
router.put('/:id/plant',async (ctx,next)=>{
  let User =ctx.app.context.db.user
  let token = ctx.request.header['token']
  let tokenData = await User.find({unionId:token})
  if(tokenData.length>0){
    let Plant =ctx.app.context.db.plant
    let id = ctx.params.id
    let reqbody = ctx.request.body
    let data = await Plant.findOne(id)
    if(data){
      let dataArr = await Plant.update({userId:id},reqbody)
      ctx.body = dataArr[0]
    }else{
      let data = await Plant.create({userId:id,...reqbody})
      ctx.body = data
    }
  }else{
    ctx.status=401
  }
})

router.allowedMethods();

export default router
