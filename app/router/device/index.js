import Router from 'koa-router'
import moment from 'moment'
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
      ctx.body = data[0]
    }else{
      let catalogData = await Catalog.findOne(param.catalogId)
      let deviceData = await Device.findOne({catalogId:param.catalogId,userId:userId})
      if(deviceData){
        ctx.body = {
          msg:'该用户在该时段无数据',
          data:{
          userId:userId,
          catalogId:param.catalogId,
          time:0,
          fatcat:0,
          calorie:0,
          value:0,
          unit:catalogData.unit,
          name:catalogData.name,
          type:catalogData.type,
          index:deviceData.index
        }}
      }else{
        ctx.body={msg:'未查询到该设备'}
      }
    }
  }else{
    ctx.status=401
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
      data = await Data.update({id:lastData[0].id},resbody)
    }
    ctx.body = data
  }else{
    ctx.status=401
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
    ctx.body = {
      Device:DeviceDesData,
    }
  }else{
    ctx.status=401
  }
});

// 修改我的目标
router.put('/data/index',async (ctx,next)=>{
  let User =ctx.app.context.db.user
  let token = ctx.request.header['token']
  let tokenData = await User.find({unionId:token})
  if(tokenData.length>0){
    let resbody = ctx.request.body
    let Device = ctx.app.context.db.device
    let data = await Device.update(
      {
          deviceId:resbody.deviceId,
      },
      {index:resbody.index}
    )
    if(data[0]){
      ctx.body = data[0]
    }else{
      ctx.body = {message:"修改失败"}
    }
  }else{
    ctx.status=401
  }
})

router.post('/connect',async (ctx,next)=>{
  let resbody = ctx.request.body
  let Device = ctx.app.context.db.device
	let data =null
	console.log("resbody",resbody)
	let device=await Device.findOne({deviceId:resbody.deviceId})
	console.log("length",device)
	if(!device){
	 //resbody.index=10
	 data = await Device.create(resbody)
	}else  if(device.userId!==resbody.userId){
		ctx.body={
      message:"该设备与其他用户绑定，请先解绑定"
    }
  }
  if(data){
    ctx.body = data
  }else{
    ctx.body = device
  }
})

router.allowedMethods();

export default router
