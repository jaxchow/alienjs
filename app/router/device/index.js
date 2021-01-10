import Router from 'koa-router'
import moment from 'moment'
import {successResData,failedRes,failedLoginRes} from '../../Utils/RouterResultUtils'
import {PromiseAggregate} from '../../Utils/mongodbUtils'

let router= Router({
  prefix: 'device'
})


router.get('/data/detail/:dataId',async(ctx,next)=>{
  let Data = ctx.app.context.db.data;
  let User = ctx.app.context.db.user;
  let dataId = ctx.params.dataId;
  if(!dataId){
    ctx.body = failedRes('缺少参数：dataId')
    return
  }
  let detailData = await Data.findOne(dataId)
  // if(detailData.userId){
  //   // let user = User.findOne(detailData.userId)
  //   // console.dir(user)
  //   // detailData.user  = user 
  // }
  ctx.body = successResData(detailData)

})

router.get('/data/daily/:userId',async(ctx,next)=>{
  let userId = ctx.params.userId
  let param = ctx.query
  if(!param.startDate){
    ctx.body = failedRes('缺少参数：startDate')
    return
  }else if(!userId){
    ctx.body = failedRes('缺少参数：userId')
    return
  }
  let startDate = param.startDate+'T00:00:00Z'
  let endDate = param.startDate+'T23:59:59Z'
  let Data = ctx.app.context.db.data;
  const aggregateArray = [
    {
      $match:{
        userId:userId,
        // catalogId:param.catalogId,
        createdAt:{$gt:new Date(startDate),$lt:new Date(endDate)}
      }
    },
    {
      $addFields:{
        date:{$dateToString: { format: "%Y-%m-%d", date: "$createdAt" }}
      }
    }
  ]
  const result = await PromiseAggregate(Data,aggregateArray)
  ctx.body = successResData(result)
})

// 设备数据汇总
router.get('/data/:userId',async (ctx,next)=>{
  let User =ctx.app.context.db.user
  let token = ctx.request.header['token']
//   let tokenData = await User.find({unionId:token})
//  if(tokenData.length>0){
  // if(true){
    let userId = ctx.params.userId
    let param = ctx.query
    if(!param.endDate){
      ctx.body = failedRes('缺少参数：endDate')
      return
    }else if(!param.startDate){
      ctx.body = failedRes('缺少参数：startDate')
      return
    }else if(!param.catalogId){
      ctx.body = failedRes('缺少参数：catalogId')
      return
    }
    let startDate = param.startDate+'T00:00:00Z'
    let endDate = param.endDate+'T23:59:59Z'
    let Data = ctx.app.context.db.data;
    if(!param.catalogId){
      ctx.body = failedRes('缺少参数：catalogId')
      return
    }
    const aggregateArray = [
      {
        $match:{
          userId:userId,
          catalogId:param.catalogId,
          createdAt:{$gt:new Date(startDate),$lt:new Date(endDate)}
        }
      },
      {
        $addFields:{
          date:{$dateToString: { format: "%Y-%m-%d", date: "$createdAt" }}
        }
      },
      {
        $group:{
          _id: "$date",
          calorie:{$sum:"$calorie"},
          value:{$sum:"$value"},
          time:{$sum:"$time"},
          count: { $sum: 1 }
        }
      }
    ]
    const result = await PromiseAggregate(Data,aggregateArray)
    ctx.body = successResData(result)
  // }else{
  //   ctx.body=failedLoginRes()
  // } 
});
// 单设备数据
router.get('/data/:userId/:deviceId',async (ctx,next)=>{
  let User =ctx.app.context.db.user
  let token = ctx.request.header['token']
  let tokenData = await User.find({unionId:token})
  let param = ctx.query

  if(!param.endDate){
    ctx.body = failedRes('缺少参数：endDate')
    return
  }else if(!param.startDate){
    ctx.body = failedRes('缺少参数：startDate')
    return
  }else if(!param.catalogId){
    ctx.body = failedRes('缺少参数：catalogId')
    return
  }

  if(tokenData.length>0){
  // if(true){
    let userId = ctx.params.userId
    let deviceId = ctx.params.deviceId
    let startDate =param.startDate+"T00:00:00Z"
    let endDate = param.endDate+'T23:59:59Z'
    let Data = ctx.app.context.db.data;
    let Catalog = ctx.app.context.db.catalog;
    let Device = ctx.app.context.db.device;

    const aggregateArray = [
      {
        $match:{
          userId:userId,
          deviceId:deviceId,
          catalogId:param.catalogId,
          createdAt:{$gt:new Date(startDate),$lt:new Date(endDate)}
        }
      },
    ]
    const result = await PromiseAggregate(Data,aggregateArray)
    // if(data.length>0){
      ctx.body = successResData(result)
    // }else{
      // ctx.body = successResData({})
    // }
  }else{
    ctx.body=failedLoginRes()
  } 
});
// 上报设备数据
router.post('/data/:userId',async (ctx,next)=>{
  let User =ctx.app.context.db.user
  let TaskRelation = ctx.app.context.db.taskrelation
  let Task = ctx.app.context.db.task
  let token = ctx.request.header['token']
  let tokenData = await User.find({unionId:token})
  if(tokenData.length>0){
    let userId = ctx.params.userId
    let resbody = ctx.request.body
    let Data = ctx.app.context.db.data;
    let data;
    //参数确认
    if(!resbody.deviceId){
      ctx.body = failedRes('缺少参数：deviceId')
      return
    }else if(!resbody.catalogId){
      ctx.body = failedRes('缺少参数：catalogId')
      return
    }

    if(resbody.finish==undefined){
      ctx.body = failedRes('缺少参数：finish,运动是否完成：0完成，1未完成')
      return 
    }

    if(!resbody.trainingType){
      ctx.body = failedRes('缺少参数：训练类型trainingType： 1：按个数   2：按时间  3：自由 ，4：指定任务')
      return
    }

    if(resbody.trainingType==4 && !resbody.trainingTask){
      ctx.body = failedRes('缺少参数：trainingTask ，任务id')
      return
    }

    data = await Data.create({userId:userId,...resbody})
    let task = await Task.findOne({_id:resbody.trainingTask})
    // console.log(task.successTotal)
    if(resbody.trainingType==4 && task){
      if(resbody.finish==0){
        await Task.update({
        _id:resbody.trainingTask
        },{
          successTotal:task.successTotal+1
        })
        await TaskRelation.create({
          userId:userId,
          taskId: resbody.trainingTask,
          dataId: data.id
        })
      }
      
    }
    // }else{
    //   const newDate = {
    //     time:(lastData[0].time||0)+(resbody.time||0),
    //     fatcut:(lastData[0].fatcut||0)+(resbody.fatcut||0),
    //     calorie:(lastData[0].calorie||0)+(resbody.calorie||0),
    //     value:(lastData[0].value||0)+(resbody.value||0)
    //   }
    //   data = await Data.update({id:lastData[0].id},newDate)
    // }
    ctx.body = successResData(data)
  }else{
    ctx.body=failedLoginRes()
  }
});
// 解除绑定
router.delete('/:deviceId',async (ctx,next)=>{
  let Device = ctx.app.context.db.device
  let DeviceLog = ctx.app.context.db.devicelog
  let User =ctx.app.context.db.user
  let token = ctx.request.header['token']
  // console.log(ctx.app.context.db)
  let tokenData = await User.find({unionId:token})
  if(tokenData.length>0){
    let {deviceId} = ctx.params
    let DeviceDesData = await Device.destroy({where:{deviceId:deviceId}})
    await DeviceLog.create({deviceId:deviceId,userid:tokenData[0].id,type:"0"})
    if(DeviceDesData[0]){
      ctx.body = successResData({ Device:DeviceDesData[0]})
    }else{
      ctx.body = failedRes('不存在该设备')
    }
  }else{
    ctx.body=failedLoginRes()
  }
});

// 修改我的目标
router.put('/data/index',async (ctx,next)=>{
  let User =ctx.app.context.db.user
  let token = ctx.request.header['token']
  let tokenData = await User.find({unionId:token})
  if(tokenData.length>0){
    let resbody = ctx.request.body
    if(!resbody.index){
      ctx.body = failedRes('缺少参数：index')
      return
    }else if(!resbody.deviceId){
      ctx.body = failedRes('缺少参数：deviceId')
      return
    }
    let Device = ctx.app.context.db.device
    let data = await Device.update(
      {
          deviceId:resbody.deviceId,
      },
      {index:resbody.index}
    )
    if(data[0]){
      ctx.body = successResData(data[0])
    }else{
      ctx.body = failedRes('修改失败,未查询到该设备')
    }
  }else{
    ctx.body=failedLoginRes()
  }
})

router.post('/connect',async (ctx,next)=>{
  let resbody = ctx.request.body
  let Device = ctx.app.context.db.device
  let DeviceLog = ctx.app.context.db.devicelog
	let data =null
  if(!resbody.deviceId){
    ctx.body = 
    failedRes('缺少参数：deviceId')
    return
  }else if(!resbody.userId){
    ctx.body = 
    failedRes('缺少参数：userId')
    return
  }else if(!resbody.catalogId){
    ctx.body = 
    failedRes('缺少参数：catalogId')
    return
  }
	let device=await Device.findOne({deviceId:resbody.deviceId})
  // console.log(device)
	if(!device){
	 //resbody.index=10
	 data = await Device.create(resbody)
   await DeviceLog.create({deviceId:resbody.deviceId,userid:resbody.userId,type:"1"})
	}else  if(device.userId!==resbody.userId){
    ctx.body = failedRes("该设备已被其他用户绑定")
    return
  }
  if(data){
    ctx.body = successResData(data)
  }else{
    ctx.body = successResData(device)
  }
})

router.allowedMethods();

export default router
