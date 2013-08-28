module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json')
  , watch: {
      scripts: {
        files: ['lib/js/*.js', 'lib/css/*.css']
      , tasks: ['clean:preBuild', 'jshint', 'bower', 'concat', 'uglify', 'cssmin', 'clean:postBuild']
      }
    }
  , jshint: {
      all: ['lib/js/*.js']
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
    , scripts: {
        src: ['bower_components/async/lib/async.js', 'tmp/bower.js', 'lib/js/*.js']
      , dest: 'release/<%= pkg.name %>-<%= pkg.version %>.js'
      }
    , styles: {
        src: ['lib/css/*.css']
      , dest: 'release/<%= pkg.name %>-<%= pkg.version %>.css'
      }
    }
  , uglify: {
      build: {
        files: {
          'release/<%= pkg.name %>-<%= pkg.version %>.min.js': ['release/<%= pkg.name %>-<%= pkg.version %>.js']
        }
      }
    }
  , cssmin: {
      build: {
        files: {
          'release/<%= pkg.name %>-<%= pkg.version %>.min.css': ['release/<%= pkg.name %>-<%= pkg.version %>.css']
        }
      }
    }
  , clean: {
      preBuild: ['release/']
    , postBuild: ['tmp/']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-bower-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['clean:preBuild', 'jshint', 'bower', 'concat', 'uglify', 'cssmin', 'clean:postBuild']);
};
