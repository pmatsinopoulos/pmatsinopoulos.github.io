---
layout: post
title: "Including VS extending a Module"
date: 2012-10-12 21:44
comments: true
categories: ["Ruby"]
---

``` ruby Demonstration of `include` vs `extend`
# Here, I am define a "module" with name Ma. I also define two methods. One without "self."
# and one with. See, later on, what happens when I "include" and what happens when I "extend"
# the "module" within a "class".
#
module Ma
  # I will be able to make this method an instance or a class method of a class.
  # It depends whether I will "include" or "extend" the module in the class.
  # Note that this method, I cannot call it directly on Ma. In order for this method
  # to be useful, I have to include or extend this module within a class.
  #
  def ma_method1
    puts "ma_method1"
  end

  # This method, is not reusable, in the sense that I cannot make it be an instance or class
  # method of a class. But still, it is a method of module Ma and I can call it directly.
  #
  def self.ma_method2
    puts "ma_method2"
  end
end

puts "Ma responds to ma_method1? : #{Ma.respond_to?(:ma_method1)}" # it will print "false"
puts "Ma responds to ma_method2? : #{Ma.respond_to?(:ma_method2)}" # it will print "true"
puts "-------------"

class A
  # "include" sets the module methods as instance methods of the class
  include Ma
end

a = A.new
puts "a Responds to ma_method1?: #{a.respond_to?(:ma_method1)}" # it will print "true"
puts "A Responds to ma_method1?: #{A.respond_to?(:ma_method1)}" # it will print "false"
puts "a Responds to ma_method2?: #{a.respond_to?(:ma_method2)}" # it will print "false"
puts "A Responds to ma_method2?: #{A.respond_to?(:ma_method2)}" # it will print "false"
puts "-------------"

class B
  # "extend" sets the module methods as class methods of the class
  extend Ma
end

b = B.new
puts "b Responds to ma_method1? : #{b.respond_to?(:ma_method1)}" # it will print "false"
puts "B Responds to ma_method1? : #{B.respond_to?(:ma_method1)}" # it will print "true"
puts "b responds to ma_method2? : #{b.respond_to?(:ma_method2)}"  # it will print "false"
puts "B responds to ma_method2? : #{B.respond_to?(:ma_method2)}" # it will print "false"
puts "-------------------"
```

But you can also `include` or `extend` a `module` in another `module` too. Read this gist by
[pglombardo](https://gist.github.com/pglombardo) who has kindly appended to the above
piece of code.