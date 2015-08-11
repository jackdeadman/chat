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
		},
		
		sass: {
			dist: {
				src: ['public/css/src/all.scss'],
				dest: 'public/css/main.css'
			},
		},
		
	});
	
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-sass');
	
	grunt.registerTask('default', ['sass','watch']);
};