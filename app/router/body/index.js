import Router from 'koa-router'
import moment from 'moment'
import {successResData,failedLoginRes,failedRes} from '../../Utils/RouterResultUtils'

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

router.get('/:userId/lastest',async (ctx,next)=>{
  let Body = ctx.app.context.db.body;
  let userId = ctx.params.userId
  // const aggregateArray = [{$match:{userId:{$eq:userId}}},{$group:{_id:'$valueType',"maxValue": {$max:"$date"}}}]
  const aggregateArray = [{$match:{userId:{$eq:userId}}},
    {$group:{_id:'$valueType',date: { $max: "$date" },value:{$first:"$value"},goalValue:{$first:"$goalValue"},valueType:{$first:"$valueType"},userId:{$first:"$userId"},id:{$first:"$_id"}}},
  ]
  function PromiseNative(){
    return new Promise((resolve,reject)=>{
      Body.native(function(err, bodyCollection) {
            bodyCollection
              .aggregate(aggregateArray)
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
  const result = await PromiseNative()
  ctx.body=result 
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
    let now = moment().format("YYYY-MM-DD")
    body = await Body.findOne({
      userId:userId,
      date:moment(now).toDate(),
      valueType:resbody.valueType
    })

    if(body){
      data = await Body.update({userId:userId,date:moment(now).toDate(),valueType:resbody.valueType},{value:resbody.value})
    }else{
      data = await Body.create({userId:userId,date:moment(now).toDate(),...resbody})
    }
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