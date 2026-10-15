
src/
├── jephy-mvc/              	# The PHP Code Base
│   ├── bootstrap.php		# Just a bootstrap file
│   ├── config.conf		# Application configuration files
│   ├── example.config.conf
│   ├── index.php
│   ├── routes.php		# Application routes are declared on this file
│   ├── app/
│   │   ├── cache/
│   │   ├── classes/		# App\Classes - Your custom classes lives here
│   │   ├── controllers/	# App\Controllers - The controllers written by you lives here
│   │   ├── entities/		# App\Entities - Custom database entities should live here
│   │   ├── hooks/		# App\Hooks - Application hooks lives here
│   │   ├── model/		# App\Model - Database Models should live here
│   │   ├── traits/		# App\Traits - Custom application traits should live here
│   │   └── views/
│   │		├── emails/
│   │		├── home/    
│   │		│   └── 404.tp    
│   │		└── layout.tpl    
│   │		    
│   ├── config/
│   │   ├── config.php
│   │   ├── database.php
│   │   ├── index.php
│   │   └── mail.php
│   ├── core/			# You are not meant to work here except you know what you are doing.
│   │   ├── ...
│   │   ├── Controller.php
│   │   ├── Framework.php
│   │   ├── Router.php
│   │   └── ...
│   └── views/
│       ├── emails/
│       ├── home/
│       │   └── 404.tpl
│       └── layout.tpl
│
├── public/		# This is the root document that's publicly accessible
│   ├── assets/        	# Folder for CSS, JavaScript and other web resource files
│   ├── static-files/   # Alternative static files
│   ├── .htaccess       # URL Rewrite statements
│   ├── favicon.ico     # Website's favicon
│   ├── index.php       # Boostrap file or app's entry point
│   ├── open-graph.jpg	# Social media open-graph image
│   ├── access.log	# Optional - mostly useful for local development
│   └── error.log	# Optional - mostly useful for local development
│
├── vendor/
│   └── ...
│                    
├── composer.json
└── composer.lock