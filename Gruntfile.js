'use strict';
var LIVERELOAD_PORT, lrSnippet, mountFolder;

LIVERELOAD_PORT = 35728;

lrSnippet = require('connect-livereload')({
    port: LIVERELOAD_PORT
});


/* var conf = require('./conf.'+process.env.NODE_ENV); */

mountFolder = function (connect, dir)
{
    return connect['static'](require('path').resolve(dir));
};

module.exports = function (grunt)
{
    var yeomanConfig;

    // required for Heroku
    require('grunt-connect-proxy');
    grunt.loadNpmTasks('grunt-connect-proxy');


    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);

    /* configurable paths */
    yeomanConfig = {
        app: '.',
        dist: 'dist',
        docs: 'documentation'
    };
    try {
        yeomanConfig.app = require('./bower.json').appPath || yeomanConfig.app;
    } catch (_error) {
    }
    grunt.initConfig({
        yeoman: yeomanConfig,
        watch: {
            gruntfile: {
                files: ['Gruntfile.js']
            },
            bower: {
                files: ['bower.json'], tasks: ['wiredep']
            },
            js: {
                files: ['<%= yeoman.app %>/js/**/*.js'], tasks: [], options: {
                    livereload: '<%= connect.options.livereload %>'
                }
            },
            //compass: {
            //    files: ['<%= yeoman.app %>/sass/**/*.scss'], tasks: ['compass:server', 'autoprefixer']
            //},
            jsTest: {
                files: ['test/spec/{,*/}*.js'], tasks: ['newer:jshint:test', 'karma']
            },
            livereload: {
                options: {
                    livereload: LIVERELOAD_PORT
                }
                ,
                files: ['<%= yeoman.app %>/index.html',
                        '<%= yeoman.app %>/**/*.html',
                        '.tmp/styles/**/*.css',
                        'css/**/*.css',
                        '.tmp/**/*.js',
                        'js/**/*.js',
                        '<%= yeoman.app %>/images/**/*.{png,jpg,jpeg,gif,webp,svg}',
                        '<%= yeoman.docs %>/jade/*.jade']
            }
        },
        compass: {
            options: {
                sassDir: '<%= yeoman.app %>/sass',
                cssDir: '<%= yeoman.app %>/css',
                raw: 'Sass::Script::Number.precision = 10\n'
            },
            server: {
                options: {
                    debugInfo: true
                }
            }
        },
        connect: {
            options: {
                port: process.env.PORT || 9000,
                hostname: '*'
            },
            livereload: {
                options: {
                    open: true, middleware: function (connect)
                    {
                        return [lrSnippet,
                                mountFolder(connect, '.tmp'),
                                mountFolder(connect, './'),

                                connect().use('/bower_components', connect.static('./bower_components')),
                                require('grunt-connect-proxy/lib/utils').proxyRequest];
                    }
                }
            },
            docs: {
                options: {
                    middleware: function (connect)
                    {
                        return [lrSnippet, mountFolder(connect, yeomanConfig.docs)];
                    }
                }
            },
            test: {
                options: {
                    middleware: function (connect)
                    {
                        return [mountFolder(connect, '.tmp'), mountFolder(connect, 'test')];
                    }
                }
            },
            dist: {
                options: {
                    middleware: function (connect)
                    {
                        return [mountFolder(connect, yeomanConfig.dist)];
                    }
                }
            }
        },
        open: {
            server: {
                url: 'http://localhost:<%= connect.options.port %>'
            }
        },
        clean: {
            dist: {
                files: [
                    {
                        dot: true,
                        src: ['.tmp', '<%= yeoman.dist %>/*', '!<%= yeoman.dist %>/.git*']
                    }
                ]
            },
            all: ['readme.md',
                  '.tmp',
                  '.DS_Store',
                  '.sass-cache',
                  'app/bower_components',
                  'documentation/jade',
                  'documentation/config.codekit',
                  'landing/jade',
                  'landing/config.codekit',
                  'node_modules',
                  '.git'],
            server: '.tmp'
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: ['Gruntfile.js', '<%= yeoman.app %>/scripts/**/*.js']
        },
        jade: {
            docs: {
                options: {
                    pretty: true
                },
                files: {
                    '<%= yeoman.docs %>/index.html': ['<%= yeoman.docs %>/jade/index.jade']
                }
            }
        },
        useminPrepare: {
            html: '<%= yeoman.app %>/index.html',
            options: {
                dest: '<%= yeoman.dist %>',
                flow: {
                    steps: {
                        js: ['concat', 'uglifyjs'],
                        css: ['cssmin']
                    },
                    post: []
                }
            }
        },
        usemin: {
            html: ['<%= yeoman.dist %>/**/*.html', '!<%= yeoman.dist %>/bower_components/**'],
            css: ['<%= yeoman.dist %>/styles/**/*.css'],
            options: {
                dirs: ['<%= yeoman.dist %>']
            }
        },
        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.app %>',
                        src: ['*.html', 'views/*.html'],
                        dest: '<%= yeoman.dist %>'
                    }
                ]
            }
        },
        copy: {
            dist: {
                files: [
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= yeoman.app %>',
                        dest: '<%= yeoman.dist %>',
                        src: [
                            'favicon.ico',
                            'bower_components/font-awesome/css/*',
                            'bower_components/font-awesome/fonts/*',
                            'bower_components/weather-icons/css/*',
                            'bower_components/weather-icons/font/*',
                            'bower_components/weather-icons/fonts/*',
                            'fonts/**/*',
                            'i18n/**/*',
                            'images/**/*',
                            'styles/fonts/**/*',
                            'styles/img/**/*',
                            'styles/ui/images/*',
                            'views/**/*']
                    }, {
                        expand: true,
                        cwd: '.tmp',
                        dest: '<%= yeoman.dist %>',
                        src: ['styles/**', 'assets/**']
                    }, {
                        expand: true,
                        cwd: '.tmp/images',
                        dest: '<%= yeoman.dist %>/images',
                        src: ['generated/*']
                    }
                ]
            },
            styles: {
                expand: true,
                cwd: '<%= yeoman.app %>/styles',
                dest: '.tmp/styles/',
                src: '**/*.css'
            }
        },

        // Test settings
        karma: {
            unit: {
                configFile: 'test/karma.conf.js', singleRun: true
            }
        },
        cssmin: {
            target: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/styles/',
                    src: ['*.css', '!*.min.css'],
                    dest: '<%= yeoman.dist %>/styles',
                    ext: '.min.css'
                }]
            }
        },
        concat: {
            options: {
                separator: grunt.util.linefeed + ';' + grunt.util.linefeed
            },
            dist: {}
        },
        uglify: {
            options: {
                mangle: true,
                compress: {
                    drop_console: true
                }
            },
            dist: {}
        },

        // Automatically inject Bower components into the app
        wiredep: {
            options: {
//        cwd: '<%= yeoman.app %>'
            }, app: {
                src: ['<%= yeoman.app %>/index.html'], ignorePath: /\.\.\//
            }
        },
        concurrent: {
            server: ['copy:styles'],
            dist: ['copy:styles', 'htmlmin'],
            test: ['copy:styles']
        },
        // Add vendor prefixed styles
        autoprefixer: {
            options: {
                browsers: ['last 1 version']
            }, dist: {
                files: [{
                    expand: true, cwd: '.tmp/styles/', src: '{,*/}*.css', dest: '.tmp/styles/'
                }]
            }
        }
    });
    grunt.registerTask('server', function (target)
    {
        grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
        if (target === 'dist') {
            return grunt.task.run(['serve:dist']);
        }
        return grunt.task.run(['serve']);
    });
    grunt.registerTask('serve', function (target)
    {
        if (target === 'dist') {
            return grunt.task.run(['build', 'wiredep', 'open', 'connect:dist:keepalive']);
        }
        return grunt.task.run(['clean:server', 'configureProxies:server', 'connect:livereload', 'watch']);
    });


    // Heroku
    grunt.registerTask('heroku', 'Compile then start a connect web server', function (target)
    {
        if (target === 'dist') {
            return grunt.task.run(['build', 'connect:dist:keepalive', 'configureProxies:server']);
        }
        grunt.task.run(['clean:server', 'wiredep', 'concurrent:server', 'configureProxies:server', 'autoprefixer']);
    });


    grunt.registerTask('docs', function ()
    {
        return grunt.task.run(['jade:docs', 'connect:docs', 'open', 'watch']);
    });
    grunt.registerTask('build', ['clean:dist', 'wiredep', 'useminPrepare', 'htmlmin', 'copy:dist', 'cssmin', 'concat', 'uglify', 'usemin']);
    return grunt.registerTask('default', ['serve']);
};
