module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json')
  , uglify: {
      build: {
        files: {
          './<%= pkg.name %>-<%= pkg.version %>.min.js': ['./js/main.js']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['uglify']);
};
