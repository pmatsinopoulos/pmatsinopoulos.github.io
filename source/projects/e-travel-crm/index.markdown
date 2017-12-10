---
layout: page
title: "E-TRAVEL S.A. Customer Relationship Management Application"
date: 2016-01-22 08:20
comments: true
sharing: true
footer: true
---

## Live Demo

Don't have a live demo link here, because it is an internal application.

## Application Purpose

Customer Relationship Management system for one of the biggest Online Travel Agencies in Europe, selling their services all around the world actually.
The used to sell, and still do, tickets for flights, mainly, but also other travel-related services.

Features included:

1. Integration with the front-end application that was used to sell the tickets.
2. All operations employees (180 at the moment) use this application to manage customer requests.
3. A workflow management system drives the agents carry out the correct actions to fulfill a request.

## Challenges

The biggest challenges for me on this project, things that I really enjoyed and learned new stuff:

* Started a project on blank paper in a business domain I was not familiar with. The flight tickets business, although might not sound like, 
it is quite complex, especially when things do not go as expected. When flight changes or cancellations take place, for example.
So, the business complexity was big challenge for me.
* Migration from the old CRM to the new one and 0-downtime on business interruption.
* Integration with GDS (Global Distribution System) Amadeus + Sabre. Very difficult task to accept and process their file based interfaces.
* Automation of communication with the customers. Timely-sensitive information had to be sent to customers on various points of their request processing.
* Build API to support integration of CRM with other internal applications.

## Technologies Used

* Deployed on Amazon Web Services
* MySQL database
* Ruby on Rails
* Javascript & jQuery
* Twitter Bootstrap 2.0
* Solr

## Ruby on Rails Special Considerations

* Ruby 1.9
* Rails 3.2
* SASS
* [paper_trail](https://github.com/airblade/paper_trail): To keep versions of our data
* [ancestry](https://github.com/stefankroes/ancestry): To organize records as a tree structure
* [dalli](https://github.com/petergoldstein/dalli): To use Memcache
* [cancan](https://github.com/ryanb/cancan): For authorization
* [sunspot_rails](https://github.com/sunspot/sunspot): To integrate with Solr
* [delayed_job](https://github.com/collectiveidea/delayed_job): For processing tasks in the background
* [rest-client](https://github.com/rest-client/rest-client): For consuming Web services
* [ar-octopus](https://github.com/thiagopradi/octopus): For using more than one database at the same time, replication
* [aws-sdk](https://aws.amazon.com/sdk-for-ruby/): For integrating with Amazon Web Services    
* [paperclip](https://github.com/thoughtbot/paperclip): For file uploads
* [rabl](https://github.com/nesquena/rabl): To easily build JSON APIs

For testing:

* RSpec
* Factory Girl
* VCR
* Cucumber
* Capybara
