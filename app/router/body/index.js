import Router from 'koa-router'
import {successResData,failedLoginRes,failedRes} from '../../Utils/RouterResultUtils'

let router= Router({
  prefix: 'body'
})

// 查询某个用户的身体信息
router.get('/:userId',async (ctx,next)=>{
  let Body = ctx.app.context.db.body;
  let userId = ctx.params.userId

  let bodyInfos = await Body.find({userId:userId},{sort:'createAt'})
  // console.log(bodyInfos)
  if(bodyInfos){
    ctx.body=successResData(bodyInfos)
  }else{
    ctx.body=failedRes()
  }
});

router.get('/:userId/:valueType',async (ctx,next)=>{
  let Body = ctx.app.context.db.body;
  let userId = ctx.params.userId
  let valueType = ctx.params.valueType

  let bodyInfos = await Body.find({userId:userId,valueType:valueType},{sort:'createAt'})
  if(bodyInfos){
    ctx.body=successResData(bodyInfos)
  }else{
    ctx.body=failedRes()
  }
});


// 上报身体信息
router.post('/:userId',async (ctx,next)=>{
  let Body = ctx.app.context.db.body
  let userId = ctx.params.userId
  let resbody = ctx.request.body
  if(resbody && JSON.stringify(resbody) !== '{}'){
    let data = await Body.create({userId:userId,...resbody})
    ctx.body = successResData(data)
  }else{
    ctx.body = failedRes('未上传任何参数')
  }
})

//删除身体信息
router.delete('/:userId',async (ctx,next)=>{
  let Body = ctx.app.context.db.body
  let userId = ctx.params.userId
  let deleteDate = await Body.destroy({userId:userId})

  if(deleteDate[0]){
    ctx.body = successResData(deleteDate[0])
  }else{
    ctx.body = failedRes('不存在该用户的身体信息数据')
  }
})

router.allowedMethods();

export default router
