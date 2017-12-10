---
layout: page
title: "Book & Table"
date: 2016-01-22 08:20
comments: true
sharing: true
footer: true
---

## Live Demo

You can see a live demo of the application [here](https://www.bookandtable.com). You can sign up as student in order to have access to the internals of the app.

## Application Purpose

It's a marketplace for students/parents/learners to find tutors on various subject areas. Besides the matching, the application offers various features to their
users:

1. Ability to Invite Friends, via email and via Google contacts.
2. Students rate their experience with the tutor.
3. Text/SMS notifications for various important events.
4. Full integrated messaging functionality.
5. Follow up and history on all lessons with the tutors.
6. Payments via Stripe payment gateway.
7. Tutors are being paid out to their Bank Account (using Stripe API).
8. Tutors form teams and they can refer a student to another tutor and earn money.
9. Point system that allocates points to tutors and affects the ranking of tutors on search results.

## Challenges

The biggest challenges for me on this project, things that I really enjoyed and learned new stuff:

* Inherited a project code base that didn't have a single test. So, I had to quickly write tests for the core features, at that time, of the app. 
* Full front-end development. That was my first project that I did full front-end development. I can finally call myself full-stack engineer. I am very proud of the
result, although, the enemy of good is the better one, which means that I could always have done it better. The final result is fully responsive on mobile devices.
* Mobile API with authentication. That I enjoyed it very much. My first API to support the mobile iPhone application. It had to support authentication both
with email / password and with social networks like Facebook and Google.
* Apple Push Notifications. Had to integrate with Apple Push Notification Service.
* Stripe Managed Accounts. I have worked a lot with the Stripe API to create managed accounts. Since the app was not just to charge the users. Had to do it on behalf of the tutors.
* Stripe Bank Accounts. I had to implement the bank account pay out integration with Stripe.
* Integration with Twilio for SMS/TEXT notifications. Both application-outgoing and application-incoming flows.
* Background Check and integration with [Checkr](https://checkr.com/). Had to follow the exact requirements about how pages would be designed and implement callbacks to get check results. 
* Swagger. The tool to create documentation for  APIs. This is the page that has the documentation of the API that I have designed: [Book&Table Mobile API Documentation](https://www.bookandtable.com/api/mobile/index.html).
* Client-side page walk throughs and interactive help. I have used two tools for this. [Hopscotch](https://github.com/linkedin/hopscotch) and [Sideshow](http://fortesinformatica.github.io/Sideshow/#.VqHvXVN97fA).

## Technologies Used

* Deployed on Heroku
* PostgreSQL database
* Ruby on Rails
* Javascript & jQuery
* Twitter Bootstrap 3.0 - The app is fully responsive

## Ruby on Rails Special Considerations

* Ruby 2.2.3
* Rails 4.2
* SASS
* [jbuilder](https://github.com/rails/jbuilder): For JSON API
* [rolify](https://github.com/RolifyCommunity/rolify): For role-based authorization
* [devise](https://github.com/plataformatec/devise): For authentication
* [simple_form](https://github.com/plataformatec/simple_form): For quick form styling
* [carrierwave](https://github.com/carrierwaveuploader/carrierwave): For uploading of files and images
* [haml](http://haml.info/): To write cleaner view code
* [stripe](https://stripe.com/): To integrate with Stripe gateway
* [griddler](https://github.com/thoughtbot/griddler): To parse incoming SendGrid emails
* [omniauth](https://github.com/intridea/omniauth): To integrate OAuth2 authentication
* [cancancan](https://github.com/CanCanCommunity/cancancan): For REST authorization
* [delayed_job](https://github.com/CanCanCommunity/cancancan): For background tasks
* [state_machine](https://github.com/pluginaweek/state_machine): For state models
* [draper](https://github.com/drapergem/draper): For the decorator pattern
* [money-rails](https://github.com/RubyMoney/money-rails): For modeling amounts / Money
* [acts_as_list](https://github.com/swanandp/acts_as_list): To keep objects in a list
* [tinymce](https://www.tinymce.com/): For rich text editors
* [twilio-ruby](https://github.com/twilio/twilio-ruby): For integrating with Twilio API
* [friendly_id](https://github.com/norman/friendly_id): For slug functionality on URLs
* [google_url_shortener](https://github.com/joshnesbitt/google_url_shortener): For integrating with Google URL Shortener service
* [google_contacts_api](https://github.com/aliang/google_contacts_api): For integrating with Google Contacts
* [checkr-official](https://github.com/checkr/checkr-ruby): For integrating with CheckR background checker.
* [api-auth](https://github.com/mgomes/api_auth): For building an API and applying authentication to it.
* [houston](https://github.com/nomad/houston): For Apple Push Notifications
* [aws-sdk-resources](https://rubygems.org/gems/aws-sdk-resources/versions/2.2.9): For integrating AWS services

For testing I have used:

* RSpec
* Capybara
* Cucumber
* SitePrism
* FactoryGirl
* VCR
* and other gems

## Project Data

* About 18 months
* About 250 models
* About 100 tables
* About 100 controllers
* About 460 cucumber scenarios
* About 1100 rspec unit tests
* About 130K lines of code
