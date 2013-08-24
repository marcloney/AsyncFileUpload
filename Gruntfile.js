module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json')
  , bower: {
      all: {
        dest: './tmp/main.js'
      , exclude: 'jquery'
      }
    }
  , uglify: {
      build: {
        files: {
          './<%= pkg.name %>-<%= pkg.version %>.min.js': ['./tmp/main.js']
        }
      }
    }
  });

  grunt.loadNpmTashs('grunt-bower-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['bower', 'uglify']);
};
