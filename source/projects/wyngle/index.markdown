---
layout: page
title: "wyngle"
date: 2016-02-12 15:23
comments: true
sharing: true
footer: true
---

## Application Purpose

This is a series of Ruby on Rails Applications, one for Wyngle consumers, one for Wyngle partners and one for Wyngle back office users. The idea is allow the 
customers to aggregate their purchases into one single database, application, which is [this](https://www.wyngle.com).

## Special Features of The Application

* Consumers Portal that allowed them to have access to all of their purchases irrespective of the shop that they bought from.
* Partners Portal that allowed the Wyngle Partners to approve purchases from Wyngle consumers.
* Consumers would use a <code>@wyngle.com</code> email account to carry out purchases on various e-shops.
* Wyngle would collect the order emails, process them and store the purchase into Wyngle database.
* Consumers have full access to their purchases as well as the messages exchanged between theme and the seller.
* Consumers can exchange messages with the seller from within Wyngle.
* Ability to log in with your Wyngle account on e-shops integrating with Wyngle Authentication.

## Technologies used

* Linux distribution (Debian 7)
* Riak, document database for the main storage
* MySQL for othe administrative storage
* Ruby on Rails
* Rabbit MQ for the asynchronous messaging
* Ruote as a workflow management system
 
## Ruby on Rails Special Considerations

* Full internationalization
* [haml](https://rubygems.org/gems/haml): For cleaner view templates.
* [state_machine](https://rubygems.org/gems/state_machine): For state transition modeling.
* [dalli](https://rubygems.org/gems/dalli): For memcached integration.
* [cells](https://rubygems.org/gems/cells): For better organizing the view code.
* [money-rails](https://rubygems.org/gems/money-rails): For Money class to wrap access to object representing money.
* [delayed_job](https://rubygems.org/gems/delayed_job): For background jobs   
* [doorkeeper](https://rubygems.org/gems/doorkeeper): To turn Wyngle to OAuth provider.
* Testing:
    * [factory_girl](https://rubygems.org/gems/factory_girl): For instantiation of test subjects.
    * [capybara](https://rubygems.org/gems/capybara): For testing the UI.
    * [selenium-webdriver](https://rubygems.org/gems/selenium-webdriver): For testing the UI with a browser.
    * [rspec](https://rubygems.org/gems/rspec): For test unit.
    * [site_prism](https://rubygems.org/gems/site_prism): As a Page Object Pattern implementation.

## Project Data
            
* About 1.5 years
* About 40 models
* About 30 tables
* About 55 controllers
* About 5000 tests
* About 20K lines of code            

