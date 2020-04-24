import Router from 'koa-router'
import moment from 'moment'
let router= Router({
  prefix: 'device'
})

// 设备数据
router.get('/data/:userId',async (ctx,next)=>{
  let result = Object.create(null)
  let userId = ctx.params.userId
  let param = ctx.query
  let endDate = param.endDate+' 23:59:59'
  let Data = ctx.app.context.db.data;
  let data = await Data.find().where(
    {
      updatedAt:{
        '>=':param.startDate,
        '<=':endDate
      },userId:userId,catalogId:param.type
    }
  )
  result['exception']=false
  result['msg']='请求成功'
  result['total']=data.length
  result['data']=data
	ctx.body = result
});
// 上报设备数据
router.post('/data/:userId',async (ctx,next)=>{
  let result = Object.create(null)
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
  result['exception']=false
  result['msg']='请求成功'
  result['data']=data

	ctx.body = result
});

router.allowedMethods();

export default router
