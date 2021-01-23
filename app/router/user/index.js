import Router from 'koa-router'
import moment from 'moment'
import {successResData,failedRes,failedLoginRes} from '../../Utils/RouterResultUtils'

let router= Router({
  prefix: 'user'
})

// 用户附加信息字典
router.get('/plantinfo',async (ctx,next)=>{
  let PlantInfo =ctx.app.context.db.plantinfo
  let data = await PlantInfo.find()
	ctx.body = successResData(data)
})
// 用户信息
router.get('/:id',async (ctx,next)=>{
  let User =ctx.app.context.db.user
  let token = ctx.request.header['token']
  // let tokenData = await User.find({unionId:token})
  // if(tokenData.length>0){
    let data =await User.findOne(ctx.params.id)

    if(data){
      delete data.unionId
      ctx.body=successResData(data)
    }else{
      ctx.body=failedRes()
    }
  // }else{
  //   ctx.body=failedLoginRes()
  // }
})

// 用户设备

router.get('/:userId/device',async (ctx,next)=>{
  let User =ctx.app.context.db.user
  let token = ctx.request.header['token']
  let tokenData = await User.find({unionId:token})
  if(tokenData.length>0){
    let Device = ctx.app.context.db.device;
    let Catalog = ctx.app.context.db.catalog;
    let deviceData = await Device.find({userId:ctx.params.userId})
    if(deviceData.length !== 0){
      for(let i=0;i<deviceData.length;i++){
        let catalogData = await Catalog.findOne(deviceData[i].catalogId)
        deviceData[i].catalog = catalogData
      }
      ctx.body=successResData(deviceData)
    }else{
      ctx.body=successResData([])
    }
  }else{
    ctx.body=failedLoginRes()
  }
  
});

// 获取完善信息
router.get('/:id/supply',async (ctx,next)=>{
  let User =ctx.app.context.db.user
  let Body =ctx.app.context.db.body

  let token = ctx.request.header['token']
  let tokenData = await User.find({unionId:token})
  if(tokenData.length>0){
    let data =await User.findOne(ctx.params.id)
    let body =await Body.find({where:{userId:ctx.params.id}})
    data.body=body
    if(data){
      ctx.body=successResData(data)
    }else{
      ctx.body=failedRes()
    }
  }else{
    ctx.body=failedLoginRes()
  }
})

//修改完善信息
router.post('/:id/supply',async (ctx,next)=>{
  let User =ctx.app.context.db.user
  let Body =ctx.app.context.db.body
  let token = ctx.request.header['token']
  let tokenData = await User.find({unionId:token})
  const body = ctx.request.body
  if(!body.weight){
    ctx.body = failedRes('缺少参数：weight')
    return
  }else if(!body.birthday){
    ctx.body = failedRes('缺少参数：birthday')
    return
  }else if(!body.height){
    ctx.body = failedRes('缺少参数：height')
    return
  }else if(!body.waist){
    ctx.body = failedRes('缺少参数：waist')
    return
  }
  let now = moment().add('hours',8)
  if(tokenData.length>0){
    let {height,weight,waist,...birthday} = body
    let data = await User.update(ctx.params,{...birthday})
    if(weight){
      // console.log("weight")
      await Body.create({userId:ctx.params.id,date:moment().format("YYYY-MM-DD"),valueType:"1",value:weight,createdAt:moment(now).toDate()})
    }
    if(height){
      // console.log("height")
      await Body.create({userId:ctx.params.id,date:moment().format("YYYY-MM-DD"),valueType:"2",value:height,createdAt:moment(now).toDate()})
    }
    if(waist){
      // console.log("bust")
      await Body.create({userId:ctx.params.id,date:moment().format("YYYY-MM-DD"),valueType:"4",value:waist,createdAt:moment(now).toDate()})
    }
    console.log(data)
    if(data[0]){
      ctx.body = successResData(data[0])
    }else{
      ctx.body = failedRes('修改失败，未查询到该用户')
    }
  }else{
    ctx.body=failedLoginRes()
  }
})

// 用户信息修改
router.put('/:id',async (ctx,next)=>{
  let User =ctx.app.context.db.user
  let token = ctx.request.header['token']
  let tokenData = await User.find({unionId:token})
  if(tokenData.length>0){
    let reqbody = ctx.request.body
    let data = await User.update(ctx.params,reqbody)
    if(data[0]){
      ctx.body = successResData(data[0])
    }else{
      ctx.body = failedRes('修改失败，未查询到该用户')
    }
  }else{
    ctx.body=failedLoginRes()
  }
})

// 用户附加
router.get('/:id/plant',async (ctx,next)=>{
  let User =ctx.app.context.db.user
  let token = ctx.request.header['token']
  let tokenData = await User.find({unionId:token})
  if(tokenData.length>0){
    let Plant =ctx.app.context.db.plant
    let data =await Plant.findOne(ctx.params.id)
    if(data){
      ctx.body=successResData(data)
    }else{
      ctx.body = failedRes()
    }
  }else{
    ctx.body=failedLoginRes()
  }
})


// 用户附加修改
router.put('/:id/plant',async (ctx,next)=>{
  let User =ctx.app.context.db.user
  let token = ctx.request.header['token']
  let tokenData = await User.find({unionId:token})
  if(tokenData.length>0){
    let Plant =ctx.app.context.db.plant
    let id = ctx.params.id
    let reqbody = ctx.request.body
    let data = await Plant.findOne(id)
    if(data){
      let dataArr = await Plant.update({userId:id},reqbody)
      ctx.body = successResData(dataArr[0])
    }else{
      let data = await Plant.create({userId:id,...reqbody})
      ctx.body = successResData(data)
    }
  }else{
    ctx.body=failedLoginRes()
  }
})

router.allowedMethods();

export default router
