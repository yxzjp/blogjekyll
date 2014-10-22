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
						"jquery-1.10.2.min.js",
						"$.extend.js",
						"underscore-min.js",
						"underscore-min.map"
					],
					"./release/index.js" :[
						"scroll.js",
						"login.js"
					]
				}
			}
		},
		"uglify" : {
			options : {
				banner : "/*!<%=pkg.name%> - <%=pkg.version%> - <%=grunt.template.today('YYYY-MM-DD')%>*/"
			},
			target : {
				files : [
					{"./release/dest/index.js" : "./release/src/index.js"}
				]
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
					src: ['module/*.js'],
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
	    	},
	    	"release" : {
	    		files: [{
	    			expand: true,
					cwd: 'release',
					src: ['**/*']
	    		}]
	    	}
	    }
	});
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-cmd-transport');

	grunt.registerTask('dist', ['clean','copy', 'transport', 'concat']);
	grunt.registerTask('default', ['dist']);
}