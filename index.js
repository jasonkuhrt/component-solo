var format = require('util').format
var program = require('commander')
var gnarl = require('gnarl')
var make_demo = require('./lib/make-demo')



program
  .version(require('./package').version)
  .option('-r --reactjs [false]', 'Include reactjs script tag', Boolean)
  .option('-s --solo [true]', 'Use solo mode', Boolean, true)
  .option('--path [/]', 'Solo a sub-component', String, '')
  .option('-t --template [center]', 'Template to solo in [bare, center]', String, 'center')
  .option('-p --port [4520]', 'Static server port', Number, 4520)
  .parse(process.argv)


// Prepare index.html
if (program.solo) make_demo({
  template: program.template,
  sub_component_path: program.path,
  index_locals: {
    // TODO: flag just for react is a temporary hack
    is_reactjs: program.reactjs
  }
})

// Run component and serve
gnarl.run('component-build --watch --reload')
gnarl.run(format('serve --port %s build', program.port))




// Open the browser to the project for the user
// Delay this slightly so that it does not open
// before the server is running.

var cp = require('child_process')

setTimeout(function(){
  cp.spawn('open', ['http://localhost:' + String(program.port)])
}, 500)