---
layout: post
title: "Rails params Does the Job"
date: 2015-08-08 10:07
comments: true
categories: ["Ruby on Rails", "curl"]
---

When you have a Ruby on Rails end point, the client usually sends data in one of the following:

1. For `GET` requests, URL encoded in the URI
2. For `POST` requests, in the body of the request encoded with `application/x-www-form-urlencoded` or `application/json` or other popular format.

Sometimes, there is a combination of the above methods. In other words, in a `POST` request, some of the data may come both URL encoded in the URI and other data may come encoded with 
another method in the body of the request.

<!-- more -->

## How do we get the data inside our Rails controller? ##

Rails does a very good job and allows us to have access to the data sent by the client in a very easy way. This is called `params` hash.
The `params` hash holds the data in a `Hash` version no matter how the data have been sent by the client. You will find in the `params` hash
data that have been sent URL encoded on the URI of the request, or `application/x-www-form-urlencoded` in the body of the request or with
any other method.

## Echo Data Service ##

I have very quickly created an echo data service and I have deployed that here:

https://echo-data.herokuapp.com/

The source code of that is here:

https://github.com/pmatsinopoulos/echo

What does it do? It returns back to client the data that the client sends to server. The response is a JSON object with two properties. The `params` value and the `request.body` value.
The `params` value will show to you how the controller has interpreted the data sent by the client. The `request.body` will show you how the body has been actually received.

## Testing the service ##

You can use some `curl` commands to test the echo data service. Here is how:

### Send data URL encoded as part of the URI ###

This example sends the data URL encoded as part of the URI.

```
curl "https://echo-data.herokuapp.com/echo?foo=bar" -v --header "Accept: application/json"
```

As you see in the output of the `curl` that is given below, this is a `GET` request and the `Content-Type` header is not
specified, because the data are part of the URI.

    * Hostname was NOT found in DNS cache
    *   Trying 54.243.224.121...
    * Connected to echo-data.herokuapp.com (54.243.224.121) port 443 (#0)
    > GET /echo?foo=bar HTTP/1.1
    > User-Agent: curl/7.35.0
    > Host: echo-data.herokuapp.com
    > Accept: application/json
    > 
    < HTTP/1.1 200 OK 
    < Connection: keep-alive
    < X-Frame-Options: SAMEORIGIN
    < X-Xss-Protection: 1; mode=block
    < X-Content-Type-Options: nosniff
    < Content-Type: application/json; charset=utf-8
    < Etag: W/"d83be65a785d7935d5b38bfcb091f75f"
    < Cache-Control: max-age=0, private, must-revalidate
    < X-Request-Id: 6e888864-0e1a-4f34-8f24-8c2d57f962f3
    < X-Runtime: 0.006788
    * Server WEBrick/1.3.1 (Ruby/2.0.0/2015-04-13) is not blacklisted
    < Server: WEBrick/1.3.1 (Ruby/2.0.0/2015-04-13)
    < Date: Sat, 08 Aug 2015 09:11:42 GMT
    < Content-Length: 82
    < Via: 1.1 vegur
    < 
    * Connection #0 to host echo-data.herokuapp.com left intact
    {"params":{"foo":"bar","controller":"echo","action":"echo"},"request":{"body":""}}

The last line above is the actual response payload returned from the echo data service. As you can see, 
the `params` hash contains the key `foo` with value `bar`. Note that `request.body` is empty, because we
didn't send anything there.

### Send data URL encoded in the request body ###
     
With this example we will send the data using a `POST` request and the data will be
url encoded in the request body.     

```
curl "https://echo-data.herokuapp.com/echo" -v --data foo=bar --header "Accept: application/json"
```     

As you can see from the `curl` output below, the request is a `POST` request and the `Content-Type`
is automatically set to `application/x-www-form-urlencoded`.

    * Hostname was NOT found in DNS cache
    *   Trying 23.21.247.21...
    * Connected to echo-data.herokuapp.com (23.21.247.21) port 443 (#0)
    > POST /echo HTTP/1.1
    > User-Agent: curl/7.35.0
    > Host: echo-data.herokuapp.com
    > Accept: application/json
    > Content-Length: 7
    > Content-Type: application/x-www-form-urlencoded
    > 
    * upload completely sent off: 7 out of 7 bytes
    < HTTP/1.1 200 OK 
    < Connection: keep-alive
    < X-Frame-Options: SAMEORIGIN
    < X-Xss-Protection: 1; mode=block
    < X-Content-Type-Options: nosniff
    < Content-Type: application/json; charset=utf-8
    < Etag: W/"92bb929068a54703e29e59154e7c228f"
    < Cache-Control: max-age=0, private, must-revalidate
    < X-Request-Id: f0262992-5542-4dc3-a2d6-ab52555d3fbe
    < X-Runtime: 0.004037
    * Server WEBrick/1.3.1 (Ruby/2.0.0/2015-04-13) is not blacklisted
    < Server: WEBrick/1.3.1 (Ruby/2.0.0/2015-04-13)
    < Date: Sat, 08 Aug 2015 09:12:58 GMT
    < Content-Length: 89
    < Set-Cookie: request_method=POST; path=/
    < Via: 1.1 vegur
    < 
    * Connection #0 to host echo-data.herokuapp.com left intact
    {"params":{"foo":"bar","controller":"echo","action":"echo"},"request":{"body":"foo=bar"}}

The last line above, is the actual payload response content. It demonstrates that the `params` hash
has successfully identified the data sent and that you can use it to retrieve it for further processing
in your controller. See how the `request.body` now is not empty, since `curl` sent the data in the 
body of the request.

### Send data as a JSON string inside the request body ###
 
In the following example we are sending the data as a JSON string in the body of the request:
 
 ```
 curl "https://echo-data.herokuapp.com/echo" -v --header "Accept: application/json" --header "Content-Type: application/json" -d "{\"foo\":\"data\"}"
 ```
 
 What `curl` returns back is:
 
    * Hostname was NOT found in DNS cache
    *   Trying 54.225.207.60...
    * Connected to echo-data.herokuapp.com (54.225.207.60) port 443 (#0)
    > POST /echo HTTP/1.1
    > User-Agent: curl/7.35.0
    > Host: echo-data.herokuapp.com
    > Accept: application/json
    > Content-Type: application/json
    > Content-Length: 14
    > 
    * upload completely sent off: 14 out of 14 bytes
    < HTTP/1.1 200 OK 
    < Connection: keep-alive
    < X-Frame-Options: SAMEORIGIN
    < X-Xss-Protection: 1; mode=block
    < X-Content-Type-Options: nosniff
    < Content-Type: application/json; charset=utf-8
    < Etag: W/"27ba5f1877a65ff394f1899ac75f3449"
    < Cache-Control: max-age=0, private, must-revalidate
    < X-Request-Id: ecdd54eb-7d99-45b2-9872-cca20a63394c
    < X-Runtime: 0.007516
    * Server WEBrick/1.3.1 (Ruby/2.0.0/2015-04-13) is not blacklisted
    < Server: WEBrick/1.3.1 (Ruby/2.0.0/2015-04-13)
    < Date: Sat, 08 Aug 2015 09:17:32 GMT
    < Content-Length: 123
    < Set-Cookie: request_method=POST; path=/
    < Via: 1.1 vegur
    < 
    * Connection #0 to host echo-data.herokuapp.com left intact
    {"params":{"foo":"data","controller":"echo","action":"echo","echo":{"foo":"data"}},"request":{"body":"{\"foo\":\"data\"}"}} 

As you can see from the `curl` output, the request is a `POST` request. The last line shows that, even in that case,
the `params` hash holds the data in a way that we can handle it from our controller code. See also how the `request.body` 
bears the JSON string sent over.

### Combine data on URI and data in request body ###

In the following example, we combine the data on URI and data in request body:

```
curl "https://echo-data.herokuapp.com/echo?hello=world" -v --header "Accept: application/json" --header "Content-Type: application/json" -d "{\"foo\":\"data\"}"
```

The `curl` output in that case is:

    * Hostname was NOT found in DNS cache
    *   Trying 54.243.163.2...
    * Connected to echo-data.herokuapp.com (54.243.163.2) port 443 (#0)    
    > POST /echo?hello=world HTTP/1.1
    > User-Agent: curl/7.35.0
    > Host: echo-data.herokuapp.com
    > Accept: application/json
    > Content-Type: application/json
    > Content-Length: 14
    > 
    * upload completely sent off: 14 out of 14 bytes
    < HTTP/1.1 200 OK 
    < Connection: keep-alive
    < X-Frame-Options: SAMEORIGIN
    < X-Xss-Protection: 1; mode=block
    < X-Content-Type-Options: nosniff
    < Content-Type: application/json; charset=utf-8
    < Etag: W/"47484987479c63ee1f544f7c94886d5d"
    < Cache-Control: max-age=0, private, must-revalidate
    < X-Request-Id: 5c6d5d7c-8289-45d7-8fb4-d0909e19898d
    < X-Runtime: 0.055496
    * Server WEBrick/1.3.1 (Ruby/2.0.0/2015-04-13) is not blacklisted
    < Server: WEBrick/1.3.1 (Ruby/2.0.0/2015-04-13)
    < Date: Sat, 08 Aug 2015 09:23:59 GMT
    < Content-Length: 139
    < Set-Cookie: request_method=POST; path=/
    < Via: 1.1 vegur
    < 
    * Connection #0 to host echo-data.herokuapp.com left intact
    {"params":{"foo":"data","hello":"world","controller":"echo","action":"echo","echo":{"foo":"data"}},"request":{"body":"{\"foo\":\"data\"}"}}
    
As you can see from the last line, the data in the URI, `hello=world` have been put in the `params`. Same goes for data in the request body.
    
## Summary ##

The above article and corresponding examples and code try to show to you how the `params` hash is the single place to go if you want
to process the data that a client program is sending to your Ruby on Rails end point.

Thanks for reading so far and your comments are always more than welcome.

    