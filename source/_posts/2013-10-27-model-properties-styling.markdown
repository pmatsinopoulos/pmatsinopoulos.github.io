---
layout: post
title: "Model Properties - Styling"
date: 2013-10-27 21:09
comments: true
categories: ["Ruby on Rails"]
---
I usually come across people asking what is the preferred way of laying out the properties of a model and, in fact, of an ActiveRecord model.
Shall we put first the validations and then the associations? Or first the associations and then the validations? Or shall we put first the
callbacks?

One can google for `rails style guide`. Will basically find only this:

- https://github.com/bbatsov/rails-style-guide#models

 which is a good resource. But is not complete.

## My Rails Model Style Guidelines ##

_we are talking here about Rails 3_

Here is the list of my styling guidelines and which I use whenever I am writing a Model.

<!-- more -->

### This is the sequence of declarations: ###

1. `attr_accessor`, and `attr_reader`, `attr_writer` for virtual attributes that are not derived from database
2. `nilify_blanks`. I am using the [nilify_blanks](https://github.com/rubiety/nilify_blanks) gem and here is where I put the corresponding directive
3. `attr_accessible`, in order to declare the mass assignable attributes
4. associations
    1. all `belongs_to`,
    2. all `has_one`,
    3. all `has_many` (there is a gotcha here, read Note 1 below)
5. before validation callbacks
6. validations
7. after validation callbacks
8. delegates
9. scopes
10. callbacks
    1. First the before,
    2. then the after,
    3. then the around
  <br/>
  and according to the sequence that they take place. Read [Rails Guides ActiveRecord Callbacks](http://guides.rubyonrails.org/active_record_callbacks.html#available-callbacks) (there is a gotcha here, see Note 1 below)
  and EXCEPT the (before|after)_validation callbacks, since I put them earlier in the list
  <br/>
11. public methods
    1. class methods
    2. instance methods
12. protected methods
    1. class methods
    2. instance methods
13. private methods
    1. class methods
    2. instance methods

Note 1: the [`has_many` | `has_one` | `belongs_to`] associations allow you to define `:dependent => :destroy` (though I do not use it on belongs_to....is not correct design ... IMHO). This creates a `before_destroy` callback.
The `before_destroy` callbacks are executed in the sequence that they are defined. So, If you want a `before_destroy` callback to take place before a `before_destroy` callback of a `has_one` | `has_many` that destroys
the dependent objects, you will have to put the `before_destroy` callback before the corresponding `has_one` | `has_many`.

### This is a list of some extra guidelines: ###

- Whenever I have `attr_accessor` (or `attr_reader`, or `attr_writer` or `attr_accessible`) I put the list of corresponding attributes in alphabetical order. So, in long lists it becomes easier for me to locate a specific attribute.

- I tend to leave a blank line between two different groups of declarations. For example, when the validations block ends, I leave a blank line before I start the after validation callbacks.

---
I would be glad to hear about yours in order to improve mine too. (Comments are welcome on Google+)
