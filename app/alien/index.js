import Application from 'koa'
import convert from 'koa-convert'
import isGeneratorFunction from 'is-generator-function'

class Alien extends Application {
	mw(fn){
		if (isGeneratorFunction(fn)){
			this.use(convert(fn))
		}else{
			this.use(fn)
		}
	}
}

export default Alien
