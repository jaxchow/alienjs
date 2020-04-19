
import Router from 'koa-router'

let router= Router({
  prefix: 'book'
})

// get data list
router.get('/',async (ctx,next)=>{
  let result = Object.create({exception:false,msg:'请求成功'})
  let Book = ctx.app.context.db.book;
  // let total= await Book.count()
  let list 
  if(ctx.query.year){
    list = await Book.find().where({year:{'>':ctx.query.year}}).paginate({page: 1, limit: 10})
  }else{
    list = await Book.find().paginate({page: 1, limit: 10})
  }


  result['exception']=false
  result['msg']='请求成功'
  // result['total']=total
  result['list']=list
	ctx.body = result
});

// get 5
router.get('/find5',async (ctx,next)=>{
  let result = Object.create(null)
  console.log("find5")
  let Book = ctx.app.context.db.book
  let data = await Book.find().paginate({page: 1, limit: 2})
  console.log("111",data)
  if(!data){
    result['exception']=true
    result['msg']="找不到数据"
  }else{
    result['exception']=false
    result['msg']="请求成功"
    result['item']=data
  }
  ctx.body=result
})


// get id
router.get('/:id',async (ctx,next)=>{
  let result = Object.create(null)
  let id=ctx.params.id
  let Book = ctx.app.context.db.book
  console.log("id",id)
  let data =await Book.findOne(id)
  if(!data){
    result['exception']=true
    result['msg']="找不到数据"
  }else{
    result['exception']=false
    result['msg']="请求成功"
    result['item']=data
  }
	ctx.body=result
})


// new
router.post('/',async (ctx,next)=>{
	let result = Object.create(null)
	console.log(`Request Body: ${JSON.stringify(ctx.request.body)}`)
	let param = ctx.request.body
	let Book = ctx.app.context.db.book
	console.log(param)
	let data = await Book.create(param)

  if(!data){
    result['exception']=true
    result['msg']="保存失败"
  }else{
    result['exception']=false
    result['msg']="保存成功"
    result['list']=[]
  }


	ctx.body=result
})
//edit
router.put('/:id',async (ctx,next)=>{
  let result = Object.create(null)
  let id= ctx.params.id
  let body= ctx.request.body
  let Book = ctx.app.context.db.book
  console.log(body,id)
  await Book.update({id:id},body).exec(function(err,data){
    console.log(err)  
  })

  // if(err){
  //   result['exception']=true
  //   result['msg']="保存失败"
  // }else{
    result['exception']=false
    result['msg']="更新成功"
    result['list']=[]
  // }
  // console.log(ctx)
  ctx.body=result
})

router.delete('/:id',async (ctx,next)=>{
  let result= Object.create(null);
  let id = ctx.params.id
  let Book = ctx.app.context.db.book

  let list =await Book.destroy(id);
  result['exception']=false
  result['msg']='删除成功'
  ctx.body=result
})

router.allowedMethods();

export default router
