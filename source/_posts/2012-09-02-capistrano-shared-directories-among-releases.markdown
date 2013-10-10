---
layout: post
title: "Capistrano - Shared directories among releases"
date: 2012-09-02 20:47
comments: true
categories: ["Ruby on Rails", "Capistrano"]
---
[Capistrano](https://github.com/capistrano/capistrano) is a great tool for deploying Ruby on Rails applications on remote server machines. If you have ever used it, you may already know that it creates new directory structures for each new release that it realizes and sets "current" to point to the latest one.

This is very fine, but there are cases in your application that you might want to share the same directory data among releases. You can declare in your "deploy.rb" file the directories that will be shared among your releases. By default, the directories "log", "public/system" and "tmp/pids" are already shared. Hence, you do not have to do anything for them. But, if, for example, you want to share the "my_custom_data" directory that you have inside your application structure, you need to add the following line inside your "deploy.rb" file:

``` ruby Add this line to your deploy file
set :shared_children, fetch(:shared_children) + ["my_custom_data"]
```

This will create a link to "shared/my_custom_data" folder by executing the following command automatically:

``` bash Create a link to your custom shared folder
ln   -s  /home/<my_app>/<deployment_dir>/shared/my_custom_data   /home/<my_app>/<deployment_dir>/current/my_custom_data
```
Please, note that `my_custom_data` should pre-exist while you are doing the deployment. **But**, `bundle exec cap setup` will create shared folders anyway for you the first time you setup your servers.
