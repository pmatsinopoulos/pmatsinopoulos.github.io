---
layout: post
title: "Ruby on Rails Gems I use"
date: 2011-08-10 20:05
comments: true
categories: ["Ruby on Rails"] 
---
Since I have started developing applications with Ruby on Rails, I have used again and again some very useful gems. Here they are:

 
- bundler: The gem dependency resolver and manager.
- mysql2: The ActiveRecord adapter for MySQL. MySQL is my personal preference for database server.
- fast_gettext, gettext_i18n_rails, gettext: For I18n.
- routing-filter: I used this one in one of my multilingual applications, when I wanted my paths to include the locale.
- foreigner: Allows me to declare foreign keys in my migrations.
- nilify_blanks: Very useful to convert empty parameter values to nulls and avoid storing empty strings in db where it should be null.
- jquery-rails: For jQuery used in rails.
- settingslogic: For run-time configuration settings.
- dynamic_form: For "error_messages_for" in my views.
- kaminari: For pagination in my index views.
- unicode: For Unicode support which is missing in ruby 1.8 (available in 1.9).
- rmagick, carrierwave: For image uploading and resizing.
- acts_as_list: For lists that I want to be able to easily reposition their items.
- sitemap_generator: Usefull gem to let you generate sitemap files.

Especially for development and testing:

- mongrel: A web server adequate for development and better than Webrick.
- web-app-theme: A layout for quick start of my web fron end.
- ruby-debug, ruby-debug-ide: For debugging from within my IDE (Intellij)
- mocha: For Moching and Stubbing
- single_test: To be able to run a single test from the command line
- cucumber-rails, database_cleaner: For Cucumber tests.
