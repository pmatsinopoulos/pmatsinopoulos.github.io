---
layout: post
title: "Ruby Array Sum"
date: 2015-07-19 11:12
comments: true
categories: ["Ruby"] 
---
This short post is going to demonstrate how we can sum an array of integers or an array of objects that have an
integer attribute.

Let's start:

<!-- more -->

## Sum array of integers ##

### First version using reduce with block ###
```ruby
array_of_i = [10, 2, 8, 5, 7, 9]

sum = array_of_i.reduce(0) { |result, item| result + item }

puts "Sum of #{array_of_i.join(",")} is: #{sum}"
```

### Second version using reduce giving the method symbol to apply ###
```ruby
array_of_i = [10, 2, 8, 5, 7, 9]

sum = array_of_i.reduce(:+)

puts "Sum of #{array_of_i.join(",")} is: #{sum}"
```

## Sum of objects that have an integer attribute ##

### Using reduce with a block ###
```ruby
class Product
  attr_accessor :price
  
  def initialize(price)
    self.price = price
  end  
end

prod1 = Product.new(1000)
prod2 = Product.new(500)
prod3 = Product.new(1500)

array_of_products = [prod1, prod2, prod3]

sum = array_of_products.reduce(0) {|result, item| result + item.price}

puts "Sum of array_of_products is: #{sum}"
```
I am pretty sure that you can come up with other methods of doing the above. Can you post in the comments any alternatives? 
Advantages and disadvantages?


