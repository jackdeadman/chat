module.exports = function(grunt){
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		
		watch: {
			options: {
				livereload: true,
			},
			css: {
				files: ['public/css/src/*.scss'],
				tasks: ['sass'],
				options: {
					spawn: false,
				},
			},
			html: {
				files: ['views/*.ejs']
			}
		},
		
		sass: {
			dist: {
				src: ['public/css/src/all.scss'],
				dest: 'public/css/main.css'
			},
		},
		
		nodemon: {
			dev: {
				script: 'bin/www'
			}
		},
		
		concurrent: {
			dev: {
				tasks: ['nodemon', 'watch'],
				options: {
					logConcurrentOutput: true
				}
			}
		}
		
	});
	
	grunt.loadNpmTasks('grunt-concurrent');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-nodemon');
	
	grunt.registerTask('default', '', function() {
		var taskList = ['concurrent','nodemon','watch'];
		grunt.task.run(taskList);
	});
};