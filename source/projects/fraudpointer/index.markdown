---
layout: page
title: "fraudpointer"
date: 2011-07-01 14:27
comments: true
sharing: true
footer: true
---

## Application Purpose

Fraudpointer is a service and an application that can help online shops protect from fraudsters. More about this on [Fraudpointer](http://www.fraudpointer.com).

## Special Features of the Application

* SaaS
* Multiple Accounts
* Multiple Users per Account
* Multiple Roles per User
* User configurable Rules to identify fraud cases
* Fraud Case Management
* Cases are Queued to Accept/Reject/Review and to various Profiles
* Dynamic Black lists/White Lists and any other kind of Lists - user configurable
* Real-time graphs of Fraud Case Management
* Any data can be fed into Fraudpointer database and be used for fraud evaluation
* Attributes of various types are supported (String, Numbers, Boolean, Dates, Countries, Emails)
* Calculated attributes
* Velocity Attributes
* Reputation Database
* Similarity Matching of Cases
* Google Apps Integration (docs, email, contacts)
* Matlab Integration

## Technologies Used

* Linux distribution (Debian 6)
* Amazon RDS - MySQL
* Ruby on Rails
* SOLR
* Hosted on Amazon Cloud
* Matlab
* Solr

## Ruby on Rails Special Considerations

* Full internationalization
* [acts_as_list](https://github.com/swanandp/acts_as_list): Sortable list of objects
* [kaminari](https://github.com/amatsuda/kaminari): Used for pagination
* [redis](http://redis.io/): Used for background asynchronously long running tasks, processed out of the web request cycle
* [memcached](http://memcached.org/): Used for memory caching.
* [state_machine](https://github.com/pluginaweek/state_machine): Used to implement a state machine
* [jQuery](http://jquery.com) and [jQuery UI](http://jqueryui.com)
* [client_side_validations](https://github.com/bcardarella/client_side_validations): Used to transfer server-side validations on javascript client tier
* Online payments. Integration with payment gateway using [activemerchant](https://github.com/Shopify/active_merchant).
* Google Apps Market Integration. With the help of various gems:
    * [oauth](http://rubygems.org/gems/oauth)
    * [rack-openid](http://github.com/josh/rack-openid)
    * [ruby-openid-apps-discovery](http://rubygems.org/gems/ruby-openid-apps-discovery)
    * [two-legged-oauth](http://rubygems.org/gems/two-legged-oauth)
* [wicked-pdf](https://github.com/mileszs/wicked_pdf): PDf Generation
* [paper_trail](https://github.com/airblade/paper_trail). Tracks changes on data.
* [ar-octopus](https://github.com/thiagopradi/octopus): MySQL Master/Slave Replication
* Testing:
    * Test Unit
    * Fixtures
    * [validator_attachment](http://rubygems.org/gems/validator_attachment). Used to check whether specific validators are attached to a model.
    * [capybara](https://github.com/jnicklas/capybara). For testing the UI.]
    * [cucumber](http://github.com/cucumber/cucumber/tree/master] for Acceptance Tests
    * selenium. For testing the UI when it contains javascript.
* [new relic](http://newrelic.com). Used for real-time process monitoring.
* [sunspot_rails](https://github.com/sunspot/sunspot). Integration with Solr

## Project Data

* About 10 months
* About 65 models
* About 60 tables
* About 40 controllers
* About 2900 tests
* About 6200 lines of code


