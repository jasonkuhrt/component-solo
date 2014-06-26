var fs = require('fs')
var path = require('path')
var jade = require('jade')
var merge  = require('merge-util')
var log = require('component-consoler')



module.exports = make_demo



/* Read the local demo.jade file and
Inject it into parent template. */
function make_demo(opts){
  // Assemble our paths
  var indexhtml_path = path.join(process.cwd(), '/build/index.html')
  var demo_path = path.join(process.cwd(), opts.sub_component_path, 'demo.jade')
  var index_path = path.join(__dirname, '../templates/', opts.template+'.jade')

  // If there is already an index.html then watch out;
  // We should NOT just overwrite it!
  // The user should be prompted to resolve this.
  // Fatal! Fatal! Fatal!
  if (fs.existsSync(indexhtml_path)) index_exists_error()

  // Create the temporary index.html file
  // which contains the user's demo
  var index_opts = merge({
      title: resolve_name(opts.sub_component_path),
      body: render_jade(demo_path)
    },
    opts.index_locals
  )
  var indexhtml = render_jade(index_path, index_opts)
  fs.writeFileSync(indexhtml_path, indexhtml)

  // Once this program exists
  // clean up our temporary index.html file
  process.once('exit', fs.unlinkSync.bind(fs, indexhtml_path))
}



// Private

function resolve_name(suffix){
  var cjson = JSON.parse(fs.readFileSync(process.cwd() + '/component.json', 'utf8'))
  var name = [cjson.name, suffix].join(' ').trim()
  return name
}

function render_jade(path, opts){
  return jade.renderFile(path, merge({pretty: true}, opts))
}

function index_exists_error(){
  log.fatal(new Error('component-dev cannot continue with --solo because build/index.html already exists!'))
}