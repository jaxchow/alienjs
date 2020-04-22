import Router from 'koa-router'

let router= Router({
  prefix: 'catalog'
})

// 设备类型列表
router.get('/',async (ctx,next)=>{
	let result = Object.create({exception:false,msg:'请求成功'})
  let Catalog = ctx.app.context.db.catalog;
  let total = await Catalog.count()
  let list = await Catalog.find()
  result['exception']=false
  result['msg']='请求成功'
  result['total']=total
  result['list']=list
	ctx.body = result
});

router.allowedMethods();

export default router
