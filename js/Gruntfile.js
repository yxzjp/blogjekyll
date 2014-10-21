module.exports = function(grunt) {
	grunt.file.defaultEncoding = 'utf8';

	var pkg = grunt.file.readJSON('package.json');
	grunt.initConfig({
		"pkg" : pkg,
		"concat" : {
			options : {
				separator : ";"
			},
			dev : {
				"files" : {
					"./release/core.js" : [
						".build/jquery-1.10.2.min.js",
						".build/underscore-min.js",
						".build/underscore-min.map",
					],
					"./release/index.js" :[
						".build/scroll.js",
						".build/login.js"
					]
				}
			}
		},
		"watch": {
			files: '**/*.js',
			tasks: 'dist'
		},
		"transport": {
			home: {
				files: [{
					expand: true,
					cwd: '.build',
					src: '**/*.js',
					filter: 'isFile',
					dest: '.build'
				}] 
			},
			options: {
				debug: false,
				paths: ['.build']
			} 
		},
		"copy": {
	    	"dev": {
				files: [{
					expand: true,
					cwd: '.',
					src: ['*.js','module/*.js'],
					dest: '.build/',
					filter: 'isFile'
				}]
			}
	    },
	    "clean": {
	    	build: {
	    		files: [{
	    			expand: true,
					cwd: '.build',
					src: ['**/*'],
					filter: 'isFile'
	    		}]
	    	}
	    }
	});
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-cmd-transport');

	grunt.registerTask('dist', ['clean:build','copy', 'transport', 'concat']);
	grunt.registerTask('default', ['dist']);
}