---
layout: page
title: "villasbroker"
date: 2011-08-01 21:39
comments: true
sharing: true
footer: true
---

## Application Purpose

Villasbroker is an application that is used by a land / villas broker who whishes to sell properties. More about this on [Villasbroker](http://www.villasbroker.gr).

## Special Features of this Application

* Fully multilingual, both on data and labels
* Admin logs in to make changes to content
* CMS like features
* Multimedia support for villas sold

## Technologies Used

* Linux distribution (Debian 6)
* Hosted on a virtual private server
* Apache proxy to Thin servers
* Ruby on Rails
* MySQL

## Ruby on Rails Special Considerations

* Full internationalization
* [rmagick](http://github.com/rmagick/rmagick) and [carrierwave](https://github.com/jnicklas/carrierwave) for uploading and resizing images
* [acts_as_list](https://github.com/swanandp/acts_as_list): Sortable list of objects
* [sitemap_generator](https://github.com/kjvarga/sitemap_generator) to generate sitemap xml
* [kaminari](https://github.com/amatsuda/kaminari): Used for pagination
* [jQuery](http://jquery.com) and [jQuery UI](http://jqueryui.com)
* Testing:
    * Test Unit
    * Fixtures
    * [validator_attachment](http://rubygems.org/gems/validator_attachment). Used to check whether specific validators are attached to a model.
    * [cucumber](http://github.com/cucumber/cucumber/tree/master] for Acceptance Tests
* [new relic](http://newrelic.com). Used for real-time process monitoring.

## Project Data

* About 1.5 man-months
* About 20 models
* About 20 tables
* About 10 controllers
* About X tests
* About X lines of code