---
layout: post
title: "United States, Counties, Cities CSV & Ruby loading code"
date: 2014-08-29 19:28
comments: true
categories: ["Ruby on Rails", "Data loading", "Geographic Data"]
---
I just wanted to have the United States, their Counties and the Cities in the Counties in CSV format. But I wanted that normalized. In different CSVs. So, here it is.
You can also find here some Ruby on Rails sample code that loads these files. Primitive stuff, but sometimes useful.

*Note*: My sponsor on that is [Book&Table](https://www.bookandtable.com)
<!-- more -->

* Here is the [list of states](/csv/states.csv.tar.gz).
* Here is the [list of counties](/csv/counties.csv.tar.gz). It has all counties and which State they belong to.
* Here is the [list of cities](/csv/cities.csv.tar.gz). It has all the cities and the County they belong to. 

## ActiveRecord Models

### State

```
# State
class State < ActiveRecord::Base
  has_many :counties, inverse_of: :state, dependent: :destroy
  validates :name,           presence: true, uniqueness: {case_sensitive: false}
  validates :two_digit_code, presence: true, uniqueness: {case_sensitivie: false}
end
```

### County

```
# County
class County < ActiveRecord::Base
  belongs_to :state, inverse_of: :counties
  has_many   :cities, inverse_of: :county, dependent: :destroy

  validates :state, presence: true
  validates :name,  presence: true, uniqueness: {case_sensitive: false, scope: :state_id}
end
```

### City

```
# City
class City < ActiveRecord::Base
  belongs_to :county, inverse_of: :cities

  validates :county, presence: true
  validates :name,   presence: true, uniqueness: {case_sensitive: false, scope: :county_id}
end
```

### Loading States

```
puts "Loading States..."
CSV.foreach("#{Rails.root}/db/states.csv") do |row|
  state_code = row[0]
  state_name = row[1]
  State.create_with(name: state_name).find_or_create_by!(two_digit_code: state_code)
end
puts "...end of loading States"```
```

### Loading Counties

```
puts "Loading Counties..."
CSV.foreach("#{Rails.root}/db/counties.csv") do |row|
  state_code  = row[0]
  county_name = row[1]
  County.find_or_create_by!(state_id: State.find_by_two_digit_code(state_code).id, name: county_name)
end
puts "...end of loading Counties"
```

### Loading Cities

```
puts "Loading Cities..."
CSV.foreach("#{Rails.root}/db/cities.csv") do |row|
  county_name = row[0]
  city_name   = row[1]
  county = County.find_by_name!(county_name)
  City.find_or_create_by!(county_id: county.id, name: city_name)
end
puts "...end of loading Cities"

```
