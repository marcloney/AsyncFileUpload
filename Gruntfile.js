module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json')
  , jshint: {
      all: ['js/main.js']
    , options: {
        jshintrc: '.jshintrc'
      }
    }
  , bower: {
      all: {
        dest: 'tmp/main.js'
      , exclude: ['jquery', 'async']
      , include: ['bower_components/async/lib/async.js', 'js/main.js']
      }
    }
  , uglify: {
      build: {
        files: {
          '<%= pkg.name %>-<%= pkg.version %>.min.js': ['tmp/main.js']
        }
      }
    }
  , clean: ['tmp/']
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-bower-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['jshint', 'bower', 'uglify']);
};
