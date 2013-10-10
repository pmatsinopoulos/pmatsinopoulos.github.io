---
layout: post
title: "Testing - Asserting Template and Layout"
date: 2012-03-25 20:16
comments: true
categories: ["Ruby on Rails"]
---
I consider testing one of the most important phase in application development and Rails does a very good job on that. However, testing documentation on Rails Guides is still work under development.

Here is a short tutorial on how you can test that a reponse has rendered the correct template and the correct layout.

If you want to make sure that the response rendered the correct template and layout, you can use the assert_template method:

``` ruby assert_template usage
test “index should render correct template and layout” do
  get :index
  assert_template :index
  assert_template :layout => “layouts/application”
end
```

Note that you cannot test for template and layout at the same time, with one call to assert_template method. Also, for the layout test, you can give a regular expression instead of a string, but using the string, makes things clearer. On the other hand, you have to include the “layouts” directory name even if you save your layout file in this standard layout directory. Hence,

``` ruby This will not work
assert_template :layout => “application”
```

will not work.

**Gotcha: Watch out if your view renders any partial**

If your view renders any partial, when asserting for the layout, you have to assert for the partial at the same time. Otherwise, assertion will fail.

Hence:

``` ruby Correct way to assert for the layout
test “new should render correct layout” do
  get :new
  assert_template :layout => “layouts/application”, :partial => “_form”
end
```

is the correct way to assert for the layout when the view renders a partial with `name_form`. Omitting the `:partial` key in your `assert_template` call will complain.

