import Router from 'koa-router'

let router= Router({
  prefix: 'user'
})
// 用户信息
router.get('/:id',async (ctx,next)=>{
  let result = Object.create(null)
  let id = ctx.params.id
  console.log(ctx.params)
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

// new
router.post('/',async (ctx,next)=>{
  let result = Object.create(null)
  let param= ctx.request.body
  let User = ctx.app.context.db.user
  console.log(param)
  let data = await User.create({})

  if(!data){
    result['exception']=true
    result['msg']="保存失败"
  }else{
    result['exception']=false
    result['msg']="保存成功"
    result['list']=[data]
  }

	ctx.body=result
})
//edit
router.put('/:id',async (ctx,next)=>{

  let result = Object.create(null)
  let param= ctx.req.body
  let User = ctx.app.context.db.user
  let data =await User.create(param)

  if(!data){
    result['exception']=true
    result['msg']="保存失败"
  }else{
    result['exception']=false
    result['msg']="保存成功"
    result['list']=[data]
  }

	ctx.body=result
})

router.delete('/:id',async (ctx,next)=>{
  let result= Object.create(null);
  let id = ctx.params.id
  let User = ctx.app.context.db.user

  let list =await User.destroy(id);
  result['exception']=false
  result['msg']='删除成功'
  ctx.body=result
})

router.allowedMethods();

export default router
