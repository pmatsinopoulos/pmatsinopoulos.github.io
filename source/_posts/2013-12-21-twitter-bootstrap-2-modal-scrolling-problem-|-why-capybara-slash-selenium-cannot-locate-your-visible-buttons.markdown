---
layout: post
title: "Twitter Bootstrap 2 Modal Scrolling Problem | Why capybara/selenium cannot locate your visible buttons"
date: 2013-12-21 09:19
comments: true
categories: ["Twitter Bootstrap", "capybara", "selenium", "testing", "Ruby on Rails"]
---
Twitter Bootstrap 2 has a bug while on modal dialogs. The page does not scroll as expected. So, if the browser window is not wide/tall enough to display the whole
modal dialog content, the scroll bars do not make it appear.

The bug is described here:

- http://stackoverflow.com/q/7508576/658469

And the answer is given a little bit below that:

- http://stackoverflow.com/a/7787883/658469

This problem does not occur with jQuery modals neither with Twitter Bootstrap 3.

I am using Ruby on Rails and the `less-rails-bootstrap` gem.

In order to fix the problem for my current application, and instead of moving to Twitter Bootstrap 3 or to jQuery, I have decided to fix the problem in the gem

Here is the fix:

    gem 'less-rails-bootstrap', :git => 'https://github.com/pmatsinopoulos/less-rails-bootstrap.git', :branch => 'bug-fix-modal-scrolling'

**Important Note** This bug influences your capybara/selenium tests, because elements that are normally visible, while the browser is maximized, they cannot be located by
selenium and they are reported as non-visible and cannot be interacted with, if the window browser is not open enough to display the whole modal dialog.




