'use strict'

// npm run finder -- -c CMYK p = /path/to/images

// Settings
let filetypes = ['jpg', 'png', 'gif']
	, path = '/Volumes/marketing-1/Digital Marketing/Product Assets/Arachnid'
	, colorSpace = 'CMYK'		// CMYK or sRGB




// Modules
const im = require('node-imagemagick')
	, glob = require('glob')
	, clArgs = require('command-line-args')
	, argOpts = [
		{
			name: 'path',
			alias: 'p',
			type: String
		},
		{
			name: 'colorspace',
			alias: 'c',
			type: String
		}
	]


// Override settings with arguments
const args = clArgs(argOpts)
if(args.path){
	path = args.path
}
if(args.colorspace){
	colorSpace = args.colorSpace
}


// Path to all images
let wildPath = path + '/**/*.{'+filetypes.join(',')+'}'



// Find images
function findFiles(){
	console.log('Searching ' + path + ' for ' + colorSpace + ':\n')
	glob(wildPath, function(err, files) {
		if(err) throw err
		if(!files.length){
			return console.log(files.length + ' files found!')
		}
		checkColorSpace(files)
	})
}


// Check colorspace of files array
function checkColorSpace(files){

	let progress = 0

	process.on('uncaughtException', function(err){
		console.log('CANNOT READ: ' + files[progress])
		found(files[progress])
	})

	function found(file, color){

		if(color == colorSpace){
			console.log(file.replace(path, ''))
		}
		progress++
		if(progress >= files.length){
			console.log('\nDone!')
		}
		else{
			checkFile(files[progress], found)
		}
	}

	checkFile(files[0], found)

}


// Check colorspace of a single file
function checkFile(path, done){
	//console.log('CHECKING: ' + path)
	im.identify(['-format', '%[colorspace]', path], function(err, clr){
		if(err){
			console.error(err)
			done(path)
		}
		done(path, clr)
	})
}


// Go!
findFiles()