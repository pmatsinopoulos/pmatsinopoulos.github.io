---
layout: post
title: "How to define and use class-level variables while mixing in Modules"
date: 2012-10-09 19:47
comments: true
categories: 
---

There are sometimes that you might want to use class-level variables in a reusable `module`. How will you do that? Here is a sample ruby program that does that:

``` ruby Example of Modules and class-level variables
require 'set'

module Cacheable
  def self.included(base)
    base.send :extend, ClassMethods
  end

  module ClassMethods
    def cached_keys
      @cached_keys ||= Set.new
    end

    def add_cached_key(key_sym)
      @cached_keys ||= Set.new
      @cached_keys.add(key_sym)
    end
  end
end

class A
  include Cacheable
end

class B
  include Cacheable
end

puts "A cached keys: #{A.cached_keys.inspect}"
puts "B cached keys: #{B.cached_keys.inspect}"

A.add_cached_key(:a)
puts "A cached keys: #{A.cached_keys.inspect}"
puts "B cached keys: #{B.cached_keys.inspect}"

B.add_cached_key(:b)
puts "A cached keys: #{A.cached_keys.inspect}"
puts "B cached keys: #{B.cached_keys.inspect}"

A.add_cached_key(:aa)
puts "A cached keys: #{A.cached_keys.inspect}"
puts "B cached keys: #{B.cached_keys.inspect}"

B.add_cached_key(:bb)
puts "A cached keys: #{A.cached_keys.inspect}"
puts "B cached keys: #{B.cached_keys.inspect}"
```
If you run the above ruby script, you will get the following output:

``` ruby Output of running the above ruby script
A cached keys: #<Set: {}>
B cached keys: #<Set: {}>
A cached keys: #<Set: {:a}>
B cached keys: #<Set: {}>
A cached keys: #<Set: {:a}>
B cached keys: #<Set: {:b}>
A cached keys: #<Set: {:aa, :a}>
B cached keys: #<Set: {:b}>
A cached keys: #<Set: {:aa, :a}>
B cached keys: #<Set: {:bb, :b}>
```

In the above example, we keep a class level `Set` of symbols (`@cached_keys`). We want every `class` that mixes in `Cacheable` to have its own instance of that `Set`.

