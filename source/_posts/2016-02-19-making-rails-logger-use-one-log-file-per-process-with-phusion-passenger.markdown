---
layout: post
title: "Making Rails Logger Use One Log File Per Process with Phusion Passenger"
date: 2016-02-19 16:57
comments: true
categories: ["Ruby on Rails", "Phusion Passenger"]
---

## Introduction

Today, I had to find a way to make my production Rails application log into different log files per process. I have 
the application deployed using [Phusion Passenger](https://www.phusionpassenger.com/) as an Apache 2 module. The reason
I decided to do that was the fact that I wanted to analyze the logs with [Request Log Analyzer](https://github.com/wvanbergen/request-log-analyzer) tool.
This tool requires the log files to be separate so that they do not interleave the log entries of different requests.

<!-- more -->

## Blog Sponsor

This post is sponsored by [Fraudpointer](http://www.fraudpointer.com/).

## References 

In order to solve that I was helped by what I found about the similar problem solved for Unicorn processes here:

[A blog about how one can have different log file per Unicorn worker](http://jordan.broughs.net/archives/2014/09/provide-separate-rails-log-files-for-each-unicorn-worker)

Then, I had to google about how I could hook to after fork events on Phusion Passenger. There was a very good [question here](http://stackoverflow.com/q/24180809/658469) 
and its [answer here](http://stackoverflow.com/a/24188716/658469). The answer directed me also on Phusion Passenger documentation for
[hooking on spawning events](https://www.phusionpassenger.com/library/indepth/ruby/spawn_methods/#smart-spawning-hooks).

## Implementation

I have created an initializer with the following content:

``` ruby
begin
  if Rails.env.production? && defined?(PhusionPassenger)
    PhusionPassenger.on_event(:starting_worker_process) do |forked|
      # get access to log device
      if Rails::VERSION::STRING.start_with?('4.')
        logdev = Rails.logger.instance_variable_get(:@logdev)
      elsif Rails::VERSION::STRING.start_with?('3.2')
        logdev = Rails.logger.instance_variable_get(:@logger).instance_variable_get(:@log).instance_variable_get(:@logdev)
      end
      
      # logdev.dev is a File instance that is the open file to log file.
      # Get the extension and prepend the process id.
      ext = File.extname(logdev.dev.path)
      pid = Process.pid
      path = logdev.dev.path.gsub /#{Regexp.escape(ext)}$/, ".#{pid}#{ext}"
      
      # open the new file
      file = File.open(path, 'a')
      file.binmode
      file.sync = true
      
      # We flush and close the current file handle, the one that writes to the single file.
      logdev.dev.flush
      logdev.dev.close
      
      # We replace the file handle with the new one +file+ that refers to process specific file.
      logdev.instance_variable_set(:@dev, file)
    end
  end
rescue Exception => ex
  begin
    Rails.logger.error(ex.message)
    Rails.logger.error(ex.backtrace)
  rescue
  end
end
```

## Closing

This has been implemented for a Rails 3.2 and a Rails 4.2 application.

Any feedback from you would be much appreciated.





