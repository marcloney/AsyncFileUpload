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
        dest: 'tmp/bower.js'
      , exclude: ['jquery', 'async']
      }
    }
  , concat: {
      options: {
        seperator: ";"
      }
    , dist: {
        src: ['bower_components/async/lib/async.js', 'tmp/bower.js', 'js/main.js']
      , dest: 'tmp/main.js'
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

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-bower-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['jshint', 'bower', 'concat', 'uglify', 'clean']);
};
