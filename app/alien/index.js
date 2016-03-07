import koa from 'koa'
import assert from 'assert'

// mw middleware before of use middleware
koa.prototype.mw=function(fn){
	this.use(fn)
	return this;
};

export default koa
