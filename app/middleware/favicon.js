
import favicon from 'serve-favicon'
import path from 'path'

let faviconPath=process.env.npm_package_config_middleware_favicon_path
//npm_package_config_middleware_favicon

export default favicon(faviconPath)
