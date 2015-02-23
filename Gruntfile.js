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

		hockeyapp: {
		    /**
		     * Global options
		     */
		    options: {
		        notes: 'Latest release of the Android ',
		        tags: 'Gameboard,Android,Alpha', // comma-separated list of tags
		        download: true, // Enable/Disable download
		        notify: 1 // 0 - Don't notify, 1 - Notify all that can install this app, 2 - Notify all
		    },
		    /**
		     * App-specific options
		     */
		    Android: {
		        options: {
		            token: '09694e98bdaf4fb9aa0273faeb3117d5', // Upload Token
		            app_id: '27f846d3d03a41bab432cd3968b79d5b', // Application ID
		            download: false, // Disable download of this app
		            file: '/Users/matthewperrins/projects/gameboard-mobile-app/platforms/android/ant-build/CordovaApp-debug.apk' // Path to file
	        	}
		    },

            /**
             * App-specific options
             */
            IOS: {
                options: {
                    token: '09694e98bdaf4fb9aa0273faeb3117d5', // Upload Token
                    app_id: '27f846d3d03a41bab432cd3968b79d5b', // Application ID
                    download: false, // Disable download of this app
                    file: '/Users/matthewperrins/projects/gameboard-mobile-app/platforms/ios/build/Gameboard.ipa' // Path to file
                }
            }


        },

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
                    src: "vendor/angular-messages/angular-messages.min.js",
                    dest: "www/lib/angular/angular-messages.min.js"
                },
                {
                    src: "vendor/angular-cookies/angular-cookies.min.js",
                    dest: "www/lib/angular/angular-cookies.min.js"
                },

                {
					src: "vendor/collide/collide.js",
					dest: "www/lib/collide/collide.js"
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

			},
            apps: {
                files: [
                    {
                        expand: true, flatten: true, filer: 'isFile',
                        src: ['platforms/ios/build/CrocPad.ipa'],
                        dest: '/<projectPath>/Dev/Client/buid/ios/'
                    },
                    {
                        expand: true, flatten: true,
                        src: ['platforms/android/bin/CrocPad-debug.apk'],
                        dest: '/<projectPath>/Dev/Client/buid/android/'
                    },
                    {
                        expand: true, flatten: true,
                        src: ['package.json'],
                        dest: '/<projectPath>/Dev/Client/buid/'
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

		meta: {
            banner: '/*! <%= pkg.name || pkg.name %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
            '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
            '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>;' +
            ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
        },
        bumpup: ['package.json', 'www/js/build.json'],

        shell: {
          options: {
            failOnError: true,
            stdout: false,
            stderr: true
          },
          build: {
            command: 'cordova build ios android'
          },
          prepare: {
            command: 'cordova prepare'
          },
          buildApk: {
            command: 'cordova build android --release'
          },
          buildIpa: {
            command: '/usr/bin/xcrun -sdk iphoneos PackageApplication -v "platforms/ios/build/emulator/Gameboard.app" -o "platforms/ios/build/Gameboard.ipa" --sign "iPhone Developer: Matthew Perrins (HQ89NV2SGV)" -o "Gameboard.ipa" --embed "dev/Gameboard_Adhoc.mobileprovision"'
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
		'concat:vendor',
		'version',
		'string-replace',
		'removelogging',
		'uglify:vendor',
        'copy:dist'

    ]);

	grunt.registerTask('buildApps',
		[
		'bumpup:build',
        'shell:prepare',
		'shell:build',
		'shell:buildIpa',
		'copy:apps']);

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
