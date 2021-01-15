import Router from 'koa-router'
import { successResData, failedRes } from '../../Utils/RouterResultUtils'
import { PromiseAggregate } from '../../Utils/mongodbUtils'


let router = Router({
  prefix: 'rank'
})

// 用户排行(已登录)
router.get('/:userId', async (ctx, next) => {
  let Data = ctx.app.context.db.data;
  let Catalog = ctx.app.context.db.catalog;
  let User = ctx.app.context.db.user;
  let userId = ctx.params.userId
  let param = ctx.query // startDate endDate startNum endNum catalogId
  // console.log(param,param.catalogId==undefined)
  if (param.catalogId == undefined) {
    // console.log("catalogID")
    ctx.body = failedRes('缺少参数：catalogId')
    return
  } else if (param.endNum == undefined) {
    ctx.body = failedRes('缺少参数：endNum')
    return
  } else if (param.startNum == undefined) {
    ctx.body = failedRes('缺少参数：startNum')
    return
  }
  let myData = {}
  let match = {}
  if (!param.startDate && !param.endDate) {
    match = {
      catalogId: param.catalogId,
    }
  } else {
    let startDate = param.startDate + 'T00:00:00Z'
    let endDate = param.endDate + 'T23:59:59Z'
    match = {
      catalogId: param.catalogId,
      createdAt: { $gt: new Date(startDate), $lt: new Date(endDate) }
    }
  }

  let catalogData = await Catalog.findOne({ where: { _id: param.catalogId } })
  if (!catalogData) {
    ctx.body = failedRes('请输入正确catalogId')
    return
  } else {
    // 排行的用户数据
    const aggregateArray = [
      {
        $match: match
      },
      {
        $group: {
          _id: "$userId",
          userId: { $first: "$userId" },
          calorie: { $sum: "$calorie" },
          value: { $sum: "$value" },
          time: { $sum: "$time" },
          count: { $sum: 1 }
        }
      },
      {
        $sort: {
          value: -1,
        }
      }, {
        $lookup: {
          from: 'user',
          let: { "user_id": "$_id" },
          pipeline: [
            { "$addFields": { "uId": { "$toString": "$_id" } } },
            { "$match": { "$expr": { "$eq": ["$uId", "$$user_id"] } } }
          ],
          as: 'user'
        }
      }, {
        $unwind: "$user"
      }
    ]

    const result = await PromiseAggregate(Data, aggregateArray)
    let rankResult = result.map((rr, idx) => { rr.rank = idx + 1; return rr })
    myData = result.filter(f => f.userId == userId).pop()
    let cutList = result.slice(param.startNum, Number(param.endNum) + 1)
    ctx.body = successResData({
      myData: myData,
      total: result.length,
      list: cutList,
      catalogId: catalogData.id,
      type: catalogData.type,
      unit: catalogData.unit
    })
  }
});

// // 用户排行(未登录)
router.get('/', async (ctx, next) => {
  let Data = ctx.app.context.db.data;
  let Catalog = ctx.app.context.db.catalog;
  let User = ctx.app.context.db.user;
  let param = ctx.query // startDate endDate startNum endNum catalogId
  if (!param.catalogId) {
    ctx.body = failedRes('缺少参数：catalogId')
    return
  } else if (!param.startDate) {
    ctx.body = failedRes('缺少参数：startDate')
    return
  } else if (!param.endDate) {
    ctx.body = failedRes('缺少参数：endDate')
    return
  } else if (!param.endNum) {
    ctx.body = failedRes('缺少参数：endNum')
    return
  } else if (!param.startNum) {
    ctx.body = failedRes('缺少参数：startNum')
    return
  }
  let startDate = param.startDate + 'T00:00:00Z'
  let endDate = param.endDate + 'T23:59:59Z'

  // console.log(startDate,endDate)
  // 排行的用户数据

  let catalogData = await Catalog.findOne({ where: { _id: param.catalogId } })
  if (!catalogData) {
    ctx.body = failedRes('请输入正确catalogId')
  } else {
    const aggregateArray = [
      {
        $match: {
          catalogId: param.catalogId,
          createdAt: { $gt: new Date(startDate), $lt: new Date(endDate) }
        }
      },
      {
        $group: {
          _id: "$userId",
          userId: { $first: "$userId" },
          calorie: { $sum: "$calorie" },
          value: { $sum: "$value" },
          time: { $sum: "$time" },
          count: { $sum: 1 }
        }
      },
      {
        $sort: {
          value: -1,
        }
      },
      {
        $lookup: {
          from: 'user',
          let: { "user_id": "$_id" },
          pipeline: [
            { "$addFields": { "uId": { "$toString": "$_id" } } },
            { "$match": { "$expr": { "$eq": ["$uId", "$$user_id"] } } }
          ],
          as: 'user'
        }
      }, {
        $unwind: "$user"
      }
    ]

    let result = await PromiseAggregate(Data, aggregateArray)
    let rankResult = result.map((rr, idx) => { rr.rank = idx + 1; return rr })
    let cutList = rankResult.slice(param.startNum, Number(param.endNum) + 1)

    ctx.body = successResData({
      total: result.length,
      list: cutList,
      catalogId: catalogData.id,
      type: catalogData.type,
      unit: catalogData.unit,
    })
  }

});

router.allowedMethods();

export default router
