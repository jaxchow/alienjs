import Router from 'koa-router'

let router= Router({
  prefix: 'mock'
})

// get data list
router.get('/',async (ctx,next)=>{
	ctx.body = "mock"
});
router.post('/passport/auth',async (ctx,next)=>{
  let result={
    authID:"a232Bd3432",
    loginTime:1459227790173,
    expiresTime:1459217790173
  }
	ctx.body =result
});

router.allowedMethods();

export default router
