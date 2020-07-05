import Router from 'koa-router'
import {successResData} from '../../Utils/RouterResultUtils'

let router= Router({
  prefix: 'catalog'
})

// 设备类型列表
router.get('/',async (ctx,next)=>{
  let Catalog = ctx.app.context.db.catalog;
  let list = await Catalog.find()
	ctx.body = successResData(list)
});

router.allowedMethods();

export default router
