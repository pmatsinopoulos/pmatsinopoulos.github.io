---
layout: post
title: "Arigatai; Express Gratitude That Stays In History"
date: 2024-08-25 15:38:43 +0300
comments: true
categories: [token, erc-20, gratitude, thank-you]
---

# Introduction

This is the idea behind `Arigatai`, a project that dreams to save the gratitude statements in
history.

<!-- more -->

# When I First Had The Idea for a `#thankyou` Slack Channel

Back when I worked at [Lavanda](https://www.getlavanda.com/), I introduced the `#thankyou` Slack channel.

Why?

I wanted to express my gratitude to another colleague, **in public**.

Why?

I always sent my gratitude with a _thank you_ message to the person having offered his time, knowledge and help, to make my life at work better...but I didn't want this to stay only between us.

* That person made me happy, and I wanted to show to the rest of the company **that I was happy**.

* I also wanted to show to the rest of the company my happiness of **having
colleagues who could make others happy**.

* I wanted to show to the rest of the company **who is the person that can make others happy**.

* I believe that my colleagues who can make others happy, they deserve to be, at least, **recognized in public**.

And, I wanted to make public, **the reason I am thanking** my colleague. Not many details. Brief short phrase to let anyone actually be in my shoes for the reason I am happy for. To give a little more context and value to this open gratitude.

Then, everyone went mad about it. They loved it.

And they even created a _thank you_ counter. The **tacos**.

And they put some limits. Every day you can thank up to 5 times. You can give your 5 tacos to the same person, if you want, or give each one of the 5 to different. Doesn't matter, but you can only spend up to 5 tacos each day.

And they even have a leader board:

![Lavanda Tacos Leader Board](../../../../../images/lavanda-tacos-leaderboard.jpg)

So, employees, earned tacos on a daily basis. And they gave tacos to other colleagues too.

# Other Companies

Is this a common practice in companies. I didn't know. Until I saw this:

[The Gitlab Handbook](https://handbook.gitlab.com/handbook/values/#say-thanks)

Ohhh! They have a `#thanks` channel. Similar to the one I introduced at
Lavanda! I was so happy I saw that.

And then I also found this:

[Heytaco](https://heytaco.com/)

A company that offers a _peer-to-peer recognition platform_. Great!

So, it make sense!

# The Problem

> All tacos were deleted 😭.

> I left Lavanda, my tacos have gone away. I couldn't take my tacos with me 😢.

I guess you immediately get the point.

The tacos, they presented a _value_ to me, which

* I lose when I leave the company,
* I lose when the centralized entity that keeps track of them stops to exist.

_So what_ one might say!

I am saying that gratitude that I receive throughout my professional life should belong to me.

It is a value that I want to keep on having, forever, registered in history.

And I want to accumulate such value even, going from one company to the next.

**It is part of my reputation as a professional**.

# The Solution

Join **Arigatai**.

## ERC-20 Token

Arigatai, with symbol `ARIG`, stores the gratitude value on Ethereum, as an [ERC-20 token](https://ethereum.org/en/developers/docs/standards/tokens/erc-20/).

![ARIGATAI is an ERC-20 Token](../../../../../images/ARIGATAI-is-erc-20.png)

`ARIG`, is my professional reputation points on the *gratitude* dimension.

## Minting

When `Arigatai` Smart Contract is deployed it doesn't have any initial circulation. I.e. the circulating supply is `0`.

Minting starts when clients call the external functions `arigatoDeliver()` and `arigatoAccept()`

This is the signature of the function:

```
function arigatoDeliver(
  address _recipient, // The EOA that will receive the `ARIG`
  uint256 _amount, // The amount of `ARIG` the _recipient will get
  bytes[640] memory _reason, // The reason sender is sending the _recipient this amount of ARIG
) external;
```

There are some rules for this call to succeed.

1. The caller should be an EOA, not a contract.
1. Recipient should be an EOA, not a contract.
1. The caller should not exceed the maximum daily delivery amount which is 5.

This function does not actually _create_ `ARIG`.  It is the `arigatoAccept()` that does.

```
function arigatoAccept(
  address _sender, // The EOA that sent the arigatoRequest()
  uint256 _amount, // The amount of $ARIG that will be accepted
) external;
```

1. The caller needs to have a pending `ARIG` delivery from the `_sender`.
1. The pending delivery should be for the `_amount`.
1. The delivery should have been created within the last 24 hours from acceptance.

So, it is the `arigatoAccept()` that does the actual minting of the `ARIG` token.

When `arigatoAccept()` succeeds, the caller gets the amount of `ARIG` and there is
a record created (`Arigato` record) in the state of the contract to record the details of the reward.

The `arigatoAccept()` will internally call a `_mint()` function like:

```
_mint(msg.sender, _amount)
```
and will also take care to create the `Arigato` record.

## Properties of the ERC-20 Token

* `name`: `ARIGATAI`
* `symbol`:`ARIG`
* `decimals`: `0`. The value `ARIG` token is not divisible.

## How can an EOA Find The List of its `Arigato` Records?

There is a function that allows pagination access to the `Arigato` records of an address:

```
function getArigatos(address receiver, uint256 start, uint256 count) public view returns (Arigato[] memory);
```

Also, there is a function that returns the total number of `Arigato` records of an address:

```
function getArigatosCount(address receiver) public view returns uint256;
```

## How can we have a Leader Board?

Contract keeps track of the recipients and their `Arigato` records. Building a Leader Board,
is outside of the scope of the Smart Contract, but we have other plans for it.
