import Router from 'koa-router'
import body from './body'
import user from './user'
import catalog from './catalog'
import device from './device'
import rank from './rank'
import weapp from './weapp'
//TODO: 未实现
//import client from './client'

let router= Router({
  prefix: '/'
})


router.get('/',function(ctx,next){
	ctx.body="Hello World!"
});

// use sub router
router.use(body.routes())
router.use(user.routes())
router.use(catalog.routes())
router.use(device.routes())
router.use(rank.routes())
router.use(weapp.routes())
router.allowedMethods()

export default router
