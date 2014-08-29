---
layout: post
title: "United States, Counties, Cities, Zips CSV & Ruby loading code"
date: 2014-08-29 19:28
comments: true
categories: ["Ruby on Rails", "Data loading", "Geographic Data"]
---
I just wanted to have the United States, their Counties, the Cities in the Counties and the Zip codes in each City in CSV format. But I wanted that normalized. In different CSVs. So, here it is.
You can also find here some Ruby on Rails sample code that loads these files. Primitive stuff, but sometimes useful.

<div style="width: 100%;text-align: right;font-size: 0.8em;">My sponsor on that is <a href="https://www.bookandtable.com">Book&Table</a></div>
<div style="width: 100%;text-align: right;font-size: 0.8em;">I am about to start a Seminar: Introduction to Programming. If you are interested in, <a href="/introduction-to-programming-notify-when-public">register here</a>.</div>

<!-- more -->

* Here is the [list of states](/csv/states.csv.tar.gz).
* Here is the [list of counties](/csv/counties.csv.tar.gz). It has all counties and which State they belong to.
* Here is the [list of cities](/csv/cities.csv.tar.gz). It has all the cities and the County they belong to. 
* Here is the [list of zip codes](/csv/zips.csv.tar.gz). It has all the zip codes and the city they correspond to (specified by city name, county name and state code). 

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

### Zip

```
# Zip
class Zip < ActiveRecord::Base
  belongs_to :city, inverse_of: :zips

  validates :city, presence: true
  validates :code, presence: true, uniqueness: {case_sensitive: false}
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
  state_two_digit_code = row[0]
  state_id = State.find_by_two_digit_code!(state_two_digit_code).id

  county_name = row[1]
  city_name   = row[2]
  county      = County.find_by_state_id_and_name!(state_id, county_name)
  City.find_or_create_by!(county_id: county.id, name: city_name)
end

puts "...end of loading Cities"

```

### Loading Zip Codes

```
puts "Loading Zips..."

CSV.foreach "#{Rails.root}/db/zips.csv" do |row|
  zip_code  = row[0]
  city      = row[1]
  county    = row[2]
  state     = row[3]
  state_id  = State.find_by_two_digit_code!(state).id
  county_id = County.find_by_name_and_state_id!(county, state_id).id
  Zip.create_with(city_id: City.find_by_name_and_county_id!(city, county_id).id).find_or_create_by!(code: zip_code)
end

puts "...end of loading Zips"
```

<div style="width: 100%;text-align: right;font-size: 0.8em;">My sponsor on that is <a href="https://www.bookandtable.com">Book&Table</a></div>
<div style="width: 100%;text-align: right;font-size: 0.8em;">I am about to start a Seminar: Introduction to Programming. If you are interested in, <a href="/introduction-to-programming-notify-when-public">register here</a>.</div>
