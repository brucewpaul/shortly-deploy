module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';',
      },
      dist1: {
        src: ['public/client/app.js', 'public/client/link.js', 'public/client/links.js', 'public/client/linkView.js', 'public/client/linksView.js', 'public/client/createLinkView.js', 'public/client/router.js'],
        dest: 'public/dist/clientfiles.js',
      },
      dist2: {
        src: ['public/lib/jquery.js', 'public/lib/underscore.js', 'public/lib/backbone.js', 'public/lib/handlebars.js'],
        dest: 'public/dist/libraries.js',
      },
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },

    nodemon: {
      dev: {
        script: 'server.js'
      }
    },

    uglify: {
      my_target: {
        files: {
          'public/dist/clientfiles.min.js': ['public/dist/clientfiles.js'],
          'public/dist/libraries.min.js': ['public/dist/libraries.js']
        }
      }
    },

    eslint: {
      target: [
        // Add list of files to lint here
        'public/client/app.js', 'public/client/link.js', 'public/client/links.js', 'public/client/linkView.js', 'public/client/linksView.js', 'public/client/createLinkView.js', 'public/client/router.js', 'public/lib/jquery.js', 'public/lib/underscore.js', 'public/lib/backbone.js', 'public/lib/handlebars.js'
      ]
    },

    cssmin: {
      target: {
        files: [{
          expand: true,
          cwd: 'public',
          src: ['*.css', '!*.min.css'],
          dest: 'public/dist',
          ext: '.min.css'
        }]
      }
    },

    watch: {
      scripts: {
        files: [
          'public/client/**/*.js',
          'public/lib/**/*.js'
        ],
        tasks: [
          'concat',
          'uglify'
        ]
      },
      css: {
        files: 'public/*.css',
        tasks: ['cssmin']
      }
    },

    shell: {
      multiple: {
        command: [
          'git add .',
          'git commit -m "deploying latest changes from grunt" ',
          'git push live master'
        ].join('&&')
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('server-dev', function (target) {
    grunt.task.run([ 'nodemon', 'watch' ]);
  });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('test', [
    'eslint',
    'mochaTest'
  ]);

  grunt.registerTask('build', ['test', 'concat', 'uglify', 'cssmin']);

  grunt.registerTask('upload', function(n) {
    if (grunt.option('prod')) {
      // add your production server task here
      grunt.task.run([ 'shell' ]);
    } else {
      grunt.task.run([ 'server-dev' ]);
    }
  });

  grunt.registerTask('deploy', [
    // add your deploy tasks here
    'build', 'upload'
  ]);


};
