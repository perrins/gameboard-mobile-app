/*
 *  Licensed Materials - Property of Gameboard
 *  5725-I43 (C) Copyright Gameboard Ltd. 2014. All Rights Reserved.
 *
 */

var cp = require('child_process');

var buildNo = process.env.BUILD_NUMBER;

if (buildNo === undefined){
    buildNo = "00000";
}

// Date
var _date = new Date();

console.log("Build Number :"+buildNo);

module.exports = function (grunt) {

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
                        'tmp'
                    ]
                }]
            },
            js: ["www/lib/ionic/js/*.js", "!www/lib/ionic/js/*.min.js"]

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
                }, {
                    src: "vendor/angular-sanitize/angular-sanitize.min.js",
                    dest: "www/lib/angular/angular-sanitize.min.js"
                }, {
                    src: "vendor/angular-touch/angular-touch.min.js",
                    dest: "www/lib/angular/angular-touch.min.js"
                }, {
                    src: "vendor/angular-wizard/dist/angular-wizard.min.js",
                    dest: "www/lib/angular/angular-wizard.min.js"
                },
                    {
                        src: "vendor/angular-wizard/dist/angular-wizard.min.css",
                        dest: "www/lib/angular/angular-wizard.min.css"
                    },
                    {
                        src: "vendor/angular-messages/angular-messages.min.js",
                        dest: "www/lib/angular/angular-messages.min.js"
                    },
                    {
                        src: "vendor/angular-cookies/angular-cookies.min.js",
                        dest: "www/lib/angular/angular-cookies.min.js"
                    },

                    {
                        src: "vendor/oauth-js/dist/oauth.js",
                        dest: "www/lib/oauth.js"
                    },
                    {
                        src: "vendor/ngCordova/dist/ng-cordova.min.js",
                        dest: "www/lib/ng-cordova.min.js"
                    },
                    {
                        src: "vendor/components-font-awesome/fonts/FontAwesome.otf",
                        dest: "www/fonts/FontAwesome.otf"
                    },
                    {
                        src: "vendor/components-font-awesome/fonts/fontawesome-webfont.eot",
                        dest: "www/fonts/fontawesome-webfont.eot"
                    },

                    {
                        src: "vendor/components-font-awesome/fonts/fontawesome-webfont.ttf",
                        dest: "www/fonts/fontawesome-webfont.ttf"
                    },

                    {
                        src: "vendor/components-font-awesome/fonts/fontawesome-webfont.woff",
                        dest: "www/fonts/fontawesome-webfont.woff"
                    },

                    {
                        src: "vendor/components-font-awesome/fonts/fontawesome-webfont.svg",
                        dest: "www/fonts/fontawesome-webfont.svg"
                    },
                    {
                        src: "vendor/components-font-awesome/css/font-awesome.min.css",
                        dest: "www/css/font-awesome.min.css"
                    }

                ]

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
                    'vendor/ibmbluemix/js/IBMBluemix.js',
                    'vendor/ibmcloudcode/js/IBMCloudCode.js',
                    'vendor/ibmdata/js/IBMData.js',
                    'vendor/swipe/swipe.js',
                    'vendor/sizzle/sizzle.js',
                    'vendor/spin/spin.min.js'

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
                    'config.xml': 'dev/config.xml',
                    'www/config.json': 'dev/config.json'
                },
                options: {
                    replacements: [{
                        pattern: /{{ BUILD_NO }}/g,
                        replacement: '<%= BUILD_NO %>'
                    },
                    {
                        pattern: /{{ VERSION }}/g,
                        replacement: '<%= pkg.version %>'
                    },
                    {
                        pattern: /{{ DATE }}/g,
                        replacement: '<%= DATE %>'
                    },
                    {
                        pattern: /{{ TIME }}/g,
                        replacement: '<%= TIME %>'
                    },
                    {
                        pattern: /{{ VERSION }}/g,
                        replacement: '<%= pkg.version %>'
                    },
                    {
                        pattern: /{{ CODENAME }}/g,
                        replacement: '<%= pkg.codename %>'
                    },
                    {
                        pattern: /{{ NAME }}/g,
                        replacement: '<%= pkg.name %>'
                    },
                    {
                        pattern: /{{ LOCALSERVER }}/g,
                        replacement: false
                    },
                    {
                        pattern: /{{ LOCALSECURITY }}/g,
                        replacement: false
                    }

                    ]
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

        plato: {
            anal: {
                files: {
                    'dev/report': ['src/**/*.js', 'test/**/*.js']
                }
            }
        },

        meta: {
            banner: '/*! <%= pkg.name || pkg.name %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
            '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
            '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>;' +
            ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
        },
        bumpup: ['package.json', 'www/js/build.json'],
        pkg: grunt.file.readJSON('package.json'),
        BUILD_NO : buildNo,
        DATE: grunt.template.today('yyyy-mm-dd'),
        TIME: _date.getUTCHours() + ':' + _date.getUTCMinutes() + ':' + _date.getUTCSeconds()
    });

    require('load-grunt-tasks')(grunt);

    grunt.registerTask('default', [
        'build'
    ]);

    grunt.registerTask('build', [
        'clean:dist',
        'clean:js',
        'concat:vendor',
        'version',
        'string-replace',
        'removelogging',
        'uglify:vendor',
        'copy:dist'

    ]);

    grunt.registerTask('apps',
        [
            'build',
            'shell:prepare',
		//    'shell:build',
            'shell:buildIPA',
            'copy:apps']);

    grunt.registerMultiTask('version', 'Generate version JSON', function () {
        var pkg = grunt.config('pkg');
        this.files.forEach(function (file) {
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
