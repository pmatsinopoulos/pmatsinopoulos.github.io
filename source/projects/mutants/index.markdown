---
layout: page
title: "mutants"
date: 2014-05-04 17:18
comments: true
sharing: true
footer: true
---

## Live Demo

You can see a live demo of the application [here](http://shielded-mesa-1223.herokuapp.com/).

## Application Purpose

Application is used to demonstrate some techniques while doing Rails 4 development. It is about a user creating some basic instances of Tasks and then assigning
them to Mutants, actually, to Groups of Mutants.

## Special Features of the Application

There is nothing really important with regards to features for this application. One can read the `features` files
to understand what the functionality is about.

## Technologies Used

* Linux distribution (Ubuntu Server 12.04LTS)
* MySQL for development/test. PostgreSQL on production. It is deployed on Heroku.
* Ruby on Rails 4.1.0
* Deployed on Heroku

## Special Considerations

* `Cucumber`. Has been used to describe the requirements of this application. 
* `RSpec`. Has been used to describe the specification of the interfaces (unit tests).
* `foreigner`. This gem has been used to define foreign keys.
* `HAML`. Has been used as the view template language.
* `Twitter Bootstrap`. Has been used as a CSS framework.
* `SASS`. Has been used as the CSS preprocessor.
* `simple_form`. Has been used to simplify the forms.
* `site_prism`. Has been used to implement the [Page Object Pattern](http://martinfowler.com/bliki/PageObject.html). The page objects of the application can be found in their own directory: `page_objects`
* `factory_girl`. Has been used to create instances with ease.
* `selenium-webdriver`. Has been used in a couple of tests when javascript was necessary.
* A full-page background image decorates the application. Nice technique to implement this has been found on [css-tricks](https://www.google.gr/url?sa=t&rct=j&q=&esrc=s&source=web&cd=1&cad=rja&uact=8&ved=0CCgQFjAA&url=http%3A%2F%2Fcss-tricks.com%2Fperfect-full-page-background-image%2F&ei=RSpmU4zWAomN7Qae8IGADg&usg=AFQjCNEhgsFuP7_T7nQ8VxEGzEt0rkktCw&bvm=bv.65788261,d.ZGU).

## Project Data

* About 3 days
* 3 models
* 3 tables
* 3 controllers
* 32 RSpec examples
* 24 Scenarios with 138 Steps