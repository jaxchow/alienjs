import Router from 'koa-router'
import {successResData} from '../../Utils/RouterResultUtils'

let router= Router({
  prefix: 'task'
})

// 训练列表
router.get('/:catalogId',async (ctx,next)=>{
  
  let Task = ctx.app.context.db.task
  let catalogId = ctx.params.catalogId
  let taskData = await Task.find({catalogId:catalogId}).sort({sort:1})
  ctx.body = successResData(taskData)
})

// 个人挑战成功次数
router.get('/success/:userId',async (ctx,next)=>{
  let userId = ctx.params.userId
  let TaskRelation = ctx.app.context.db.taskrelation
  let successArr = await TaskRelation.find({userId:userId})
  ctx.body = successResData({successNumber:successArr.length})
})

router.allowedMethods();

export default router
