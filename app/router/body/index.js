import Router from 'koa-router'
import {successResData,failedLoginRes,failedRes} from '../../Utils/RouterResultUtils'

let router= Router({
  prefix: 'body'
})

// 查询某个用户的身体信息
router.get('/:userId',async (ctx,next)=>{
  let Body = ctx.app.context.db.body;

  let list = await Body.find()
  console.log(list)

  let bodyInfo = await Body.findOne(ctx.params.userId)
  if(bodyInfo){
    ctx.body=successResData(bodyInfo)
  }else{
    ctx.body=failedRes()
  }
});

//创建身体信息
router.post('/:userId',async (ctx,next)=>{
  let Body = ctx.app.context.db.body
  let userId = Number(ctx.params.userId)
  let resbody = ctx.request.body
  let bodyLen = await Body.find({userId:userId})
  if(bodyLen.length>0){
    ctx.body = failedRes('该用户已存在身体信息')
    return
  }
  if(resbody && JSON.stringify(resbody) !== '{}'){
    let data = await Body.create({userId:userId,...resbody})
    ctx.body = successResData(data)
  }else{
    ctx.body = failedRes('未上传任何参数')
    return
  }
})

//更改身体信息
router.put('/:userId',async (ctx,next)=>{
  let Body = ctx.app.context.db.body
  let userId = Number(ctx.params.userId)
  let resbody = ctx.request.body
  if(resbody && JSON.stringify(resbody) !== '{}'){
    let dataArr = await Body.update({userId:userId},resbody)
    if(dataArr[0]){
      ctx.body = successResData(dataArr[0])
    }else{
      ctx.body = failedRes('未找到该用户的身体信息')
    }
  }else{
    ctx.body = failedRes('未上传任何参数')
  }
})

//删除身体信息
router.delete('/:userId',async (ctx,next)=>{
  let Body = ctx.app.context.db.body
  let userId = Number(ctx.params.userId)
  let deleteDate = await Body.destroy({userId:userId})

  if(deleteDate[0]){
    ctx.body = successResData(deleteDate[0])
  }else{
    ctx.body = failedRes('不存在该用户的身体信息数据')
  }
})

router.allowedMethods();

export default router
