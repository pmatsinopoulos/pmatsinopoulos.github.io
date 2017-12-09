---
layout: post
title: "Class vs Instance Variables"
date: 2015-06-19 08:54
comments: true
categories: ["Ruby"]
---

``` ruby demo of Class vs Instance variables
# Here, I am defining a class Dog with an class variable "@@number_of_feet"
# and an instance variable "@color", assuming that all dogs in the world
# have the same number of feet but they might differ in color. Or, at least,
# this is the general rule.
#
class Dog
  @@number_of_feet = 4

  def initialize(color)
    @color = color
  end

  def number_of_feet=(value)
    @@number_of_feet = value
  end

  def tell_me_about_you
    puts "My color is #{@color} and I have #{@@number_of_feet} feet"
  end
end
 
# The next two statements will set the "@color" instance variable to different values
# for max and rocky. But both dogs will have the same number of feet, which will be 4,
# since when class is initialized the "@@number_of_feet" instance variable takes the value 4.

max = Dog.new('black')
rocky = Dog.new('brown')

max.tell_me_about_you    # will print black and 4
rocky.tell_me_about_you  # will print brown and 4

# Now, I am changing the value of the class variable "@@number_of_feet" and I am setting that
# to "3". You will see that now all dogs change to have 3 feet.
max.number_of_feet = 3

max.tell_me_about_you    # will print black and 3
rocky.tell_me_about_you  # will print brown and 3
```
