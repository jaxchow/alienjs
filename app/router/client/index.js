import Router from 'koa-router'
import ReactDom from 'react-dom'
import client from 'alienjs-client'


let router= Router({
  prefix: 'client'
})

//console.log(client)
// get data list
router.get('*',async (ctx,next)=>{
  ctx.body="body"
});

router.allowedMethods();

export default router
