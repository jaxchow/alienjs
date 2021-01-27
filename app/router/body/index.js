import Router from 'koa-router'
import moment from 'moment'
import {successResData,failedLoginRes,failedRes} from '../../Utils/RouterResultUtils'
import {PromiseAggregate} from '../../Utils/mongodbUtils'

let router= Router({
  prefix: 'body'
})

// 查询某个用户的身体信息
router.get('/:userId',async (ctx,next)=>{
  let Body = ctx.app.context.db.body;
  let userId = ctx.params.userId

  let bodyInfos = await Body.find({userId:userId},{sort:'createdAt'})
  // console.log(bodyInfos)
  if(bodyInfos){
    ctx.body=successResData(bodyInfos)
  }else{
    ctx.body=failedRes()
  }
});

router.get('/:userId/:valueType/newest',async (ctx,next)=>{
  let Body = ctx.app.context.db.body;
  let userId = ctx.params.userId
  let valueType = ctx.params.valueType
  const aggregateArray = [
    {$match:{userId:{$eq:userId},valueType:valueType}},
    {$sort:{createdAt:-1}},
    {$limit:1}
  ]
  const result = await PromiseAggregate(Body,aggregateArray)
  ctx.body = successResData(result)

})

router.get('/:userId/lastest',async (ctx,next)=>{
  let Body = ctx.app.context.db.body;
  let userId = ctx.params.userId
  const aggregateArray = [{$match:{userId:{$eq:userId}}},
    {$group:{_id:'$valueType',date: { $last: "$date" },value:{$last:"$value"},goalValue:{$last:"$goalValue"},valueType:{$last:"$valueType"},userId:{$first:"$userId"},id:{$first:"$_id"}}},
  ]
  const result = await PromiseAggregate(Body,aggregateArray)
  
  ctx.body=successResData(result)
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
  let body,data
  if(resbody && JSON.stringify(resbody) !== '{}'){
    let now = moment().add('hours',8)
    body = await Body.find({
      userId:userId,
      date:moment(moment().format("YYYY-MM-DD")+"T00:00:00.000+00:00").toDate(),
      valueType:resbody.valueType
    })
    // console.log(body,moment(moment().format("YYYY-MM-DD")+"T00:00:00.000+00:00").toDate())
    if(body.length>0){
      data = await Body.update({userId:userId,date:moment(moment().format("YYYY-MM-DD")+"T00:00:00.000+00:00").toDate(),valueType:resbody.valueType},{value:resbody.value})
      ctx.body = successResData(data[0])
    }else{
      data = await Body.create({userId:userId,date:moment().format("YYYY-MM-DD"),createdAt:moment(now).toDate(),...resbody})
      ctx.body = successResData(data)
    }
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
