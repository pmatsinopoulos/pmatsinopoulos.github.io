---
layout: post
title: "Try Objective-C on Code School"
date: 2015-08-17 23:31
comments: true
categories: ["iOS", "Objective-C"]
---

Having done the Apple developer tutorial Getting Started on iOS development, the next was to have a deeper dive in
Objective-C. Looking around for online Objective-C tutorials, I came across a very good one, on [Code School](https://www.codeschool.com). 
The tutorial is called [Try Objective-C](http://tryobjectivec.codeschool.com/levels/1).

<!-- more -->

## NSLog ##

`NSLog` method is used to log stuff on console.

## `@` Prefix on Literal Values ##

`@"..."`: This is an `NSString *` literal.

## Store Numbers ##

`NSNumber *`: Useful object to store numbers.

Example:
    
    NSNumber *myAge = @44;

See how the literal on the right, has the `@` symbol prefix, necessary to assign to an `NS` object.   
    
## Construct Arrays ##
    
For arrays use `NSArray *`

Example:

    NSArray *fruits = @[@"Apples", @"Oranges", @"Pears"];
           
Watch out the @ prefix both in front of array literal and in front of the string literals.
           
And access value of an item by position: fruits[0], fruits[1] e.t.c.
           
## Mutable Arrays ##

`NSArray` is immutable. So, you cannot change it. Use `NSMutableArray` if you want to create an array that
can be changed.
           
## Hashes and Dictionaries ##
           
How to create hashes or dictionaries? Use the `NSDictionary *`.
           
Example: 

    NSDictionary *person = @{@"First Name": @"Panos"};
           
We can access the values using the keys:

    person[@"First Name"]   
           
## Send message to an object: ##
        
    [objectVar methodName];
           
## Method description ##
           
Use method "description" to get a nice-to-read representation of an object:
        
    [objectVar description]
      
## Unsigned Integers ##
           
`NSUInteger` is a type to stored unsigned integers.

Example: 

    NSUInteger = 5;
    
## Operations with NSNumbers ##
            
This is not so straight forward. You can not just use the + operator, for example.
You need to get the `NSUInteger` version of the `NSNumber *` and then operate on that.

    NSNumber *first = @1;
    NSNumber *second = @2;
    NSUInteger uiFirst  = [first unsignedIntegerValue];
    NSUInteger uiSecond = [second unsignedIntegerValue];
            
Then 
           
    uiFirst + uiSecond
    
## Appending Strings ##
            
This will not work: `@"foo" + @"bar"`.
            
But this will do:
            
    [@"foo " stringByAppendingString:@"bar"]

## Initialize String ##
            
You can use `stringWithString:` to initialize a string.

Example: 

    NSString *firstName = [NSString stringWithString:@"foo"];
    
## Alloc & Init ##
            
Create an `NSString` with `alloc` and `init`.

Examples: 

    NSString *firstName = [[NSString alloc] initWithString:@"foo"];
    
## Comparing 2 NSStrings ##
            
    [firstName isEqualToString:anotherFirstName]            
            
## Enumerate on Arrays ##
 
Enumerate and work on each one of the items of an array:

Example:
            
     NSArray *fruits = @[@"Apples", @"Oranges", @"Pears"];
     for (NSString *fruit in fruits) {
       NSLog(fruit);
     }

## Code Blocks ##
            
Code blocks work like anonymous functions or closures.

Here is an example of a block that takes arguments and returns value.
                
    NSString * (^sayHello)(NSString *) = ^(NSString *name){
      [NSString stringWithFormat: @"Hello %@", name];
    };
                           
## Enumerate using blocks ##

You can send a whole block as an argument to an enumeration 
and have the block applied to each one of the elements.
        
    NSArray *funnyWords = @[@"Goobly", @"Blobie", @"Fnogie"];
    [funnyWords enumerateObjectsUsingBlock: 
        ^(NSString *word, NSUInteger index, BOOL *stop) {
           NSLog(@"%@ is a funny word", word);
        }
    ];
        
                
## Defining Class Properties ##

This is an example of defining class properties. 

Example:

    @interface Person : NSObject
    
    @property NSString *firstName;
    @property NSString *lastName;
    
    @end        
            
The above creates 2 public properties. And 4 methods.
2 setters and 2 getters. One setter to set firstName
and one setter to set lastName. One getter to get firstName
and one getter to get lastName. Also, it creates a class
instance variable with name "_firstName" and another one
with name "_lastName" that one can access directly from the
implementation code of the class. However, clients of the class
cannot access them.
             
## Public Methods ##
                 
When you want to declare the public behaviour of a class you declare         
it on the interface level
            
    @interface Person : NSObject
    
    -(void)sayHello;
        
    @end
        
and you implement that on the implementation file, e.g. in `Person.m`
            
    @implementation Person
    
    -(void)sayHello {
       NSLog(@"Hello");
    }
    end
            
Then when you want to call that method, you send the message to the object instance:
            
    Person *p = [[Person alloc] init];
    [p sayHello];
            
## Method with arguments ##

When a method takes arguments, then we are using `:` to separate the method name from the
argument definition:
            
    @interface Person : NSObject
    
    -(NSString *)speak:(NSString *)greeting;
    
    @end    
            
Or when it takes 2 arguments, for example "greeting" and "times":
            
    -(NSString *)speak:(NSString *) greeting soManyTimes:(NSNumber *)times;
            
The method name now is `speak:soManyTimes:`
            
From the number of colons inside the name we can tell how many arguments
it requires when called.
            
You can make a property readonly as follows:

    @interface Person : NSObject
    
    @property (readonly) NSNumber *salary;
    
    @end
                
## Overriding Default Object Constructor ##

The default object constructor is `init`. We can override that
in the implementation of the class.
            
    @implementation Person
    
    -(Person *)init {
      _salary = @18;
      return [super init];
    }
    
    @end
            
Calling `return [super init];` is usually necessary in order
to make sure that the Person is correctly constructed as an NSObject.
           
## Instance Variables ##
            
Instance variables are declared in the interface.

    @interface Coffee : NSObject {
      NSNumber *_temperature;
    }
    @end    
            
## Check whether object responds to a method ##
            
We can check whether an object responds to a method at run-time
using the `respondsToSelector:` method
            
Example:
            
    if ([coffee respondToSelector:@selector(brew)]) {
      NSLog(@"Coffee responds to brew message");
    }
                    
## Protocols ##

Protocols are sets of methods that need to be implemented by a class.
Which protocols a class needs to implement is declared in the interface
of the class. Example:
            
    @interface Person : NSObject <NSCopying>
    @end
            
Person class derives from `NSObject` and also implements the protocol `NSCopying`.
            
Whereas standard constructor/initializer is the `init` method, one can
declare custom initializers. These are methods that have a name that
starts with `init`.

Example:

    @interface Person : NSObject
    
    -(Person *) initWithFirstName:(NSString *)firstName
                         lastName:(NSString *)lastName;
    
    @end        
            
and then in the implementation you can assign the arguments to properties or 
instance variables.

When you instantiate the object you can call:
            
    Person *p = [[Person alloc] initWithFirstName:@"First" lastName:@"Last"];
            
## Object instance responds to class ##

An object instance responds to `class` which returns the class of the object.
This can be used, for example, to dynamically instantiate an object.
            
    [[[objectVar class] alloc] init];
            
without knowing the actual class of the object instance.
            
Use the special type `id` instead of `NSObject *` for when you have
a generic Objective-C object that you don't know the type of at
compile time.
                
## What's Next from Here ##        

I will go to [Learn Objective-C in 24 Days](http://www.binpress.com/tutorial/learn-objectivec-in-24-days/38).
But first, I may take a short break to work with `Swift`. It seems that it may be more Ruby-like language.