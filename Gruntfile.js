/*
 *  Licensed Materials - Property of Gameboard
 *  5725-I43 (C) Copyright Gameboard Ltd. 2014. All Rights Reserved.
 *
 */

var cp = require('child_process');

module.exports = function(grunt) {

    // load all grunt tasks
    require('load-grunt-tasks')(grunt);

    var path = require('path');

    // show elapsed time at the end
    require('time-grunt')(grunt);

    grunt.initConfig({

        clean: {
            options: {
                force: false
            },
            dist: {
                files: [{
                    dot: true,
                    src: [
                        'www/js/lib',
                        'tmp'
                    ]
                }]
            },
        },

        // copy modified and customized libraries to the source folder
        // so that it is available
        // as local module so that uRequire does not interpret them as
        // node modules and ignore
        // to include in the combined SDK
        copy: {
            dist: {
                files: [{
                    src: "vendor/jquery/dist/jquery.min.js",
                    dest: "www/lib/jquery.min.js"
                },{
                    src: "vendor/angular-sanitize/angular-sanitize.min.js",
                    dest: "www/lib/angular/angular-sanitize.min.js"
                },{
                    src: "vendor/angular-touch/angular-touch.min.js",
                    dest: "www/lib/angular/angular-touch.min.js"
                },{
                    src: "vendor/angular-wizard/dist/angular-wizard.min.js",
                    dest: "www/lib/angular/angular-wizard.min.js"
                },
                {
                    src: "vendor/angular-wizard/dist/angular-wizard.min.css",
                    dest: "www/lib/angular/angular-wizard.min.css"
                },
                {
                    src: "vendor/collide/collide.js",
                    dest: "www/lib/collide/collide.js"
                },

                {
                    src: "vendor/oauth-js/dist/oauth.js",
                    dest: "www/lib/oauth.js"
                }]
            }
        },

        concat: {
            options: {
                separator: ';\n'
            },

            vendor: {
                options: {
                    banner: '/*!\n' + ' * <%= pkg.name%>.bundle.js is a concatenation of vendor file\n */\n\n'
                },
                src: [
                    'vendor/jquery/dist/jquery.js',
                    'vendor/jquery-bridget/jquery.bridge.js',
                    'vendor/get-style-property/get-style-property.js',
                    'vendor/get-size/get-size.js',
                    'vendor/eventEmitter/EventEmitter.js',
                    'vendor/eventie/eventie.js',
                    'vendor/doc-ready/doc-ready.js',
                    'vendor/matches-selector/matches-selector.js',
                    'vendor/outlayer/item.js',
                    'vendor/outlayer/outlayer.js',
                    'vendor/masonry/masonry.js',
                    'vendor/swipe/swipe.js',
                    'vendor/sizzle/sizzle.js',
                    'vendor/spin/spin.min.js',
                    'vendor/ibmbluemix/js/IBMBluemix.js',
                    'vendor/ibmcloudcode/js/IBMCloudCode.js',
                    'vendor/ibmdata/js/IBMData.js'


                ],
                dest: 'tmp/js/<%= pkg.name%>.vendor.js'
            }

        },
        jshint: {
            files: ['Gruntfile.js', 'js/**/*.js', 'test/**/*.js'],
            options: {
                jshintrc: '.jshintrc'
            }
        },
        uglify: {
            vendor: {
                files: {
                    'www/lib/<%= pkg.name%>.vendor.min.js': 'tmp/js/<%= pkg.name%>.vendor.js'
                }
            },

            options: {
                preserveComments: 'some'
            }
        },
        cssmin: {
            dist: {
                files: {
                    'www/css/app.min.css': 'base/css/app.css',
                    'www/css/gameboard.min.css': 'base/css/gameboard.css'
                }
            }
        },
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: 'base/img',
                    src: ['**/{,*/}*.{png,jpg,jpeg}'],
                    dest: 'www/img'
                }]
            }
        },

        version: {
            dist: {
                dest: 'www/version.json'
            }
        },

        'removelogging': {
            dist: {
                files: [{
                    expand: true,
                    cwd: 'dist/js/',
                    src: ['*.js'],
                    dest: '.'
                }],
                options: {
                    methods: 'log info assert count clear group groupEnd groupCollapsed trace debug dir dirxml profile profileEnd time timeEnd timeStamp table exception'.split(' ')
                }
            }
        },

        'string-replace': {
            version: {
                files: {
                    'base/config.xml': 'www/config.xml'
                },
                options: {
                    replacements: [{
                        pattern: /{{ VERSION }}/g,
                        replacement: '<%= pkg.version %>'
                    }]
                }
            }
        },
        bump: {
            options: {
                files: ['package.json'],
                commit: false,
                createTag: false,
                push: false
            }
        },
        shell: {
            IOSBuild: {
                command: 'ionic build ios',
                options: {
                    async: false,
                    execOptions: {
                        cwd: '.'
                    }
                }
            },
            AndroidPrepare: {
                command: 'ionic build android',
                options: {
                    async: false,
                    execOptions: {
                        cwd: '.'
                    }
                }
            },

            options: {
                stdout: true,
                stderr: true,
                failOnError: true
            }
        },

        pkg: grunt.file.readJSON('package.json')
    });

    require('load-grunt-tasks')(grunt);

    grunt.registerTask('default', [
        'build'
    ]);

    grunt.registerTask('build', [
        'bump',
        'clean:dist',
        'copy:dist',
        'concat:vendor',
        'version',
        'string-replace',
        'removelogging',
        'uglify:vendor'
    ]);

    grunt.registerMultiTask('version', 'Generate version JSON', function() {
        var pkg = grunt.config('pkg');
        this.files.forEach(function(file) {
            var dest = file.dest;
            var d = new Date();
            var version = {
                version: pkg.version,
                codename: pkg.codename,
                date: grunt.template.today('yyyy-mm-dd'),
                time: d.getUTCHours() + ':' + d.getUTCMinutes() + ':' + d.getUTCSeconds()
            };
            grunt.file.write(dest, JSON.stringify(version, null, 2));
        });
    });

};
