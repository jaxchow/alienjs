import Router from 'koa-router'

let router= Router({
  prefix: 'user'
})
// 用户信息
router.get('/:id',async (ctx,next)=>{
  let result = Object.create(null)
  let id = ctx.params.id
  let User =ctx.app.context.db.user
  let data =await User.findOne(id)
  if(!data){
    result['exception']=true
    result['msg']="找不到数据"
  }else{
    result['exception']=false
    result['msg']="请求成功"
    result['data']=data
  }
	ctx.body=result
})

// 用户设备

router.get('/:userId/device',async (ctx,next)=>{
  let result = Object.create(null)
  let Device = ctx.app.context.db.device;
  let Catalog = ctx.app.context.db.catalog;
  //这里应该将选出来的数据与设备类型表之间做关联的
  let deviceData = await Device.find({userId:ctx.params.userId})
  if(!deviceData){
    result['exception']=true
    result['msg']="找不到数据"
  }else{
    result['exception']=false
    result['msg']="请求成功"
    result['data']=deviceData
  }
	ctx.body=result
});

// 用户信息修改
router.patch('/:id',async (ctx,next)=>{
  let result = Object.create(null)
  let User = ctx.app.context.db.user
  let params = ctx.params
  let reqbody = ctx.request.body
  let data = await User.update(params,reqbody)
  if(!data[0]){
    result['exception']=true
    result['msg']="找不到数据"
  }else{
    result['exception']=false
    result['msg']="更新成功"
    result['data']=data[0]
  }
  ctx.body = result
})

// 用户附加
router.get('/:id/plant',async (ctx,next)=>{
  let result = Object.create(null)
  let id = ctx.params.id
  let Plant =ctx.app.context.db.plant
  let data =await Plant.findOne(id)
  if(!data){
    result['exception']=true
    result['msg']="找不到数据"
  }else{
    result['exception']=false
    result['msg']="请求成功"
    result['data']=data
  }
	ctx.body=result
})

// 用户附加修改
router.patch('/:id/plant',async (ctx,next)=>{
  let result = Object.create(null)
  let Plant =ctx.app.context.db.plant
  let id = ctx.params.id
  let reqbody = ctx.request.body
  let data = await Plant.update({userId:id},reqbody)
  if(!data[0]){
    result['exception']=true
    result['msg']="找不到数据"
  }else{
    result['exception']=false
    result['msg']="更新成功"
    result['data']=data[0]
  }
  ctx.body = result
})

router.allowedMethods();

export default router
