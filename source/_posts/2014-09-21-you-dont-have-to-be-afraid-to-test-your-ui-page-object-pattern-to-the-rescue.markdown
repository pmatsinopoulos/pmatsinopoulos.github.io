---
layout: post
title: "You don't have to be afraid to test your UI - Page Object Pattern to the rescue"
date: 2014-09-21 18:22
comments: true
categories: ["Ruby", "Ruby on Rails", "Test", "Patterns"]
---
## Introduction ##

Many software engineers do not write tests for their UI because they have a good reason not to. Firstly, they believe that UI changes frequently, so any test would have been vulnerable to frequent changes. Secondly, they do not know about the [Page Object Pattern](http://martinfowler.com/bliki/PageObject.html).

<!-- more -->

I have been introduced to Page Object Pattern by a QA Engineer, [Stylianos Papadomichelakis](http://gr.linkedin.com/in/stylianospapadomichelakis) while we were colleagues at [E-TRAVEL S.A.](https://www.linkedin.com/company/e-travel-sa). He has been using that for his QA tests, although in the Java world. I was astounded by this pattern. What a pain I got while trying to migrate a huge test suite from `capybara` 1 to `capybara` 2. If only I had page object pattern from the beginning, a 2 weeks task would have finished in 2 days. 

Martin Fowler [explains](http://martinfowler.com/bliki/PageObject.html), very clearly, as always, how useful this pattern is for testing UI, and how it can insulate your tests from the frequest UI changes. When using it, change effects on the UI of your application will not have to be propagated throughout your whole test suite, but only inside your page objects. 

And thank God, for our `Ruby` world, there is an awesome implementation of the page object pattern. The gem is called `site_prism` and you can read about it here: [Site Prism](https://github.com/natritmeyer/site_prism). It has very good documentation and will really help you love this gem.

In this article, I am going to share with you my experience using this gem. Using it for quite some time on all of my projects since I met it, I have come up with some best practices which I am sharing with you here.

Let's start

### Use a `page_objects` directory ###

Put your page object Ruby files inside a directory structure that would have as parent the `page_objects` directory. So, if for example you have a Rails application, the directory structure might be:

```
app
bin
config
db
features
lib
log
page_objects
public
script
spec
tmp
vendor
```

As you can see the `page_objects` is on the same directory level like the `features` which contains the `Cucumber` features and the `spec` which contains the `RSpec` test files. `Cucumber` and `RSpec` will both be using your `page_objects`.

### Use `<your-app-name>/page_objects` namespace ###

Although you are free to put all of your page object files inside the `page_objects` directory, prefer to use a sub-directory with the name of your application that would function as namespace. Further namespace that, with the word `page_objects`. For example, if your application is called `bookstore`, then you can use the following tree to store your page objects:

```
page_objects
  |-> bookstore
        |-> page_objects
```

Any `.rb` file that you will be creating to hold a page object class, will need to be inside the corresponding module `Bookstore::PageObjects` that will work as a namespace.
Using namespace is a good practice in general and not only for the `site_prism` case we are discussing here. You will avoid having name conflicts with third-party gems.

### Use a file to require them all ###

Write an `all_page_objects.rb` file that will require all the page objects Ruby files that would be living in your `page_objects` tree.

```
page_objects
  |-> bookstore
  |     |-> page_objects
  |- all_page_objects.rb
```

An implementation of `all_page_objects.rb` file might be something like the following:

```ruby
# file: page_objects/all_page_objects.rb
#
current_path = File.expand_path('..', __FILE__)
$LOAD_PATH.unshift File.join(current_path, 'bookstore')

Dir.glob(File.join(current_path, '**', '*.rb')).each do |f|
  require f
end
```

Having done that, you only have to require the `all_page_objects` file from your `spec_helper.rb` or `env.rb` file. And everytime a new page object file is defined, you do not have to require that explicitly.

### Different directory for pages and sections ###

Site prism offers two classes to organize your page object code. Pages and Sections. Use a separate directory to hold your page classes and a separate directory to hold your sections classes.

```
page_objects
  |-> bookstore
  |     |-> page_objects
  |           |-> pages
  |           |-> sections
  |- all_page_objects.rb
```

You will use each one of these two directories to further namespace your classes. Hence all your page object classes that are pages will be `Bookstore::PageObjects::Pages::` namespaced, and all your page object classes that are sections will be `Bookstore::PageObjects::Sections::` namespaced.

### Follow your views directory structure ###

Although you can put all your page classes inside the `page_objects/bookstore/page_objects/pages` directory, you should be further separating your pages directory into subdirectories that follow your views directory structure.

If for example you have a views directory that has two directories, `books` and `authors`, former one having the views that are related to `Book` resource and latter one having the views that are related to `Author` resource, you should have corresponding directories inside the `page_objects/pages` directory:

```
page_objects
  |-> bookstore
  |     |-> page_objects
  |           |-> pages
  |           |     |-> books
  |           |     |-> authors
  |           |-> sections
  |- all_page_objects.rb
```

Think about whether you can do the same for the `sections` too. If you have `sections` that are resource specific, you can follow a similar directory structure.

In any case, the page classes that you will define will need to be further namespaced.

### Follow your views templates ###

When defining your actual page classes follow the views templates and create one page per template view. For example, if you have a view template that indexes all the books in your bookstore, e.g. `index.html.erb` inside the `books` view directory, then create the corresponding page inside the file `index_page.rb`. Similarly for `new`, `show`, `edit` views:

```
page_objects
  |-> bookstore
  |     |-> page_objects
  |           |-> pages
  |           |     |-> books
  |           |     |---- index_page.rb
  |           |     |---- new_page.rb
  |           |     |---- show_page.rb
  |           |     |---- edit_page.rb
  |           |     |-> authors
  |           |     |---- index_page.rb
  |           |     |---- new_page.rb
  |           |     |---- show_page.rb
  |           |     |---- edit_page.rb
  |           |-> sections
  |- all_page_objects.rb
```

Hence, your page classes will be defined as follows (example for the `index_page.rb` for `books`):

```ruby
# file: page_objects/bookstore/page_objects/pages/books/index_page.rb
#
module Bookstore
  module PageObjects
    module Pages
      module Books
        class IndexPage < SitePrism::Page
          # ... your page code goes here ... #
        end
      end
    end
  end
end
```

### One file to model your application ###

Create a file `application.rb` that will be used to instantiate the concrete page classes and will be used to access all the pages while working with site prism API on `feautures` `steps` or `spec` tests.
```
page_objects
  |-> bookstore
  |     |-> page_objects
  |           |-> pages
  |           |     |-> books
  |           |     |---- index_page.rb
  |           |     |---- new_page.rb
  |           |     |---- show_page.rb
  |           |     |---- edit_page.rb
  |           |     |-> authors
  |           |     |---- index_page.rb
  |           |     |---- new_page.rb
  |           |     |---- show_page.rb
  |           |     |---- edit_page.rb
  |           |-> sections
  |           |- application.rb
  |- all_page_objects.rb
```

So, you are going to have `page_objects/bookstore/page_objects/application.rb`
Here is a sample implementation in order to understand what I am talking about:

```ruby
# file: page_objects/bookstore/page_objects/application.rb
#
module Bookstore
  module PageObjects
    class Application
      def initialize
        @pages = {}
      end

      def home
        @pages[:home] ||= Bookstore::PageObjects::Pages::HomePage.new
      end

      def sign_in
        @pages[:sign_in] ||= Bookstore::PageObjects::Pages::SignInPage.new
      end

      def checkout
        @pages[:checkout] ||= Bookstore::PageObjects::Pages::CheckoutPage.new
      end
    end
  end
end

```

When you will be using site prism, you will only be instantiating the `Bookstore::PageObjects::Application` class once and then you will be invoking page methods to access specific pages. For example:

If using `Cucumber`, inside the `features/support/hooks.rb` file you can have 

```ruby
Before do |scenario|
  @app ||= Bookstore::PageObjects::Application.new
end
```

which will instantiate the `Bookstore::PageObjects::Application` and store it in `@app` that you can use to load and access pages as follows (in your `steps`):

```ruby
When(/^User visits the home pages$/)do
  @app.home.load
end

When(/^User visits the sign in page$/) do
  @app.sign_in.load
end
```

You can see that the `Bookstore::PageObjects::Application` is being instantiated only once and each page is being instantiated only once too. The application instance is using, internally, a hash to store the instances of the necessary pages. So, everytime you need a page, either an existing instance of the page will be returned, if you have requested same page in the past, case in which it will be located in the `@pages` hash, or a new instance will be created.

### `elements` vs `sections` ###

Sometimes, especially when you are new to site prism, you cannot decide very easily when you should be using `elements` vs `sections`. 

If you understand the difference between an `element` and a `section` then it should be easy.

`element` is primitive dom selection that cannot contain other elements.

`section` should be used whenever you have a dom area that you want to select and that you want to treat its constituent elements separately, with further site prism API manipulation. In other words, `section` should be containing one or more `element` (and/or other `element`s, `elements`, `section`s or `sections`).

Finally, both `elements` and `sections` select structures of the dom that appear as arrays in the dom. `elements` select an array of `element`. `sections` select an array of `section`. 

Hence, if you have an index page that displays the list of books, you can have the following inside the index page definition:

```ruby
# file: page_objects/bookstore/page_objects/pages/books/index_page.rb
#
module Bookstore
  module PageObjects
    module Pages
      module Books
        class IndexPage < SitePrism::Page
          
          elements :book_items, '#books-table tr.book-item'
                    
        end
      end
    end
  end
end
```

which will give you access to each one of the table rows that are used to display a book entry. But this definition does not allow to do too much with the book item itself.

If for example, you want to access details of the book, you can use a section and say that you have an array of sections, as follows:


```ruby
# file: page_objects/bookstore/page_objects/pages/books/index_page.rb
#
require "bookstore/page_objects/sections/books/book_entry_section"

module Bookstore
  module PageObjects
    module Pages
      module Books
        class IndexPage < SitePrism::Page
          
          sections :book_items, Bookstore::PageObjects::Sections::Books::BookEntrySection, '#books-table tr.book-item'
                    
        end
      end
    end
  end
end
```

And then you need to define the book entry details in the corresponding section file:

```ruby
# file: page_objects/bookstore/page_objects/sections/books/book_entry_section.rb
#
module Bookstore
  module PageObjects
    module Sections
      module Books
        class BookEntrySection < SitePrism::Section
          element :title,        'td.title'
          element :author,       'td.author'
          element :published_at, 'td.published-at'
        end
      end
    end
  end
end
```

But, again....

### Prefer inline `section` (and `sections`) blocks ###

You should not be using separate class definitions for sections of pages that are not reusable among pages. It's waste of effort, time and requires more maintenance. Create a separate class, on a seperate file, for a section, only if this section can be reused among page definitions. Otherwise, define the section elements inline with a block.

Hence, the above implementation for the book item, is not something that I recommend. I wouldn't create a section for that. You should just define the section elements inline as follows:

```ruby
# file: page_objects/bookstore/page_objects/pages/books/index_page.rb
#
module Bookstore
  module PageObjects
    module Pages
      module Books
        class IndexPage < SitePrism::Page
          # .... other index page code .... #
          
          sections :book_items, '#books-table tr.book-item' do
            element :title,        'td.title'
            element :author,       'td.author'
            element :published_at, 'td.published-at'
          end                    
          
          # ... other index page code ... #
        end
      end
    end
  end
end
```

Doing so, I do not have to create another class file specific to this section.

Note that this hint is valid both for `section` and `sections`, of course.

### Use ids - Do not use style properties for selectors ###

This suggestion goes out of the scope of site prism. When you are using selectors to select dom elements on your tests use html element ids, e.g. '#books-table' as much as you can. Do not use other attributes that style your elements or depend on the layout and structure of your dom. They are brittle to change. And if you write your tests and you see that your pages are missing ids that would help you write your tests, then go back to your core code and add ids.

## Final ##

I believe that the page object pattern is a fantastic practice to isolate your tests from accessing UI test API (like `Capybara`) directly. And [site_prism](https://github.com/natritmeyer/site_prism) is a perfect implementation.

I hope that the above notes can help you organize your page objects code and become a practice in your development/QA team. Or at least start a discussion inside it about how you can better organize your page objects code.

I would appreciate any comment and feedback to make the above even better.
