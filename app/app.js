import logger from 'koa-logger'
import convert from 'koa-convert'
import responseTime from 'koa-response-time'
import cors from 'koa-cors'
import gzip from 'koa-gzip'
import bodyParser from 'koa-bodyparser'
import slow from 'koa-slow'
import session from 'koa-session'
import passport from 'koa-passport'
import Alien from 'koa'
//import Alien from './alien'
import router from './router'
import models from './models'

let	app =new Alien()

app.keys=['alienjs']
// logger
// app.mw(app.APPLICATION,middleware)
// app.mw(app.SESSION,middleware)
// app.mw(app.SESSION,middleware)
// app.mw(app.ROUTER,middleware)
// app.mw(app.VIEW,middleware)
app.use(convert(logger()))
app.use(convert(session(app)))
app.use(convert(passport.initialize()))
app.use(convert(passport.session()))
app.use(convert(responseTime()))
//app.use(rewrite('/cebbank/*','/$1'))
app.use(convert(gzip()))
app.use(convert(cors()))
app.use(bodyParser())

// autowire ctx.req.body
app.use(async (ctx,next)=> {
  if (ctx.req.method == 'POST' || ctx.req.method == 'PUT') {
		  ctx.req.body = ctx.request.body
	}
	await next()
})

models.initialize(function(err, ontology){
	if(err){throw err}
	app.context.db=ontology.collections
	console.log('database adapter initialized connection')
})

/*
app.mw(slow({
    url: /\.do$/i,
    delay: 5000
}))
*/
app.use(router.routes())
//app.mw(livereload())
app.use(convert(session(app)))
app.listen(4000,(err)=>{
	if(err) throw err;
	console.log("alien app is running!http://localhost:4000/")
});
export default app
