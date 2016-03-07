import Router from 'koa-router'

let router= Router({
  prefix: 'user'
})

// get data list
router.get('/',async (ctx,next)=>{
  let result = Object.create({exception:false,msg:'请求成功'})
  let User = ctx.app.context.models.user;
  let total= await User.count()
  let list =await User.find().paginate({page: 1, limit: 10});

  result['exception']=false,
  result['msg']='请求成功',
  result['total']=total,
  result['list']=list,
	ctx.body = result
});
// get id
router.get('/:id',async (ctx,next)=>{
  let result = Object.create(null)
  let id=ctx.params.id
  let User = ctx.app.context.models.user;
  let data =await User.findOne(id)
  if(!data){
    result['exception']=true
    result['msg']="找不到数据"
  }else{
    result['exception']=false
    result['msg']="请求成功"
    result['list']=[data]
  }
	ctx.body=result
})

// new
router.post('/',async (ctx,next)=>{

})
//edit
router.put('/:id',async (ctx,next)=>{

})

router.delete('/:id',async (ctx,next)=>{
  let result= Object.create(null);
  let id = ctx.params.id
  let User = ctx.app.context.models.user;

  let list =await User.destroy(id);
  result['exception']=false
  result['msg']='删除成功'
  ctx.body=result
})

router.allowedMethods();

export default router
