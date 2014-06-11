---
layout: post
title: "Using string column type for migrations"
date: 2014-06-11 22:48
comments: true
categories: ["Ruby on Rails", "MySQL", "PostgreSQL"]
---
Ruby on Rails migrations are used to create the necessary tables inside our database. One of the most frequently used column type is `string`.
Here is an example of an `ActiveRecord::Migration` that uses this type:

```ruby
class CreateAuthors < ActiveRecord::Migration
  def change
    create_table :authors do |t|
      t.string :name,      null: false
      t.string :biography, null: false
    end
  end
end
```

But what actual sql type did that migration create for the `string` type?

If we run this migration against a **MySQL** database, we can see the
actual table that creates using the `mysql` command `show create table authors`. The output will be the following:

```sql
+---------+-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| Table   | Create Table                                                                                                                                                                                                                                                            |
+---------+-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| authors | CREATE TABLE `authors` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `biography` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci |
+---------+-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
```

As you can see, the `string` is translated to `varchar(255)`. This is the type that allows to store strings with maximum length 255. What if we want to increase the maximum length?
How can we do that? In that case, you need to use the `limit:` option. Let's say that we want the `biography` column to have maximum length 1024. We have to change the corresponding
line in the above migration as follows:

```ruby
t.string :biography, null: false, limit: 1024
```

If you do this change and run your migration, the table that is created is the following:

```sql
+---------+--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| Table   | Create Table                                                                                                                                                                                                                                                             |
+---------+--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| authors | CREATE TABLE `authors` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `biography` varchar(1024) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci |
+---------+--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
```

As you can see, we have managed to change the maximum number of characters that `biography` column can hold. Please, note that the maximum length for a `varchar` column in
MySQL is `65535` **theoretically**. In practice, this is limited by the maximum row size (`65535 bytes` which is shared among all columns of the table) and the character set
used. So, for utf-8 database collation, this might be quite smaller.

Perfect. And what if we want to store a text that is longer than `65535` characters long? What is the option that we have?

If you try to set a bigger limit, you will probably get an error. The next option is to use the migration type `text`.

If you change your migration for `biography` as follows:

```ruby
t.text :biography, null: false
```

then the table that is created:

```sql
+---------+-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| Table   | Create Table                                                                                                                                                                                                                                                    |
+---------+-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| authors | CREATE TABLE `authors` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `biography` text COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci |
+---------+-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
```

As you can see, the `text` migration type has been translated to `text` MySQL type. And the question now is: Is that bigger than `varchar(65535)`? The answer is no. [MySQL
documentation](http://dev.mysql.com/doc/refman/5.5/en/storage-requirements.html) mentions that `text` maximum length is 2^16.

So, if you really want to store larger texts than that, you need to consider the two MySQL types: `mediumtext` and `longtext`. These can store really huge amounts of text.
`mediumtext` can store up to 2^24 and `longtext` up to 2^32.

The problem here is that if, for example, you want the `biography` to be a `longtext`, this:

```ruby
t.longtext :biography, null: false
```

will not work. Trying to run this migration will give you the following error:

```bash
undefined method `longtext' for #<ActiveRecord::ConnectionAdapters::TableDefinition:0x...db/migrate/..._create_authors.rb:5:in `block in change'
```

This is because `longtext` is not considered a standard migration column type. Neither `mediumtext` does.

The alternative here is to use the `column` method instead, and pass the column type as 2nd argument:

```ruby
t.column :biography, :longtext, null: false
```

This will run successfully and will generate the table:

```sql
+---------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| Table   | Create Table                                                                                                                                                                                                                                                        |
+---------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| authors | CREATE TABLE `authors` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `biography` longtext COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci |
+---------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
```

You are done!

**Note**: For those that are using PostgreSQL:

1) The default `string` migration type is translated to `character varying(255)`. See how the table is created with defaults:

```sql
                                   Table "public.authors"
  Column   |          Type           |                      Modifiers
-----------+-------------------------+------------------------------------------------------
 id        | integer                 | not null default nextval('authors_id_seq'::regclass)
 name      | character varying(255)  | not null
 biography | character varying(255)  | not null
Indexes:
    "authors_pkey" PRIMARY KEY, btree (id)
```

2) If you use the `limit:` option you can change the default `255` to whatever.

3) Note that `text` and `character varying(n)` in PostgreSQL are the same except from the fact that `character varying(n)` puts a limit. `text` does not have one.

4) You cannot use `mediumtext` or `longtext` with PostgreSQL. `text` does the job for you.

BTW: I am preparing a course `Introduction to Programming`. I know that most of you do not need such course but you may know somebody that might be. You can send them
the link to pre-register for a discount when this comes public. Here it is [Introduction to Programming](http://pmatsinopoulos.github.io/introduction-to-programming-notify-when-public).
