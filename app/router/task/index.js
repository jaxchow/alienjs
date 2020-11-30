import Router from 'koa-router'
import {successResData} from '../../Utils/RouterResultUtils'

let router= Router({
  prefix: 'task'
})

// 训练列表
router.get('/:catalogId',async (ctx,next)=>{
  
  let Task = ctx.app.context.db.task
  let catalogId = ctx.params.catalogId
  let taskData = await Task.find({catalogId:catalogId},{sort:'sort'})
  ctx.body = successResData(taskData)
})


// 个人挑战成功次数
router.get('/success/:userId',async (ctx,next)=>{
  let userId = ctx.params.userId
  let TaskRelation = ctx.app.context.db.taskrelation
  const aggregateArray = [{$match:{userId:{$eq:userId}}},
    {$group:{_id:'$taskId',taskId:{$first:'$taskId'},count:{$sum:1}}},
  ]
  function PromiseNative(model,aggregate){
    return new Promise((resolve,reject)=>{
      model.native(function(err, bodyCollection) {
            bodyCollection
              .aggregate(aggregate)
              .toArray((err, results) => {
                if(err){
                  console.log("err",err)
                  reject(failedRes(err))
                }else{
                  resolve(successResData(results))
                }
              });
      }) 
    })
  }
  const result = await PromiseNative(TaskRelation,aggregateArray)
  ctx.body = result
})

router.allowedMethods();

export default router
