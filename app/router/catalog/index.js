import Router from 'koa-router'
import {successResData,failedRes,failedLoginRes} from '../../Utils/RouterResultUtils'

let router= Router({
  prefix: 'catalog'
})

// 设备类型列表
router.get('/',async (ctx,next)=>{
  let Catalog = ctx.app.context.db.catalog;
  let list = await Catalog.find()
	ctx.body = successResData(list)
});

router.get('/config',async(ctx,next)=>{
  let DeviceConfig = ctx.app.context.db.deviceconfig
  let resbody = ctx.query
    //参数确认
    if(!resbody.userId){
      ctx.body = failedRes('缺少参数：userId')
      return
    }else if(!resbody.catalogId){
      ctx.body = failedRes('缺少参数：catalogId')
      return
    }
    let decon = await DeviceConfig.find({where:{userId:resbody.userId,cataglogId:resbody.cataglogId}})
    if(decon.length>0){
      ctx.body=successResData(decon[0])
    }else{
      ctx.body=successResData({})
    }
  })

router.post('/config',async(ctx,next)=>{
  let DeviceConfig = ctx.app.context.db.deviceconfig
  let resbody = ctx.request.body
  // console.log(resbody)
    //参数确认
    if(!resbody.userId){
      ctx.body = failedRes('缺少参数：userId')
      return
    }else if(!resbody.catalogId){
      ctx.body = failedRes('缺少参数：catalogId')
      return
    }
    let decon = await DeviceConfig.find({where:{userId:resbody.userId,cataglogId:resbody.cataglogId}})
    // console.log(decon.length)
    if(decon.length==0){
      await DeviceConfig.create(resbody)
    }else{
      await DeviceConfig.update({userId:resbody.userId,cataglogId:resbody.cataglogId},resbody)
    }

    ctx.body=successResData({})

})

router.allowedMethods();

export default router
