---
layout: page
title: "ezMTA"
date: 2013-01-01 23:29
comments: true
sharing: true
footer: true
---

## Application Purpose

This application allows research institutions and their contract administrators to easily track pending and executed Material Transfer Agreements. More about this on [ezMTA](http://www.ezmta.com/).

## Special Features of the Application

* SaaS
* Multiple Accounts
* Multiple Users per Account
* Two roles of users, administrators and regular users
* File Attachments
* Notes that can be sent via e-mail
* Online payments with credit cards
* Billing takes place every 30 days since Account registration
* Each Account belongs to a Billing Cycle Day
* Automatic charge of Account credit card at the billing date
* Multiple price plans

## Technologies Used

* Linux distribution (Debian 6)
* Ruby on Rails
* MySQL
* SOLR
* Hosted on Amazon cloud

## Ruby on Rails Special Considerations

* [paperclip](https://github.com/thoughtbot/paperclip). Used to upload files for attachment.
* [remotipart](http://os.alfajango.com/remotipart/). Allows AJAX file-upload.
* [paper_trail](https://github.com/airblade/paper_trail). Tracks changes on data.
* [Twitter Bootstrap](http://twitter.github.com/bootstrap/). Front-end framework for faster and easier web development.
* [jQuery](http://jquery.com) and [jQuery UI](http://jqueryui.com)
* [simple_form](https://github.com/plataformatec/simple_form). Used to ease the form creation in Rails.
* [delayed_job](https://github.com/collectiveidea/delayed_job). Used to process asynchronously long running jobs, out of the http request processing cycle.
* [cancan](https://github.com/ryanb/cancan). Authorization framework.
* [bootstrap-wysihtml5-rails](https://github.com/Nerian/bootstrap-wysihtml5-rails). A WYSISWYG editor for Twitter Bootstrap
* [kaminari](https://github.com/amatsuda/kaminari). Used for pagination.
* Testing:
    * [RSpec](https://github.com/rspec). For Behaviour Driven Development.
    * [Factory Girl](https://github.com/thoughtbot/factory_girl). For factories of objects while testing, instead of using fixtures.
    * [Database Cleaner](https://github.com/bmabey/database_cleaner). For cleaning up database before every test.
    * [validator_attachment](). Used to check whether specific validators are attached to a model.
    * [simplecov](https://github.com/colszowka/simplecov). For test coverage report.
    * [capybara](https://github.com/jnicklas/capybara). For testing the UI.
    * selenium. For testing the UI when it contains javascript.
* [capistrano](https://github.com/capistrano/capistrano). Used for automatic deployments.
* [new relic](http://newrelic.com). Used for real-time process monitoring.

## Project Data

* About 2 man-months
* About 30 models
* About 20 tables
* About 20 controllers
* About 1300 tests
* About 1800 lines of code

