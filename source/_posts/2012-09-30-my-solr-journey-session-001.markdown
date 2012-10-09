---
layout: post
title: "My Solr Journey - Session 001"
date: 2012-09-30 14:27
comments: true
categories: Solr
---

## Why do I take this Journey?

I have been using Solr the last two years for quite some projects. My work was always done using [sunspot](http://sunspot.github.com/)
(via `sunspot_rails` when one has Rails application), a gem that is a client library for Solr.

You need to know few things about Solr, when using `sunspot` to access it and do most of the things. `sunspot` is a fantastic gem and relieves you from
huge amounts of work when storing data in a Solr database.

However, there are times that I felt that I needed to know more. For example, when I was searching for `University of Athens` and I got no results, but I knew
that my documents had all or any of the words "University", "of", "Athens" in their body, or, even worse, there were also documents that were having the whole
phrase "University of Athens" in their body. Or I wanted to query with parts of words, or parts of e-mails, and still I was not getting any results. You can see how
I ended up solving these problems reading these two: 1) [Why Sunspot Solr does not bring results when I include “of” word in search query?](http://stackoverflow.com/questions/12650859/why-sunspot-solr-does-not-bring-results-when-i-include-of-word-in-search-query/12653931)
 2) [How can I set Sunspot to search for sequences of characters instead of words?](http://stackoverflow.com/questions/12131473/how-can-i-set-sunspot-to-search-for-sequences-of-characters-instead-of-words)

Hence, I decided to take a journey to Solr. And this will be a registration of my steps to this journey. Understanding how Solr works, will make me manage
better what I can do and achieve with `sunspot` too.

And here we go

## First steps

* I downloaded solr from [here](http://lucene.apache.org/solr/)
* Followed the [tutorial](http://lucene.apache.org/solr/api-3_6_1/doc-files/tutorial.html)

### Summary

One cannot be but extremely impressed of the features and capabilities of Solr. I believe that I will use to replace many of my MySQL stores that are only
used for querying.

(Next steps will soon follow)
