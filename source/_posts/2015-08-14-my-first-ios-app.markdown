---
layout: post
title: "My First iOS App"
date: 2015-08-14 07:40
comments: true
categories: ["iOS", "Objective-C"]
---

This is my first encounter with iOS apps and Objective C. I followed the whole tutorial which is given [here](https://developer.apple.com/library/ios/referencelibrary/GettingStarted/RoadMapiOS/index.html#//apple_ref/doc/uid/TP40011343-CH2-SW1).
I am a Ruby developer and I decided to take this trip to iOS development because it is necessary for my work. I am offering professional services to [Book&Table](https://www.bookandtable.com), which
is sponsoring me writing this blog post.

Following this tutorial, I had to keep some notes. Here are the most important ones. Maybe you will find them useful too. But most importantly, I am seeking feedback from experienced
iOS developers.

<!-- more -->

You can find the source code of the small application [here](https://github.com/pmatsinopoulos/todo-obj-c)

## Setup your Dev Env ##

The tutorial explains very well how to setup your development environment. And your development environment comes for free with XCode and iOS SDK.
There are tools that contain everything and the UI is rich, with integrated debugger and tools to do graphical programming and design of your
app. 

## I do not know Objective-C ##

Although I have built lots of programs in C, I have never built one in Objective-C. So, the tutorial does an introduction to this language.
 
### Calling a method on a object ###

```
[someObjectInstance someMethodName]
```

## Application Templates ###

XCode offers you the ability to start a project using an application template. The tutorial works with the `Single View Application` template.
I suppose that when I will get more familiar with XCode and Objective-C I will be able to use other templates too.

## Run Simulator ##

This is fantastic. You can run a simulator from within XCode and see how your application would look like in various devices. Tutorial explains how to do that.

## main.m ##

Cool. Like in C, there is a file that contains the `main` function. The Objective-C files that contain the implementation (rather than the interface) have
an extension that ends with `.m` (rather than with `.c` or `.cpp`). 

## Application & AppDelegate ##

There are two objects that work together in order for the app to work. The application object and the app delegate object. The application object calls
specific methods on app delegate object and allows app delegate object to customize the app behaviour.

The app delegate object is defined in `AppDelegate.h` and implemented in `AppDelegate.m` file.

Reading the method names and the comments of the `AppDelegate.m` file, I understand that an application follows a life cycle through the following states:

* launch -> active
* active -> inactive     Goes to inactive, when for example an incoming call is intercepted.
* inactive -> background When the user quits, the application might go to background state instead of being terminated.
* background -> inactive When the application goes back from background to inactive
* inactive -> active
* terminated When the application terminates

## Storyboard ##

There is a tool that helps you design the flow of your application. This is the storyboard. Your application is going to be
comprised of various stories each one linked to another. This will be the application flow.

## The Canvas and Adaptive Interface ##

The canvas that is used to design your stories does not have the size of a specific iOS device. It is generic. You are responsible
to make your application being adaptive. And the tutorial does an introduction on the adaptive app design. It teaches you how to use
the Auto Layout feature that helps you position your elements in such a way that they will be looking good on all iOS devices.

## Object Library ##

While you are doing the UI design of your app, you can use the Object Library that contains a big list of visual, and other items, 
ready for you to use in order to build your app interface.

## Model View Controller ##

The application design uses the MVC (Model View Controller) architecture. 

## Views ##

All the visual elements that you put on an application "page" are called `views`. So, for example, an input text field is a view.
However, the views can contain other views and you can have a view hierarchy.
 
At the top of the view hierarchy is the `window` object (look at file `AppDelegate.h`). 

The `UIKit` framework provides many different views ready for you to use in order to let your users interact with your application.
All the views are classes of `UIView` class. You can customize and create your own views by subclassing this class. 

## Storyboards ##

You use storyboards to design the interface of your app. The `Main.storyboard` is the one that is automatically created for you by
XCode project wizard, when you chose the simple view application template.

## Scenes ##

Each storyboard is composed of scenes. Can I think about scenes like I think about web pages when I build a Web application? I guess
so. The scene has its own view hierarchy. Like a page has a list/tree of HTML tags that are used to render the page.

## Inspector Pane ##

This is used to configure the views. So, you select a view and then you use Inspector Pane on the right to configure the properties
of the view.

## View Controllers ##

These implement the application behaviour. Events go from views to view controllers which then inform data model layer and then
the other way around. View controllers can be thought of as Controllers in Ruby on Rails. The view controller is an instance of `UIViewController` class.
 
A view controller manages a single view hierarchy. And usually, you create a custom `UIViewController` class in order to manage it.

## Navigation Controller ##

This is a specialized view controller that is used to navigate from one view hierarchy to another. In other words from one page to
another. You can think about the navigation controller like a top navigation bar that you may have put into a layout file in your Rails application.
The set of view controller managed by a particular navigation controller is called the navigation stack.

Note that navigation controller, besides managing the transition from one view controller to another, it is responsible for presenting custom
views that belong to its own hierarchy. 

Embed your first view controller into a navigation controller, by selecting the view controller and then selecting "Editor > Embed In > Navigation Controller".
This will create a new navigation controller that has as root view controller the one embedded.

## Segue ##

The segue is a transition from one view controller to another. There are actually various types of segues that can be used to 
link one view controller to another. 

* Show
* Show detail
* Present modally
* Popover presentation
* Custom
* Unwind

Because a *segue* is an object that holds the transition from one view controller to another, it is aware of both the source view controller
and the destination view controller.

## The Storyboard Entry Point ##

This is an arrow in your storyboard editor that tells which scene is the one that should be presented first when the app starts.

## Modal View Controller ##

The modal view controller is created when the segue that takes you to the view controller is of modal mode. The modal view controller
does not get a navigation bar because it is not added to the navigation stack. In that case, you may want to embed the modal view controller
it its own navigation controller.

## Customized View Controllers ##

You need to create files (`*.h` and `*.m`) that define a class that derives from standard view controller classes. Then you need to use the 
inspector editor to define that your scene is using the particular customized view controller.

## Exit From Scene ##

You can exit from a scene as follows. You ctrl click on the navigation bar item that you want to be used for exit and your drag and drop it
on the "Exit" icon on top of the scene design area. Then you specify which method to call. You should have defined the method to call before
doing this. That method is an `IBAction` and when you do the drag and drop a list with the `IBActions` are presented for you to select.

## Foundation Framework ##

This is one of the most basic and most important frameworks that Objective-C offers. 
Includes:

1. value classes &
2. collection classes

Examples of value objects: 

* NSString
* NSNumber

## NSString ##

This is an object wrapper for string. 

Examples: 


```
NSString *myString = @"Hello World";
```

The `@` symbol is necessary when assigning a literal string to an NSString object.

## NSNumber ##

Similarly to `NSString`, you can prefix a number literal with the symbol `@` in order to create an `NSNumber` instance.

Example:

```
NSNumber *myAge = @44;
```

## Collection Objects ##

The most important collection objects of the Foundation framework are:

1. `NSArray` (and its mutable counterpart `NSMutableArray`)
2. `NSSet` (and its mutable counterpart `NSMutableSet`)
3. `NSDictionary` (and its mutable counterpart `NSMutableDictionary`)

## Define Custom Classes ##

You declare the interface in a `.h` file and the implementation in a `.m` file.

Example:


    @interface ToDoItem : NSObject
    
    @end


is the `ToDoItem.h` file.

and the

    @implementation ToDoItem
    
    @end

is the `ToDoItem.m` file.

## Use Properties to Store Object's Data ##

The properties are defined inside the interface part of the class definition. Example:

    @interface ToDoItem : NSObject

    @property NSString *itemName;
    @property BOOL completed;

    @end

And you can declare a property to be readonly as follows:

    @property (readonly) NSDate *completionDate;

## Instance VS Class Methods ##

The instance methods are defined using the `-` sign whereas the 
class methods are defined using the `+` sign.

Example:

    @interface Person : NSObject
    
    -(void) speak;
    +(void) clean_data;
    
    @end
    
In the above example the `speak` is an instance method, whereas `clean_data` is a class method.
    
## Models ##
    
Define your models using custom classes, deriving, for example, from `NSObject`.
    
## Private Properties ##
    
You can declare properties in the interface definition of your class but in the `.m` file. In that case,
the property becomes private, and it is only accessible in the implementation.
    
Example:
    
    @interface Person : NSObject
    @end
        
    @implementation Person
    
    // +age+ is a private property
    @property NSNumber *age;
        
    @end
    
## Let a View display Dynamic Data ##
    
It needs a *data source* and a *delegate*.
   
## Prototype Cells ##
   
Take their data from the data source of the table view.   
        
# Where do I go from here #

I definitely need to improve my Objective-C knowledge. I will [Try Objective-C](https://www.codeschool.com/courses/try-objective-c).
