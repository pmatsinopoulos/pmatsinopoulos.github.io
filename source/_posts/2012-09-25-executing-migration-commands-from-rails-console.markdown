---
layout: post
title: "Executing Migration Commands from Rails Console"
date: 2012-09-25 20:19
comments: true
categories: ["Ruby on Rails"]
---

Did you know that you can execute migration commands from rails console? Assume that you want to change the column 'name' of the 'Product' model, to have a limit of 32 characters and set it to not null. Here is what you can do:

``` ruby Example of ActiveRecord Migration run from Rails Console
$ rails c
> ActiveRecord::Migration.change_column :products, :name, :string, :limit => 32, :null => false
-- change_column(:products, :name, :string, {:limit=>32})
(38.1ms)  ALTER TABLE `products` CHANGE `name` `name` varchar(32) NOT NULL
-> 0.0396s
=> nil
```