import Router from 'koa-router'
import moment from 'moment'
import {successResData,failedRes,failedLoginRes} from '../../Utils/RouterResultUtils'

let router= Router({
  prefix: 'device'
})

// 设备数据
router.get('/data/:userId',async (ctx,next)=>{
  let User =ctx.app.context.db.user
  let token = ctx.request.header['token']
  let tokenData = await User.find({unionId:token})
 if(tokenData.length>0){
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
    let endDate = param.endDate+'T23:59:59Z'
    let Data = ctx.app.context.db.data;
    let Catalog = ctx.app.context.db.catalog;
    let Device = ctx.app.context.db.device;
    let data = await Data.find(
      {
        where:{
          updatedAt:{
            '>=':param.startDate,
            '<=':endDate
          },
          userId:userId,
          catalogId:param.catalogId
        },
        groupBy:['userId','catalogId'],
        sum:['time','fatcut','calorie','value']
      }
    )
    if(data[0]){
      let catalogData = await Catalog.findOne(param.catalogId)
      let deviceData = await Device.findOne({catalogId:param.catalogId,userId:userId})
      data[0].unit = catalogData.unit
      data[0].name = catalogData.name
      data[0].type = catalogData.type
      if(deviceData){
        data[0].index = deviceData.index
    }
      ctx.body = successResData(data[0])
    }else{
      ctx.body = successResData({})
    }
  }else{
    ctx.body=failedLoginRes()
  } 
});
// 单设备数据
router.get('/data/:userId/:deviceId',async (ctx,next)=>{
  let User =ctx.app.context.db.user
  let token = ctx.request.header['token']
  let tokenData = await User.find({unionId:token})
  if(tokenData.length>0){
  // if(true){
    const startDate = moment().format("YYYY-MM-DD");
    let userId = ctx.params.userId
    let deviceId = ctx.params.deviceId
    let param = ctx.query
    let endDate = startDate+'T23:59:59Z'
    let Data = ctx.app.context.db.data;
    let Catalog = ctx.app.context.db.catalog;
    let Device = ctx.app.context.db.device;
    let data = await Data.find(
      {
        where:{
          updatedAt:{
            '>=':startDate,
            '<=':endDate
          },
          userId:userId,
          catalogId:param.catalogId,
          deviceId:deviceId
        },
      }
    )
    if(data[0]){
      let catalogData = await Catalog.findOne(param.catalogId)
      let deviceData = await Device.findOne({catalogId:param.catalogId,userId:userId})
      data[0].unit = catalogData.unit
      data[0].name = catalogData.name
      data[0].type = catalogData.type
      if(deviceData){
        data[0].index = deviceData.index
    }
      ctx.body = successResData(data[0])
    }else{
      ctx.body = successResData({})
    }
  }else{
    ctx.body=failedLoginRes()
  } 
});
// 上报设备数据
router.post('/data/:userId',async (ctx,next)=>{
  let User =ctx.app.context.db.user
  let token = ctx.request.header['token']
  let tokenData = await User.find({unionId:token})
  if(tokenData.length>0){
    let userId = Number(ctx.params.userId)
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
    const lastData = await Data.find(
      {
        where:{
          userId:userId,
          deviceId:resbody.deviceId,
          catalogId:resbody.catalogId 
        },  sort: 'updatedAt desc', limit:1
      } 
    )
    if(lastData.length == 0 || moment(lastData[0].updatedAt).format('YYYY-MM-DD') !== moment().format('YYYY-MM-DD')){
      data = await Data.create({userId:userId,...resbody})
    }else{
      const newDate = {
        time:(lastData[0].time||0)+(resbody.time||0),
        fatcut:(lastData[0].fatcut||0)+(resbody.fatcut||0),
        calorie:(lastData[0].calorie||0)+(resbody.calorie||0),
        value:(lastData[0].value||0)+(resbody.value||0)
      }
      console.log(newDate)
      data = await Data.update({id:lastData[0].id},newDate)
    }
    ctx.body = successResData(data)
  }else{
    ctx.body=failedLoginRes()
  }
});
// 解除绑定
router.delete('/:deviceId',async (ctx,next)=>{
  let Device = ctx.app.context.db.device
  let User =ctx.app.context.db.user
  let token = ctx.request.header['token']
  let tokenData = await User.find({unionId:token})
  if(tokenData.length>0){
    let {deviceId} = ctx.params
    let DeviceDesData = await Device.destroy({deviceId:deviceId})
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
	let data =null
  console.log("resbody",resbody)
  if(!resbody.deviceId){
    ctx.body = 
    failedRes('缺少参数：deviceId')
    return
  }
	let device=await Device.findOne({deviceId:resbody.deviceId})
	console.log("length",device)
	if(!device){
	 //resbody.index=10
	 data = await Device.create(resbody)
	}else  if(device.userId!==resbody.userId){
    ctx.body = failedRes("该设备与其他用户绑定，请先解绑定")
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
