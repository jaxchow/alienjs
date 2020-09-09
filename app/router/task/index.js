import Router from 'koa-router'
import {successResData} from '../../Utils/RouterResultUtils'

let router= Router({
  prefix: 'task'
})

// 训练列表
router.get('/',async (ctx,next)=>{
  let Task = ctx.app.context.db.Task
  let type = ctx.params.type
  let taskData = await Task.findOne({type:type}) 
  ctx.body = successResData(taskData)
})

router.allowedMethods();

export default router
