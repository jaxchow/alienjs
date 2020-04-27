import Router from 'koa-router'

let router= Router({
  prefix: 'catalog'
})

// 设备类型列表
router.get('/',async (ctx,next)=>{
  let Catalog = ctx.app.context.db.catalog;
  let list = await Catalog.find()
	ctx.body = list
});

router.allowedMethods();

export default router
