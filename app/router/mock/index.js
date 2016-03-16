import Router from 'koa-router'

let router= Router({
  prefix: 'mock'
})

// get data list
router.get('/',async (ctx,next)=>{
	ctx.body = "mock"
});

router.allowedMethods();

export default router
