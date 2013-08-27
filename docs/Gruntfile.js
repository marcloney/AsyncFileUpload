module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json')
  , watch: {
      scripts: {
        files: ['scripts/*.js']
      , tasks: ['jshint', 'uglify']
      }
    , styles: {
        files: ['styles/*.css']
      , tasks: ['cssmin']
      }
    }
  , jshint: {
      all: ['scripts/*.js']
    , options: {
        jshintrc: '.jshintrc'
      }
    }
  , 
  });

 grunt.loadNpmTasks('grunt-contrib-cssmin');
 grunt.loadNpmTashs('grunt-contrib-uglify');
 grunt.loadNpmTasks('grunt-contrib-watch');
 grunt.loadNpmTashs('grunt-contrib-watch');

