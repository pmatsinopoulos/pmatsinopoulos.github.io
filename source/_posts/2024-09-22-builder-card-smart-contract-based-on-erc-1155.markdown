---
layout: post
title: "Builder Card Smart Contract - Based on ERC-1155"
date: 2024-09-22 19:54:33 +0300
comments: true
categories: ["solidity", "blockchain", "erc-1155"]
---

# Builder Card Smart Contract - Based on ERC-1155

[Download PDF Version](../../../../../pdfs/builder-card-smart-contract/builder-card-smart-contract.pdf)

## Introduction

In [EthGlobal Hackathon in Brussels, Jul 2027](https://ethglobal.com/events/brussels), I actively participated as a member of the [Talent Protocol](https://www.talentprotocol.com/) team.

We submitted the [Builder Cards Project](https://ethglobal.com/showcase/builder-cards-88k0j), which is described as *Collecting is the new social signal. Support builders with 0.001 ETH, showcasing favourites onchain. Earn rewards by becoming a top collector or referring new builders.*

My main responsibility was to design and implement the Smart Contract that would support the collection functionality.

## Versions of Libraries and Tools Used

For the sake of reference, the main versions of the libraries and tools we use are:

- Typescript: 5.5.3
- Solidity: 0.8.24
- OpenZeppelin Contracts: 5.0.2
- Hardhat: 2.22.6
- Ethers: 6.13.1

## Source Code

You can find the source of this Smart Contract here:

- [Smart Contract Source Code - IBuilderCard.sol](https://www.google.com)
- [Smart Contract Source Code - BuilderCard.sol](https://www.google.com)

## Main Use Cases

[This is a live instance](https://www.builder.cards/) of the project. You need to log in using your wallet. It works on top of Base Sepolia Test Network.

After you log in, you can then locate your favourite builder and then, on their page, click on the "Collect" button. This allows you to collect the
card of the particular builder. The builder is rewarded, and you are rewarded too if you are the first collector.

The collected card should appear in your wallet.

Some restrictions apply:

- A Builder Card is minted/created at the moment of the collection.
- A Builder Card can be collected multiple times, but not from the same
collector. Hence, the supply of the Builder Card is not predefined or
limited. As long as there is a collector to collect it, a new Builder Card
instance for the particular Builder Card is minted/created.

Some more restrictions will be given further on, while we analyze how
we design and implement our Smart Contract.

## Smart Contract Interface

### Basic Interface

This is the basic interface that our Smart Contract needs to support. It is given in Solidity

```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

/**
 * @title IBuilderCard Builder Card Collections
 * @author Panagiotis Matsinopoulos & Francisco Leal
 * @notice The API BuilderCard contract exposes
 */
interface IBuilderCard {
    /**
     * @notice It is emitted when a Builder Card is actually collected.
     * @param _builder It is the Builder address/wallet the Card was collected for
     * @param _collector It is the address of the collector
     */
    event CardCollected(address indexed _builder, address indexed _collector);

    /**
     * @notice Mints/Creates an instance of the Builder Card for the Builder with address `_builder`. This instance is
     * attached to the `msg.sender`. Hence, the `msg.sender` is considered to be
     * the Collector of the Builder Card for the Builder given.
     * Also, it rewards the parties involved and pays fee to the platform hosting
     * the Builder Cards web application. Here is how reward is working:
     * - Builder is getting `BuilderCardBase->BUILDER_REWARD`.
     * - If the `msg.sender` is the first collector of the particular Builder Card,
     * they are being rewarded `BuilderCardBase->FIRST_COLLECTOR_REWARD`.
     * - Platform gets the rest, i.e. `TOTAL_COLLECTION_FEE - FIRST_COLLECTOR_REWARD(if they have been rewarded) - BUILDER_REWARD`.
     * Note, that the `msg.value` of the transaction needs to be (at least) `TOTAL_COLLECTION_FEE`. Otherwise,
     * the call will be reverted.
     * @dev
     * MUST revert, if the `msg.value` sent with this transaction is not enough to cover at least
     * for the `BuilderCardBase->TOTAL_COLLECTION_FEE`.
     * MUST NOT revert, if the collector (`msg.sender`) has already collected the given Builder
     * Card. It should just ignore and not emit the `CardCollected` event.
     * MUST emit the event `CardCollected` with `_builder` the given `_builder` and `_collector` the
     * `msg.sender`.
     * @param _builder the unique Builder identifier whose Card is collected.
     */
    function collect(address _builder) external;
}
```

### NFT Standard - Which One? - ERC-1155

It may look enough to just implement the above interface, but, we think that
it might be even better, if our smart contract implemented an NFT standard
interface. If it does, then all applications that manage NFTs of a wallet, in one way or
another, will be able to manage the Builder Cards too. Hence, a wallet will
be able to import a Builder Card as an NFT attached to the collector's wallet.

Initially, builder cards look quite similar to [NFTs](https://ethereum.org/en/nft/#what-are-nfts). The core [NFT Standard, ERC-721](https://eips.ethereum.org/EIPS/eip-721) is the specification an NFT Smart Contract should comply with.

The limitation of this standard, though, is that a builder card could only be collected by a single owner. The

```solidity
function ownerOf(uint256 _tokenId) external view returns (address);
```

takes as input the (Builder Card) token and returns the Ethereum address that owns it.

Hence, we decided that we should not use this standard.

On the other hand, the standard [ERC-1155, Multi-Token Standard](https://eips.ethereum.org/EIPS/eip-1155) addresses our use case.

This can be understood by looking at various functions of the ERC-1155 interface.

For example:

```solidity
function safeTransferFrom(address _from, address _to, uint256 _id, uint256 _value, bytes calldata _data) external;
```
and
```solidity
function balanceOf(address _owner, uint256 _id) external view returns (uint256);
```

The function `safeTransferFrom()` transfers `_value` instances of the token `_id` to the `_to` address.
This function does not set any restriction on which the `_to` address can be. Hence, we could call:

```solidity
safeTransferFrom("0x1234", "0xABCD", 1987, 1, "");
```

which would make the address `0xABCD` own the builder card with `_id` `1987`.

And then, call:

```solidity
safeTransferFrom("0x1234", "0x5678", 1987, 1, "");
```

which would make the address `0x5678` own the same builder card with `_id` `1987`.

The above transfers assume that `from` address `0x1234` already has `2` instances of the builder card with id `1987`, which also implies, that the
ERC-1155 standard allows a collector to collect a Builder Card multiple times if they want (as long as there is enough supply)

But, the ERC-1155 does not prescribe how the tokens are minted/created.
This needs to be a custom function of our Smart Contract interface.

It will be the `collect()` function, we have already specified above:

```solidity
function collect(address _builder) external;
```
However, in our case, we will not let a collector collect the same
Builder Card more than once. It will not make sense. Please, take
into account that a Builder Card supply is not predefined or limited.
A Builder Card could be minted/created as long as there are collectors
to collect it.

Things may become even more clear if you look at the following diagram:

![Collecting Builder Cards](../../../../../images/builder-card-smart-contract/builder-cards.drawio.png)

The diagram shows how a collector is collecting a Builder Card with the custom
mint/creation function, `collect()`.

Also, it shows how the Smart Contract is keeping track of the collectors and which Builder Cards they have collected.

Of course, thanks to the ERC-1155, our Smart Contract will offer other functionality
as well, which is not depicted in the diagram.

The state of the contract, as depicted in the diagram, will also answer the
`balanceOf()` question:

```solidity
function balanceOf(address _owner, uint256 _id) external view returns (uint256);
```

which is part of the ERC-1155 standard

In our case, the `balanceOf()` will always return either
`0`, when the given address has not collected the given token, or `1`, if the
given address has collected the given token.

### ERC-1155 Standard Interface

If we want our smart contract to be ERC-1155 compatible, then it needs
be exposing the following events and functions:

[based on the official ERC-1155 documentation](https://eips.ethereum.org/EIPS/eip-1155)

```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

/**
 * @title IBuilderCard Builder Card Collections
 * @author Panagiotis Matsinopoulos & Francisco Leal
 * @notice The API BuilderCard contract exposes
 */
interface IBuilderCard {
    /**
     * @notice It is emitted when a Builder Card is actually collected.
     * @param _builder It is the Builder address/wallet the Card was collected for
     * @param _collector It is the address of the collector
     */
    event CardCollected(address indexed _builder, address indexed _collector);

    /// >>>>>>>>>>>>>>>>>>>>>>> ERC-1155 defined events >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    /**
        @dev Either `TransferSingle` or `TransferBatch` MUST emit when tokens are transferred, including zero value transfers as well as minting or burning (see "Safe Transfer Rules" section of the standard).
        The `_operator` argument MUST be the address of an account/contract that is approved to make the transfer (SHOULD be msg.sender).
        The `_from` argument MUST be the address of the holder whose balance is decreased.
        The `_to` argument MUST be the address of the recipient whose balance is increased.
        The `_id` argument MUST be the token type being transferred.
        The `_value` argument MUST be the number of tokens the holder balance is decreased by and match what the recipient balance is increased by.
        When minting/creating tokens, the `_from` argument MUST be set to `0x0` (i.e. zero address).
        When burning/destroying tokens, the `_to` argument MUST be set to `0x0` (i.e. zero address).
    */
    event TransferSingle(
        address indexed _operator,
        address indexed _from,
        address indexed _to,
        uint256 _id,
        uint256 _value
    );

    /**
        @dev Either `TransferSingle` or `TransferBatch` MUST emit when tokens are transferred, including zero value transfers as well as minting or burning (see "Safe Transfer Rules" section of the standard).
        The `_operator` argument MUST be the address of an account/contract that is approved to make the transfer (SHOULD be msg.sender).
        The `_from` argument MUST be the address of the holder whose balance is decreased.
        The `_to` argument MUST be the address of the recipient whose balance is increased.
        The `_ids` argument MUST be the list of tokens being transferred.
        The `_values` argument MUST be the list of number of tokens (matching the list and order of tokens specified in _ids) the holder balance is decreased by and match what the recipient balance is increased by.
        When minting/creating tokens, the `_from` argument MUST be set to `0x0` (i.e. zero address).
        When burning/destroying tokens, the `_to` argument MUST be set to `0x0` (i.e. zero address).
    */
    event TransferBatch(
        address indexed _operator,
        address indexed _from,
        address indexed _to,
        uint256[] _ids,
        uint256[] _values
    );

    /**
        @dev MUST emit when approval for a second party/operator address to manage all tokens for an owner address is enabled or disabled (absence of an event assumes disabled).
    */
    event ApprovalForAll(
        address indexed _owner,
        address indexed _operator,
        bool _approved
    );

    /**
        @dev MUST emit when the URI is updated for a token ID.
        URIs are defined in RFC 3986.
        The URI MUST point to a JSON file that conforms to the "ERC-1155 Metadata URI JSON Schema".
    */
    event URI(string _value, uint256 indexed _id);

    /// <<<<<<<<<<<<<<<<< end of ERC-1155 Events <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

    /**
     * @notice Mints/Creates an instance of the Builder Card for the Builder with address `_builder`. This instance is
     * attached to the `msg.sender`. Hence, the `msg.sender` is considered to be
     * the Collector of the Builder Card for the Builder given.
     * Also, it rewards the parties involved and pays fee to the platform hosting
     * the Builder Cards web application. Here is how reward is working:
     * - Builder is getting `BuilderCardBase->BUILDER_REWARD`.
     * - If the `msg.sender` is the first collector of the particular Builder Card,
     * they are being rewarded `BuilderCardBase->FIRST_COLLECTOR_REWARD`.
     * - Platform gets the rest, i.e. `TOTAL_COLLECTION_FEE - FIRST_COLLECTOR_REWARD(if they have been rewarded) - BUILDER_REWARD`.
     * Note, that the `msg.value` of the transaction needs to be (at least) `TOTAL_COLLECTION_FEE`. Otherwise,
     * the call will be reverted.
     * @dev
     * MUST revert, if the `msg.value` sent with this transaction is not enough to cover at least
     * for the `BuilderCardBase->TOTAL_COLLECTION_FEE`.
     * MUST NOT revert, if the collector (`msg.sender`) has already collected the given Builder
     * Card. It should just ignore and not emit the `CardCollected` event.
     * MUST emit the event `CardCollected` with `_builder` the given `_builder` and `_collector` the
     * `msg.sender`.
     * @param _builder the unique Builder identifier whose Card is collected.
     */
    function collect(address _builder) external;

    /// >>>>>>>>>>>>>>>>>>>>>>>> ERC-1155 functions >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    /**
        @notice Transfers `_value` amount of an `_id` from the `_from` address to the `_to` address specified (with safety call).
        @dev Caller must be approved to manage the tokens being transferred out of the `_from` account (see "Approval" section of the standard).
        MUST revert if `_to` is the zero address.
        MUST revert if balance of holder for token `_id` is lower than the `_value` sent.
        MUST revert on any other error.
        MUST emit the `TransferSingle` event to reflect the balance change (see "Safe Transfer Rules" section of the standard).
        After the above conditions are met, this function MUST check if `_to` is a smart contract (e.g. code size > 0). If so, it MUST call `onERC1155Received` on `_to` and act appropriately (see "Safe Transfer Rules" section of the standard).
        @param _from    Source address
        @param _to      Target address
        @param _id      ID of the token type
        @param _value   Transfer amount
        @param _data    Additional data with no specified format, MUST be sent unaltered in call to `onERC1155Received` on `_to`
    */
    function safeTransferFrom(
        address _from,
        address _to,
        uint256 _id,
        uint256 _value,
        bytes calldata _data
    ) external;

    /**
        @notice Transfers `_values` amount(s) of `_ids` from the `_from` address to the `_to` address specified (with safety call).
        @dev Caller must be approved to manage the tokens being transferred out of the `_from` account (see "Approval" section of the standard).
        MUST revert if `_to` is the zero address.
        MUST revert if length of `_ids` is not the same as length of `_values`.
        MUST revert if any of the balance(s) of the holder(s) for token(s) in `_ids` is lower than the respective amount(s) in `_values` sent to the recipient.
        MUST revert on any other error.
        MUST emit `TransferSingle` or `TransferBatch` event(s) such that all the balance changes are reflected (see "Safe Transfer Rules" section of the standard).
        Balance changes and events MUST follow the ordering of the arrays (_ids[0]/_values[0] before _ids[1]/_values[1], etc).
        After the above conditions for the transfer(s) in the batch are met, this function MUST check if `_to` is a smart contract (e.g. code size > 0). If so, it MUST call the relevant `ERC1155TokenReceiver` hook(s) on `_to` and act appropriately (see "Safe Transfer Rules" section of the standard).
        @param _from    Source address
        @param _to      Target address
        @param _ids     IDs of each token type (order and length must match _values array)
        @param _values  Transfer amounts per token type (order and length must match _ids array)
        @param _data    Additional data with no specified format, MUST be sent unaltered in call to the `ERC1155TokenReceiver` hook(s) on `_to`
    */
    function safeBatchTransferFrom(
        address _from,
        address _to,
        uint256[] calldata _ids,
        uint256[] calldata _values,
        bytes calldata _data
    ) external;

    /**
        @notice Get the balance of an account's tokens.
        @param _owner  The address of the token holder
        @param _id     ID of the token
        @return        The _owner's balance of the token type requested
     */
    function balanceOf(
        address _owner,
        uint256 _id
    ) external view returns (uint256);

    /**
        @notice Get the balance of multiple account/token pairs
        @param _owners The addresses of the token holders
        @param _ids    ID of the tokens
        @return        The _owner's balance of the token types requested (i.e. balance for each (owner, id) pair)
     */
    function balanceOfBatch(
        address[] calldata _owners,
        uint256[] calldata _ids
    ) external view returns (uint256[] memory);

    /**
        @notice Enable or disable approval for a third party ("operator") to manage all of the caller's tokens.
        @dev MUST emit the ApprovalForAll event on success.
        @param _operator  Address to add to the set of authorized operators
        @param _approved  True if the operator is approved, false to revoke approval
    */
    function setApprovalForAll(address _operator, bool _approved) external;

    /**
        @notice Queries the approval status of an operator for a given owner.
        @param _owner     The owner of the tokens
        @param _operator  Address of authorized operator
        @return           True if the operator is approved, false if not
    */
    function isApprovedForAll(
        address _owner,
        address _operator
    ) external view returns (bool);

    /// <<<<<<<<<<<<<<<<<<<<<< end of ERC-1155 defined functions <<<<<<<<<<<<<<<<<<<<<<<<<<<<

    /// >>>>>>>>>>>>>>>>>>>>>> ERC-1155 MetaData URI (ERC1155Metadata_URI) defined functions >>>>>>>>>>>>>>>>>>>>>>>

    /**
        @notice A distinct Uniform Resource Identifier (URI) for a given token.
        @dev URIs are defined in RFC 3986.
        The URI MUST point to a JSON file that conforms to the "ERC-1155 Metadata URI JSON Schema".
        @return URI string
    */
    function uri(uint256 _id) external view returns (string memory);

    /// <<<<<<<<<<<<<<<<<<<< end of ERC 1155 MetaData URI <<<<<<<<<<<<<<<<<<<<<<<<<<<<

    /// >>>>>>>>>>>>>>>>>>>> start of ERC-165 defined methods >>>>>>>>>>>>>>>>>>>>>>>>

    /**
     * @dev MUST return the constant value `true` if `0xd9b67a26` is passed through
     * the `interfaceID` argument. This is for Interface ERC-1155.
     * MUST return the constant value `true` if `0x0e89341c` for support
     * of ERC1155Metadata_URI extension.
     */
    function supportsInterface(bytes4 interfaceID) external view returns (bool);

    /// <<<<<<<<<<<<<<<<<<<<<< end of ERC-165 defined functions <<<<<<<<<<<<<<<<<<<<<
}
```

## Smart Contract Implementation

Looking at the `IBuilderCard` interface it looks like our smart contract needs to do a lot of work if we want it to be `ERC-1155` compatible.

### Rely on OpenZeppelin

This is where open source well-tested implementations come into the picture
for our rescue.

For our Smart Contract implementation, we rely on [OpenZeppelin ERC-1155](https://docs.openzeppelin.com/contracts/5.x/erc1155) open source implementation.

### OpenZeppelin Smart Contract Interfaces

OpenZeppelin defines the necessary Smart Contract Interfaces:

1. [IERC-1155](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v5.0.2/contracts/token/ERC1155/IERC1155.sol)
1. [IERC-1155 Metadata URI](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v5.0.2/contracts/token/ERC1155/extensions/IERC1155MetadataURI.sol)
1. [IERC-165](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v5.0.2/contracts/utils/introspection/IERC165.sol)

which define all the Events and Functions as per the [ERC-1155 Ethereum Specification](https://eips.ethereum.org/EIPS/eip-1155).

This means, that we could go with something like this for our Smart Contract interface:

![Interface Inheritance for our contract](../../../../../images/builder-card-smart-contract/ibuilder-card-interface-inheritance.png)

or in Solidity code, something like this:

```solidity
interface IBuilderCard is IERC1155, IERC1155MetadataURI, IERC165 {
    ...
}
```

But, if one looks carefully at OpenZeppelin [IERC1155MetadataURI](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v5.0.2/contracts/token/ERC1155/extensions/IERC1155MetadataURI.sol), we can see that it derives from the `IERC1155`. And if we look at [IERC1155]
(https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v5.0.2/contracts/token/ERC1155/IERC1155.sol), we will see that it derives from the `IERC165`.

Hence, this would be enough:

![Our contract deriving only from the IERC 1155 Metadata URI interface](../../../../../images/builder-card-smart-contract/ibuilder-card-deriving-only-from-ierc1155metadatauri.png).

or in Solidity:

```solidity
interface IBuilderCard is IERC1155MetadataURI {
    ...
}
```

### OpenZeppelin Abstract Implementations

So far so good with the interfaces that OpenZeppelin offers to us. But, we will have to do the actual implementation, won't we?

```solidity
contract BuilderCard is IBuilderCard {
    ...
}
```

Any such implementation of `BuilderCard` like that will have to provide implementation for all the functions specified in the `IBuilderCard` interface as well as for all the functions specified in the interfaces this interface derives from.

Here is where we ask for OpenZeppelin help again.

OpenZeppelin already provides a _half_-baked implementation of the `IERC1155` specification. It is their [ERC1155](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v5.0.2/contracts/token/ERC1155/ERC1155.sol) abstract contract.

So, if we just derive from this abstract contract we have all the functions of `ERC1155` ready.

```solidity
contract BuilderCard is ERC1155 {
    constructor(string memory uri_) ERC1155(uri_) {}
}
```

Note: the `constructor` needs to take as input the URI that will be pointing to metadata for a Builder Card. We will come to this a little later.

The problem with the above, is that the `BuilderCard` contract does not support the `collect()` function and the `CardCollected` event.

Hence, the only way to go with is the following:

![Our contract derives from `ERC1155` and `IBuilderCard`](../../../../../images/builder-card-smart-contract/builder-contract-derives-from-oz-erc1155.png)

**The `IBuilderCard` interface**

```solidity
interface IBuilderCard {
    /**
     * @notice It is emitted when a Builder Card is actually collected.
     * @param _builder It is the Builder address/wallet the Card was collected for
     * @param _collector It is the address of the collector
     */
    event CardCollected(address indexed _builder, address indexed _collector);

    /**
     * @notice Mints/Creates an instance of the Builder Card for the Builder with address `_builder`. This instance is
     * attached to the `msg.sender`. Hence, the `msg.sender` is considered to be
     * the Collector of the Builder Card for the Builder given.
     * Also, it rewards the parties involved and pays fee to the platform hosting
     * the Builder Cards web application. Here is how reward is working:
     * - Builder is getting `BuilderCardBase->BUILDER_REWARD`.
     * - If the `msg.sender` is the first collector of the particular Builder Card,
     * they are being rewarded `BuilderCardBase->FIRST_COLLECTOR_REWARD`.
     * - Platform gets the rest, i.e. `TOTAL_COLLECTION_FEE - FIRST_COLLECTOR_REWARD(if they have been rewarded) - BUILDER_REWARD`.
     * Note, that the `msg.value` of the transaction needs to be (at least) `TOTAL_COLLECTION_FEE`. Otherwise,
     * the call will be reverted.
     * @dev
     * MUST revert, if the `msg.value` sent with this transaction is not enough to cover at least
     * for the `BuilderCardBase->TOTAL_COLLECTION_FEE`.
     * MUST NOT revert, if the collector (`msg.sender`) has already collected the given Builder
     * Card. It should just ignore and not emit the `CardCollected` event.
     * MUST emit the event `CardCollected` with `_builder` the given `_builder` and `_collector` the
     * `msg.sender`.
     * @param _builder the unique Builder identifier whose Card is collected.
     */
    function collect(address _builder) external;
}
```

**The `BuilderCard` contract**

```solidity
contract BuilderCard is ERC1155, IBuilderCard {
    constructor(string memory uri_) ERC1155(uri_) {}

    function collect(address _builder) public {
        ...
    }
}
```

### Minting/Creating Builder Cards

The `ERC1155` does not offer an implementation of a public function that will allow us to mint/create Builder Cards. This is expected, because OpenZeppelin cannot know how we want Builder Cards to be minted.

So, we have to implement the `function collect()` as we have already said.

As we have already explained at the beginning, this `collect()` function needs to do much more than mint.
It has some finance-related actions to take.

We have written the requirements of this function using BDD approach. I.e. we create the specifications as specs.

Here is an example spec for one of the requirements that our `collect()` needs to cover:

*Note:* We are using [Hardhat](https://hardhat.org/) and [Ethers](https://docs.ethers.org/v6/) for our development:

```javascript
describe("#collect", function () {
  it("collector balance on input builder is increased by 1", async function () {
    // First we deploy the contract using fixtures
    const {
      builderCard,
      accountA: collectorAccount,
      accountB: builderAccount,
    } = await loadFixture(deployBuilderCardFixture);

    // Then we get the token id for the given builder account address
    // In other words, this is the token id of the NFT. Note that we just
    // convert the builder account hex address to its equivalent uint256
    // integer.
    const builderAccountTokenId = ethers.toBigInt(builderAccount.address);

    // We calculate the current number of tokens the collector has.
    const previousNumberOfTokens = await builderCard.balanceOf(
      collectorAccount.address,
      builderAccountTokenId
    );

    // We will need some Wei to fund the transaction
    const weiForValue = hre.ethers.parseEther("100");

    // fire. We +collect+ (mint)
    await builderCard
      .connect(collectorAccount)
      .collect(builderAccount.address);

    // We calculate again, the number of tokens the collector has.
    const numberOfTokens = await builderCard.balanceOf(
      collectorAccount.address,
      builderAccountTokenId
    );


    // It needs to be equal to the previous number of tokens + 1.
    expect(numberOfTokens).to.equal(previousNumberOfTokens + BigInt("1"));
  });
});
```

*Note:* We are not going into too much detail here about how Harthat and Ethers work
together, or how we set up the fixtures. We provide a link to the whole source code
for those who are interested.

The comments in the code make it quite clear what is happening in this simple requirement.
The collector needs to get a token at the end of the `collect()` call.

If we run this with the current version of our `collect()`, which is empty, the test will fail.

Here is a first implementation:

```solidity
contract BuilderCard is ERC1155, IBuilderCard {
    constructor(string memory uri_) ERC1155(uri_) {}

    function collect(address _builder) public {
        uint256 _tokenId = _builderIdFromAddress(_builder);
        _mint(msg.sender, _tokenId, 1, "");
    }

    function _builderIdFromAddress(
        address _builder
    ) internal pure returns (uint256) {
        return uint256(uint160(_builder));
    }
}
```

This is pretty simple and relies on the function `_mint()` already provided to us by OpenZeppelin `ERC1155`.

1. It converts the builder address (`_builder`) to an integer (`_tokenId`), and
2. uses this integer to mint/create a new token for the collector (`msg.sender`)

### Number of Collections for a Builder Card - or Total Supply for a Builder Card

That's a very interesting question. We will need to answer how many times a specific builder card
has been collected. This is equivalent to the total number of mints/creations that have been executed
for a given builder card.

That was not part of our initial requirement. Let's enhance our `IBuilderCard` interface:

```solidity
interface IBuilderCard {
    ...
    /**
     * @notice It returns the number of times a builder card has been collected.
     * @param _builder the unique builder identifier whose card is collected
     * @return _numberOfCollections a +uint256+ which is the number of collections for the given builder.
     */
    function balanceFor(address _builder) external view returns(uint256 _numberOfCollections);
}
```

Here is a spec that describes the behaviour of the function:

```javascript
describe("#balanceFor a builder card", function () {
  it("returns the number of collections for a builder address", async function () {
    const {
        builderCard,
        accountA: collectorAccount,
        accountB: otherCollector,
        accountC: builderAccount,
      } = await loadFixture(deployBuilderCardFixture);

      // collect once
      await builderCard
        .connect(collectorAccount)
        .collect(builderAccount.address);

      // fire 1: check number of collections to be 1
      let numberOfCollections = await builderCard["balanceFor(address)"](
        builderAccount.address
      );

      expect(numberOfCollections).to.equal(BigInt("1"));

      // collect second time
      await builderCard.connect(otherCollector).collect(builderAccount.address);

      // fire 2: check number of collections to be 2
      numberOfCollections = await builderCard["balanceFor(address)"](
        builderAccount.address
      );

      expect(numberOfCollections).to.equal(BigInt("2"));

      // check number of collections for another builder to be 0
      const otherAccountNumberOfCollections = await builderCard[
        "balanceFor(address)"
      ](collectorAccount.address);

      expect(otherAccountNumberOfCollections).to.equal(BigInt("0"));
  });
});
```

Read the comments. It is quite straightforward. Every time we collect, the
total supply in circulation for the given token should be increased.

And here is how we amend our contract to support this function. Please, note that ERC1155 doesn't support this functionality, hence we amend our `BuilderCard`
contract to support it as needed.

*Note: We have an improvement immediately after*

```solidity
contract BuilderCard is ERC1155, IBuilderCard {
    mapping(uint256 _id => uint256 _numberOfCollectionsForId) private _collections;

    constructor(string memory uri_) ERC1155(uri_) {}

    function collect(address _builder) public {
        uint256 _tokenId = _builderIdFromAddress(_builder);
        _mint(msg.sender, _tokenId, 1, "");

        _collections[_tokenId] += 1;
    }

    function balanceFor(
        address _builder
    ) external view returns (uint256) {
        uint256 _tokenId = _builderIdFromAddress(_builder);
        return _collections[_tokenId];
    }

    function _builderIdFromAddress(
        address _builder
    ) internal pure returns (uint256) {
        return uint256(uint160(_builder));
    }
}
```

1. We added the state `_collections` that will keep count of the collections per token, and
1. We added `_collections[_tokenId] += 1` to increase the number of collections for the token collected.
1. The function implementation converts the given `_builder` to `_tokenId` and returns the value
in `_collections` that corresponds to the `_tokenId`.

Pretty simple. Isn't it?

#### Rely on `ERC1155Supply`

It is, but we also think that this is pretty much a _standard_ need, which is probably already
implemented, somehow, by OpenZeppelin.

Let's have a look at the abstract contract [ERC1155Supply](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC1155/extensions/ERC1155Supply.sol) offered by OpenZeppelin:

The `ERC1155Supply` abstract contract derives from `ERC1155`:

```solidity
abstract contract ERC1155Supply is ERC1155 {
    ...
}
```

which means that it offers all the functionality that `ERC1155` offers too.

On top of that, it keeps track of the _total supply_ of a token.

```solidity
function totalSupply(uint256 id) public view virtual returns (uint256)
```

Hence, it can keep track of the _total supply_ or _balanceFor()_ our Builder Cards.

We only have to derive from `ERC1155Supply` (rather than from `ERC155`) and implement
`_balanceFor()_` with the help of `totalSupply()`.

![Our Contract Deriving from ERC1155Supply](../../../../../images/builder-card-smart-contract/builder-cards.deriving-from-erc1155supply.png)

Here is how the implementation changes accordingly:

```solidity
contract BuilderCard is ERC1155Supply, IBuilderCard {
    constructor(string memory uri_) ERC1155(uri_) {}

    function collect(address _builder) public {
        uint256 _tokenId = _builderIdFromAddress(_builder);
        _mint(msg.sender, _tokenId, 1, "");
    }

    function balanceFor(
        address _builder
    ) external view returns (uint256) {
        uint256 _tokenId = _builderIdFromAddress(_builder);
        return totalSupply(_tokenId);
    }

    function _builderIdFromAddress(
        address _builder
    ) internal pure returns (uint256) {
        return uint256(uint160(_builder));
    }
}
```

As you can see, we no longer need the state variable `_collections`.

This implementation satisfies the specs and makes the corresponding tests pass.

### Number of Collections for All Builder Cards Together - or Total Supply

But, what if we wanted to know the total number of collections for all of our builders.
We could, of course, iterate over all of our builders on the client side and call the function
`balanceFor(address)` for each one of them and sum the results. But this would have been
quite inefficient in terms of time, if we had many builders.

It may be better if we could get this information directly from our smart contract:

```solidity
interface IBuilderCard {
    ...
    /**
     * @return the total collections
     */
    function balanceFor()
        external
        view
        returns (uint256);
}
```

Let's write the specification for this:

```javascript
describe("#balanceFor", function () {
  it("returns the sum of balances for all builders together", async function () {
    const {
      builderCard,
      accountA: collectorAccount,
      accountB: otherCollector,
      accountC: builderAccount,
    } = await loadFixture(deployBuilderCardFixture);

    const secondBuilderAccount = hre.ethers.Wallet.createRandom();

    // collect once
    await builderCard
      .connect(collectorAccount)
      .collect(builderAccount.address);

    // fire 1: check balance to be 1
    let balance = await builderCard["balanceFor()"]();

    expect(balance).to.equal(BigInt("1"));

    // collect second time
    await builderCard.connect(otherCollector).collect(builderAccount);

    // fire 2: check balance to be 2
    balance = await builderCard["balanceFor()"]();

    expect(balance).to.equal(BigInt("2"));

    // collect first time second builder
    await builderCard.connect(otherCollector).collect(secondBuilderAccount);

    // fire 3: check balance to be 3
    balance = await builderCard["balanceFor()"]();

    expect(balance).to.equal(BigInt("3"));
  });
});
```

The implementation needs the following new version of our contract:

```solidity
contract BuilderCard is ERC1155Supply, IBuilderCard {
    constructor(string memory uri_) ERC1155(uri_) {}

    function collect(address _builder) public {
        uint256 _tokenId = _builderIdFromAddress(_builder);
        _mint(msg.sender, _tokenId, 1, "");
    }

    function balanceFor(
        address _builder
    ) external view returns (uint256) {
        uint256 _tokenId = _builderIdFromAddress(_builder);
        return totalSupply(_tokenId);
    }

    function balanceFor() external view returns (uint256) {
        return totalSupply();
    }

    function _builderIdFromAddress(
        address _builder
    ) internal pure returns (uint256) {
        return uint256(uint160(_builder));
    }
}
```

As you can see, our `balanceFor()` doesn't have any implementation other than delegating the
call to the `ERC1155Supply` extension which already implements the function `totalSupply()`.

If we run the specs with the above implementation, all tests are passing successfully.

### Number of Times a Collector Has Collected a Builder Card - Balance Case 1

What if we have a given Builder Card and we want to get the number of times it has been
collected by a specific Collector?

This question is already answered by the `ERC-1155` standard. It is the function:

```solidity
function balanceOf(address _owner, uint256 _id) external view returns (uint256);
```

The only problem we see here is that the standard function takes as input the `uint256 _id` representing
the token. In our case, we need to pass the Builder address.

For that reason, we may want to expose another function like this:

```solidity
interface IBuilderCard {
    ...
    /**
     * @notice It returns the number of times a collector has collected a
     * BuilderCard. It wraps the +balanceOf+ ERC-1155 standard function that
     * takes as input the token as +uint256+.
     * @param _owner the address that owns the Builder Cards, i.e. the tokens
     * @param _builder the address representing the Builder Card
     */
    function balanceOf(
        address _owner,
        address _builder
    ) external view returns (uint256);
}
```

There is also another functional requirement here. This function should return either `0`, or `1`.
This is because we don't allow a Builder Card to be collected more than once.

Let's write the specs for this function:

```javascript
describe("#balanceOf collector for builder address", function () {
  it("returns the number of collections a collector has for a specific builder card", async function () {
    const {
      builderCard,
      accountA: collectorAccount,
      accountB: builderAccount,
    } = await loadFixture(deployBuilderCardFixture);

    // initially, it should be 0

    let balance = await builderCard["balanceOf(address, address)"](
      collectorAccount.address,
      builderAccount.address
    );

    expect(balance).to.equal(BigInt("0"));

    // we collect once

    await builderCard
      .connect(collectorAccount)
      .collect(builderAccount.address);

    balance = await builderCard["balanceOf(address, address)"](
      collectorAccount.address,
      builderAccount.address
    );

    expect(balance).to.equal(BigInt("1"));

    // we collect once more.
    await builderCard
      .connect(collectorAccount)
      .collect(builderAccount.address);

    balance = await builderCard["balanceOf(address, address)"](
      collectorAccount.address,
      builderAccount.address
    );

    // It should remain 1, because we don't allow
    // collector to collect a Builder Card more than once.
    expect(balance).to.equal(BigInt("1"));
  });
});
```

With this specification in place, we can implement this function as follows:

```solidity
contract BuilderCard is ERC1155, IBuilderCard {
    constructor(string memory uri_) ERC1155(uri_) {}

    function collect(address _builder) public {
        uint256 _tokenId = _builderIdFromAddress(_builder);
        if (balanceOf(msg.sender, _tokenId) == 0) {
            _mint(msg.sender, _tokenId, 1, "");
        }
    }

    function balanceFor(address _builder) external view returns (uint256) {
        uint256 _tokenId = _builderIdFromAddress(_builder);
        return totalSupply(_tokenId);
    }

    function balanceFor() external view returns (uint256) {
        return totalSupply();
    }

    function balanceOf(
        address _owner,
        address _builder
    ) external view returns (uint256) {
        uint256 tokenId = _builderIdFromAddress(_builder);
        return balanceOf(_owner, tokenId);
    }

    function _builderIdFromAddress(
        address _builder
    ) internal pure returns (uint256) {
        return uint256(uint160(_builder));
    }
}
```

1. The `function balanceOf(address _owner, address _builder)` implementation is quite
simple. It just delegates to the ERC-1155 standard function.
1. But, the `collect()` has been changed to make sure that a collector collects a
Builder Card only once. Look at the `if (balanceOf(msg.sender, _tokenId) == 0) {`. This makes
sure that minting/creation is only done if the collector does not have the token/Builder Card already.

### Number of Times a Collector Has Collected Any Builder Card - Balance Case 2

But, what if we want to know how many Builder Cards a collector has collected?

Let's see its interface:

```solidity
interface IBuilderCard {
    ...
    /**
     * @notice It returns the number of Builder Cards a specific collector
     * has collected so far.
     * @param _owner the address whose collections we want to count
     * @return 0 or more, depending on how many Builder Cards the specific
     * owner/collector has collected.
     */
    function balanceOf(address _owner) external view returns (uint256);
}
```

Let's write the specs for this function:

```javascript
describe("#balanceOf collector for any builder card", function () {
  it("returns the number of builder cards an owner owns", async function () {
    const {
      builderCard,
      accountA: collectorAccount,
      accountB: builderAccount,
      accountC: otherCollector,
    } = await loadFixture(deployBuilderCardFixture);

    const secondBuilderAccount = hre.ethers.Wallet.createRandom();

    // +collectorAccount+ collects once
    await builderCard
      .connect(collectorAccount)
      .collect(builderAccount.address);

    // +otherCollector+ collects once
    await builderCard.connect(otherCollector).collect(builderAccount.address);

    // +collectorAccount+ collects twice
    await builderCard
      .connect(collectorAccount)
      .collect(secondBuilderAccount.address);

    // fire
    let balance = await builderCard["balanceOf(address)"](
    collectorAccount
    );

    expect(balance).to.equal(BigInt("2"));

    balance = await builderCard["balanceOf(address)"](
    otherCollector
    );

    expect(balance).to.equal(BigInt("1"));
  });
});
```

The specs are quite simple again.

This function is not supported by the ERC-1155 standard. Neither from the extension `ERC1155Supply`. We will have to implement it on our own.

One could scan all the tokens or all the builder cards and call the `balanceOf(owner, id)` and sum up
the results. But this wouldn't be efficient if tokens were many.

The implementation we are suggesting is the following:

```solidity
contract BuilderCard is ERC1155, IBuilderCard {
    mapping(address _owner => uint256 _balanceOfOwner) private _balancesOfOwners;

    constructor(string memory uri_) ERC1155(uri_) {}

    function collect(address _builder) public {
        uint256 _tokenId = _builderIdFromAddress(_builder);
        if (balanceOf(msg.sender, _tokenId) == 0) {
            _mint(msg.sender, _tokenId, 1, "");

            _balancesOfOwners[msg.sender] += 1;
        }
    }

    function balanceFor(address _builder) external view returns (uint256) {
        uint256 _tokenId = _builderIdFromAddress(_builder);
        return totalSupply(_tokenId);
    }

    function balanceFor() external view returns (uint256) {
        return totalSupply();
    }

    function balanceOf(
        address _owner,
        address _builder
    ) external view returns (uint256) {
        uint256 tokenId = _builderIdFromAddress(_builder);
        return balanceOf(_owner, tokenId);
    }

    // ------------------ internal --------------------------

    function _builderIdFromAddress(
        address _builder
    ) internal pure returns (uint256) {
        return uint256(uint160(_builder));
    }
}
```

As you can see:

1. We have introduced the state variable `_balancesOfOwners` which will keep a counter
increasing by 1, every time an owner collects a new Builder Card.
1. The balance is increased inside the `collect()` function.

And this implementation makes the tests pass.

#### Transfers

But it has a limitation.

What happens when a Builder Card is transferred from one collector to another. We need to
remember that we rely on the `ERC155` OpenZeppelin implementation and that our Smart Contract
is ERC-1155 compatible. This means it allows functions like this to be called:
   ```solidity
   safeTransferFrom("0x1234", "0xABCD", 1987, 1, "");
   ```
   This affects the balance of both `0x1234` and `0xABCD` address, both on the specific
   token `1987` and their total balance (total number of collections). The former case, i.e. the balance on the specific token, is already taken care by the `ERC1155` implementation. But the latter case, i.e. the balance on any token is not.

First, we will deal with the 2nd problem, i.e. of the `safeTransferFrom()`.

Let's enhance our specs to cover for the _transfer from_ case:

```javascript
describe("#balanceOf collector for any builder card", function () {
  it("returns the number of builder cards an owner owns", async function () {

    ...

    // ----- Cover for the safeTransferFrom case ----------------------
    // collectorAccount transfers secondBuilder card to otherCollector

    const secondBuilderCardId = BigInt(secondBuilderAccount.address);
    const value = BigInt("1");

    await builderCard
      .connect(collectorAccount)
      ["safeTransferFrom(address,address,uint256,uint256,bytes)"](
        collectorAccount,
        otherCollector,
        secondBuilderCardId,
        value,
        "0x"
      );

    balance = await builderCard["balanceOf(address)"](collectorAccount);

    expect(balance).to.equal(BigInt("1")); // previously was 2

    balance = await builderCard["balanceOf(address)"](otherCollector);

    expect(balance).to.equal(BigInt("2")); // previously was 1
  });
});
```

The line:

```javascript
// ----- Cover for the safeTransferFrom case ----------------------
```

marks the start of the part of the test that involves the `safeTransferFrom()`.

If we run this test with the current implementation of our Smart Contract, it will fail.

Here is how we have to change our contract to support this case:

```solidity
contract BuilderCard is ERC1155, IBuilderCard {
    mapping(address _owner => uint256 _balanceOfOwner) private _balancesOfOwners;

    constructor(string memory uri_) ERC1155(uri_) {}

    function collect(address _builder) public {
        uint256 _tokenId = _builderIdFromAddress(_builder);
        if (balanceOf(msg.sender, _tokenId) == 0) {
            _mint(msg.sender, _tokenId, 1, "");

            _balancesOfOwners[msg.sender] += 1;
        }
    }

    function balanceFor(address _builder) external view returns (uint256) {
        uint256 _tokenId = _builderIdFromAddress(_builder);
        return totalSupply(_tokenId);
    }

    function balanceFor() external view returns (uint256) {
        return totalSupply();
    }

    function balanceOf(
        address _owner,
        address _builder
    ) external view returns (uint256) {
        uint256 tokenId = _builderIdFromAddress(_builder);
        return balanceOf(_owner, tokenId);
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 id,
        uint256 value,
        bytes memory data
    ) public virtual override {
        super.safeTransferFrom(from, to, id, value, data);

        _balancesOfOwners[from] -= 1;
        _balancesOfOwners[to] += 1;
    }

    // ------------------ internal --------------------------

    function _builderIdFromAddress(
        address _builder
    ) internal pure returns (uint256) {
        return uint256(uint160(_builder));
    }
}
```

What we have done? We have overridden the `ERC1155` implementation of `safeTransferFrom()`.
We now provide an implementation that relies on the `ERC1155` implementation, but, on top of that,
it makes sure it updates the state of the `_balancesOfOwners` accordingly.

This implementation makes our tests pass.

But, what if someone calls the other public function that does transfers:

```solidity
function safeBatchTransferFrom(
    address from,
        address to,
        uint256[] memory ids,
        uint256[] memory values,
        bytes memory data
    ) public virtual
```

Let's enhance our tests to cover for this case too.

```javascript
describe("#balanceOf collector for any builder card", function () {
  it("returns the number of builder cards an owner owns", async function () {

    ...

    // otherCollector transfers secondBuilder card back to collectorAccount
    // using the safeBatchTransferFrom
    await builderCard
      .connect(otherCollector)
      ["safeBatchTransferFrom(address,address,uint256[],uint256[],bytes)"](
        otherCollector,
        collectorAccount,
        [secondBuilderCardId],
        [value],
        "0x"
      );

    balance = await builderCard["balanceOf(address)"](otherCollector);

    expect(balance).to.equal(BigInt("1")); // previously was 2

    balance = await builderCard["balanceOf(address)"](collectorAccount);

    expect(balance).to.equal(BigInt("2")); // previously was 1
  });
});
```

This test is going to fail, unless we override the `safeBatchTransferFrom()` too:

```solidity
contract BuilderCard is ERC1155, IBuilderCard {
    mapping(address _owner => uint256 _balanceOfOwner) private _balancesOfOwners;

    constructor(string memory uri_) ERC1155(uri_) {}

    function collect(address _builder) public {
        uint256 _tokenId = _builderIdFromAddress(_builder);
        if (balanceOf(msg.sender, _tokenId) == 0) {
            _mint(msg.sender, _tokenId, 1, "");

            _balancesOfOwners[msg.sender] += 1;
        }
    }

    function balanceFor(address _builder) external view returns (uint256) {
        uint256 _tokenId = _builderIdFromAddress(_builder);
        return totalSupply(_tokenId);
    }

    function balanceFor() external view returns (uint256) {
        return totalSupply();
    }

    function balanceOf(
        address _owner,
        address _builder
    ) external view returns (uint256) {
        uint256 tokenId = _builderIdFromAddress(_builder);
        return balanceOf(_owner, tokenId);
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 id,
        uint256 value,
        bytes memory data
    ) public virtual override {
        super.safeTransferFrom(from, to, id, value, data);

        _balancesOfOwners[from] -= 1;
        _balancesOfOwners[to] += 1;
    }

    function safeBatchTransferFrom(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory values,
        bytes memory data
    ) public virtual override {
        super.safeBatchTransferFrom(from, to, ids, values, data);

        _balancesOfOwners[from] -= 1;
        _balancesOfOwners[to] += 1;
    }

    // ------------------ internal --------------------------

    function _builderIdFromAddress(
        address _builder
    ) internal pure returns (uint256) {
        return uint256(uint160(_builder));
    }
}
```

Fair enough. This works. And one could DRY things a little more with this:

```solidity
contract BuilderCard is ERC1155, IBuilderCard {
    mapping(address _owner => uint256 _balanceOfOwner) private _balancesOfOwners;

    constructor(string memory uri_) ERC1155(uri_) {}

    function collect(address _builder) public {
        uint256 _tokenId = _builderIdFromAddress(_builder);
        if (balanceOf(msg.sender, _tokenId) == 0) {
            _mint(msg.sender, _tokenId, 1, "");

            _balancesOfOwners[msg.sender] += 1;
        }
    }

    function balanceFor(address _builder) external view returns (uint256) {
        uint256 _tokenId = _builderIdFromAddress(_builder);
        return totalSupply(_tokenId);
    }

    function balanceFor() external view returns (uint256) {
        return totalSupply();
    }

    function balanceOf(
        address _owner,
        address _builder
    ) external view returns (uint256) {
        uint256 tokenId = _builderIdFromAddress(_builder);
        return balanceOf(_owner, tokenId);
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 id,
        uint256 value,
        bytes memory data
    ) public virtual override {
        super.safeTransferFrom(from, to, id, value, data);

        _adjustBalancesOfOwners(from, to, 1);
    }

    function safeBatchTransferFrom(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory values,
        bytes memory data
    ) public virtual override {
        super.safeBatchTransferFrom(from, to, ids, values, data);

        _adjustBalancesOfOwners(from, to, 1);
    }

    // ------------------ internal --------------------------

    function _builderIdFromAddress(
        address _builder
    ) internal pure returns (uint256) {
        return uint256(uint160(_builder));
    }

    function _adjustBalancesOfOwners(
        address _from,
        address _to,
        uint256 value
    ) internal {
        _balancesOfOwners[_from] -= value;
        _balancesOfOwners[_to] += value;
    }
}
```

This makes our test succeed and we have also eliminated some duplication.

#### Overriding `_update()`

But the point is that we had to override two `ERC1155` functions to make transfers work the way we
wanted.

`ERC1155` is suggesting that we override the `_update()` internal function instead. This is called
by both transfer functions. Hence, overriding only one function will bring the same result. Also,
the `_update()` function is called by the `_mint()` function. Hence, overriding the `_update()` will
eliminate the setting of the `_balancesOfOwners` inside the `collect()` function.

Let's do that:

```solidity
contract BuilderCard is ERC1155, IBuilderCard {
    mapping(address _owner => uint256 _balanceOfOwner) private _balancesOfOwners;

    constructor(string memory uri_) ERC1155(uri_) {}

    function collect(address _builder) public {
        uint256 _tokenId = _builderIdFromAddress(_builder);
        if (balanceOf(msg.sender, _tokenId) == 0) {
            _mint(msg.sender, _tokenId, 1, "");
        }
    }

    function balanceFor(address _builder) external view returns (uint256) {
        uint256 _tokenId = _builderIdFromAddress(_builder);
        return totalSupply(_tokenId);
    }

    function balanceFor() external view returns (uint256) {
        return totalSupply();
    }

    function balanceOf(
        address _owner,
        address _builder
    ) external view returns (uint256) {
        uint256 tokenId = _builderIdFromAddress(_builder);
        return balanceOf(_owner, tokenId);
    }

    // ------------------ internal --------------------------

    function _builderIdFromAddress(
        address _builder
    ) internal pure returns (uint256) {
        return uint256(uint160(_builder));
    }

    function _update(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory values
    ) internal virtual override {
        super._update(from, to, ids, values);

        if (to == address(0) && from == address(0)) {
            return;
        }

        uint256 sumOfValues;
        uint256 valuesLength = values.length;

        for (uint256 i = 0; i < valuesLength; i++) {
            sumOfValues += values[i];
        }

        if (to != address(0)) {
            _balancesOfOwners[to] += sumOfValues;
        }

        if (from != address(0)) {
            _balancesOfOwners[from] -= sumOfValues;
        }
    }
}
```

Look how we have overridden the `_update()` `_internal` function. Note that we don't do
anything if both `to` and `from` addressing are not referring to a valid address.
Otherwise, we increase the corresponding `_balancesOfOwners[...]` by the sum of the values
of the tokens being transferred to/from.

Note also, how we have removed the line that updated the `_balancesOfOwners` inside the
`collect()` function. It is not needed any more.

### Preventing Multiple Collections of same Builder Card from same Collector

Which takes us to another use case that we need to cover. Since `ERC-1155` exposes the functions

```solidity
function safeTransferFrom(...)
function safeBatchTransferFrom(...)
```

we have the risk that someone calls these to send the same Builder Card to the same collector more than once.

Look at the following specs:

```javascript
it("prevents transferring the same builder card to the same collector more than once", async function () {
    // collector A collects B1
    // collector B collects B1
    // collector A transfers B1 to collector C
    // collector B transfers B1 to collector C. This will revert
    // collector A transfers B1 to collector B. This will revert
    const {
        builderCard,
        accountA: collectorA,
        accountB: b1,
        accountC: collectorB,
        accountD: collectorC,
        accountE: collectorD,
    } = await loadFixture(deployBuilderCardFixture);

    await builderCard
      .connect(collectorA)
      .collect(b1, { value: COLLECTION_FEE_IN_WEI });

    await builderCard
      .connect(collectorB)
      .collect(b1, { value: COLLECTION_FEE_IN_WEI });

    const b1Id = BigInt(b1.address);

    await builderCard
      .connect(collectorA)
      ["safeTransferFrom(address,address,uint256,uint256,bytes)"](
        collectorA,
        collectorC,
        b1Id,
        BigInt("1"),
        "0x"
    );

    await expect(
      builderCard
        .connect(collectorB)
        ["safeTransferFrom(address,address,uint256,uint256,bytes)"](
        collectorB,
        collectorC,
        b1Id,
        BigInt("1"),
        "0x"
        )
    ).to.be.revertedWithCustomError(
      builderCard,
      "RecipientAlreadyCollectorOfBuilderCard"
    );

    let balance = await builderCard["balanceOf(address,address)"](
      collectorC,
      b1
    );

    expect(balance).to.equal(BigInt("1"));

    await expect(
      builderCard
        .connect(collectorA)
        ["safeTransferFrom(address,address,uint256,uint256,bytes)"](
        collectorA,
        collectorB,
        b1Id,
        BigInt("1"),
        "0x"
        )
    ).to.be.revertedWithCustomError(
      builderCard,
      "RecipientAlreadyCollectorOfBuilderCard"
    );

    balance = await builderCard["balanceOf(address,address)"](collectorB, b1);

    expect(balance).to.equal(BigInt("1"));
});
```

With the current implementation of our contract these tests will fail. Let's change it to make them pass. The change will be in the `_update()` function:

```solidity
function _update(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory values
) internal virtual override {
    uint256 valuesLength = values.length;

    // check that recipient is not already a collector
    // -----------------------------------------------
    if (to != address(0)) {
        for (uint256 i = 0; i < valuesLength; i++) {
            if (balanceOf(to, ids[i]) > 0) {
                revert RecipientAlreadyCollectorOfBuilderCard();
            }
        }
    }

    super._update(from, to, ids, values);

    if (to == address(0) && from == address(0)) {
        return;
    }

    // update balance of owners
    // ------------------------
    uint256 sumOfValues;

    for (uint256 i = 0; i < valuesLength; i++) {
        sumOfValues += values[i];
    }

    if (to != address(0)) {
        _balancesOfOwners[to] += sumOfValues;
    }

    if (from != address(0)) {
        _balancesOfOwners[from] -= sumOfValues;
    }
}
```

The block that makes the difference it this:

```solidity

// check that recipient is not already a collector
// -----------------------------------------------
if (to != address(0)) {
    for (uint256 i = 0; i < valuesLength; i++) {
        if (balanceOf(to, ids[i]) > 0) {
            revert RecipientAlreadyCollectorOfBuilderCard();
        }
    }
}
```

It's pretty simple. It is a check that needs to be done before the super `_update()` call.

If we do this, all the tests are now passing again.

### Financials

Initially, we said that we want our Smart Contract to deal with financial rewards. Let's recap the
requirements:

- There is a total fee required to collect. Let's call it `COLLECTION_FEE`.
- Builder is getting a reward. Let's call it `BUILDER_REWARD`.
- The first collector is getting a reward. Let's call it `FIRST_COLLECTOR_REWARD`.
- Platform gets the rest, i.e. `COLLECTION_FEE - FIRST_COLLECTOR_REWARD(if they have been rewarded) - BUILDER_REWARD`.

We need to implement this reward logic, inside our `collect()` function.

#### Set Constants At Contract Level

Initially, we will _hard code_ the reward values. Here it is how.

```solidity
contract BuilderCard is ERC1155Supply, IBuilderCard {
    uint256 public constant COLLECTION_FEE = 0.001 ether;
    uint256 public constant BUILDER_REWARD = 0.0005 ether;
    uint256 public constant FIRST_COLLECTOR_REWARD = 0.0003 ether;

    ...
}
```

#### Collection Fee Requirement

This is the first case we are going to test. The ether value given for collection should be
equal to the `COLLECTION_FEE`. Otherwise, the transaction would fail.

Let's amend our specs for this case.

```javascript
describe("finances", function () {
    const COLLECTION_FEE_IN_WEI = ethers.parseEther("0.001");

    context(
      "when ether value passed is less than the collection fee required",
      function () {
        const value = ethers.parseEther("0.0");

        it("reverts with the error about the collection fee requirement", async function () {
        const { builderCard, accountA: builderAccountToCollect } =
            await loadFixture(deployBuilderCardFixture);

        // fire

        await expect(
            builderCard.collect(builderAccountToCollect, { value })
        )
            .to.be.revertedWithCustomError(
            builderCard,
            "WrongValueForCollectionFee"
            )
            .withArgs(COLLECTION_FEE_IN_WEI, 0);
        });
      }
    );

    context(
      "when ether value passed is equal to the collection fee required",
      function () {
        const value = COLLECTION_FEE_IN_WEI;

        it("does not revert", async function () {
        const { builderCard, accountA: builderAccountToCollect } =
            await loadFixture(deployBuilderCardFixture);

        // fire

        await expect(
            builderCard.collect(builderAccountToCollect, { value })
        ).not.to.be.revertedWithCustomError(
            builderCard,
            "WrongValueForCollectionFee"
        );
        });
      }
    );

    context(
      "when ether value passed is greater than the collection fee required",
      function () {
        const value = ethers.parseEther("0.0011");

        it("reverts with the error about the collection fee requirement", async function () {
        const { builderCard, accountA: builderAccountToCollect } =
            await loadFixture(deployBuilderCardFixture);

        // fire

        await expect(
            builderCard.collect(builderAccountToCollect, { value })
        ).to.be.revertedWithCustomError(
            builderCard,
            "WrongValueForCollectionFee"
        );
        });
      }
    );
});
```

This is pretty straight-forward.

And how does the Smart Contract implementation change? This is how, in the `collect()` function:

```solidity
...
function collect(address _builder) public payable {
    if (msg.value != COLLECTION_FEE) {
        revert WrongValueForCollectionFee(COLLECTION_FEE, msg.value);
    }

    uint256 _tokenId = _builderIdFromAddress(_builder);
    if (balanceOf(msg.sender, _tokenId) == 0) {
        _mint(msg.sender, _tokenId, 1, "");
    }
}
...
```

The `WrongValueForCollectionFee` is registered as an `error` at the beginning of the contract:

```solidity
contract BuilderCard is ERC1155Supply, IBuilderCard {
    ...

    error WrongValueForCollectionFee(
        uint256 _required,
        uint256 _provided
    );

    ...
}
```

#### Correct Other Tests

Before we proceed to the rest of the finances cases, we will have to correct the previous tests
we had developed for `#collect()` function. Because, now, with the requirement for the collection fee,
they will fail. We need to amend the `#collect()` calls to send a collection fee.

Please, do.

#### Builder Gets Rewarded

Let's get to the second finance case. The builder reward.

These are the specs for this case:

```javascript
it("rewards the builder with 0.0005 ether", async function () {
    const {
        builderCard,
        accountA: builderAccountToCollect,
    } = await loadFixture(deployBuilderCardFixture);

    const balanceBefore = await ethers.provider.getBalance(
        builderAccountToCollect
    );

    // fire
    await builderCard.collect(builderAccountToCollect, {
        value: COLLECTION_FEE_IN_WEI,
    });

    const balanceAfter = await ethers.provider.getBalance(
        builderAccountToCollect
    );

    expect(balanceAfter).to.equal(balanceBefore + BUILDER_REWARD_IN_WEI);
});
```

In order to cover for this case, we have to make a change to our `collect()` function:

```solidity
...
function collect(address _builder) public payable {
    if (msg.value != COLLECTION_FEE) {
        revert WrongValueForCollectionFee(COLLECTION_FEE, msg.value);
    }

    uint256 _tokenId = _builderIdFromAddress(_builder);
    if (balanceOf(msg.sender, _tokenId) == 0) {
        _mint(msg.sender, _tokenId, 1, "");

        // Finances

        payable(_builder).transfer(BUILDER_REWARD);
    }
}
...
```

Look at the line: `payable(_builder).transfer(BUILDER_REWARD);` It is transferring the `BUILDER_REWARD`
to the `_builder` address.

**Important Note**: Where does this _money_ come from? It is coming from the Smart Contract balance. But how does
the Smart Contract have enough balance to fund this transfer? The balance of the Smart Contract is
increased by the `value` the `msg.sender` is sending when calling the `collect()` function. This `value`,
which we can access by the `msg.value` reference, is increasing the Smart Contract balance. Then Smart
Contract has enough money to fund the transfer. Note that, at the end of the `collect()`, whatever
value from the `msg.value` has not been consumed, it will remain as part of the balance of the Smart Contract,
unless we return it back to the `msg.sender`. We will come back to this later on.

#### First Collector Gets Rewarded

We want to reward the first collector of a Builder Card. Let's write some specs for it:

```javascript
context(
    "when collector is the first collector for the given builder card",
    function () {
        it("rewards the collector with 0.0003 ether", async function () {
            const {
                contractDeployer,
                builderCard,
                accountA: builderAccountToCollect,
            } = await loadFixture(deployBuilderCardFixture);

            const balanceBefore = await ethers.provider.getBalance(
                contractDeployer
            );

            // fire
            const trx = await builderCard
                .connect(contractDeployer)
                .collect(builderAccountToCollect, {
                value: COLLECTION_FEE_IN_WEI,
            });

            const receipt = await trx.wait();

            const transactionFee = calculateTransactionFee(receipt);

            const balanceAfter = await ethers.provider.getBalance(
                contractDeployer
            );

            expect(balanceAfter).to.equal(
                balanceBefore +
                FIRST_COLLECTOR_REWARD_IN_WEI -
                COLLECTION_FEE_IN_WEI -
                transactionFee
            );
        });
    }
);

context(
    "when collector is not the first collector of the particular builder card",
    function () {
        it("doesn't reward them with the first collector reward", async function () {
            const {
                contractDeployer,
                builderCard,
                accountA: builderAccountToCollect,
                accountB: otherCollector,
            } = await loadFixture(deployBuilderCardFixture);

            const balanceBefore = await ethers.provider.getBalance(
                otherCollector
            );

            let trx = await builderCard
                .connect(contractDeployer)
                .collect(builderAccountToCollect, {
                value: COLLECTION_FEE_IN_WEI,
            });

            await trx.wait();

            // fire OtherCollector collects the same builder card

            trx = await builderCard
                .connect(otherCollector)
                .collect(builderAccountToCollect, {
                value: COLLECTION_FEE_IN_WEI,
            });

            const receipt = await trx.wait();

            const transactionFee = calculateTransactionFee(receipt);

            const balanceAfter = await ethers.provider.getBalance(
                otherCollector
            );

            expect(balanceAfter).to.equal(
                balanceBefore - COLLECTION_FEE_IN_WEI - transactionFee
            );
        });
    }
);
```

Let's do the implementation to cover these requirements. Our `collect()` function is going to change
as follows:

```solidity
contract BuilderCard is ERC1155Supply, IBuilderCard {
    ...

    mapping(uint256 _id => address _firstCollector) private _firstCollectors;

    ...

    function collect(address _builder) public payable {
        if (msg.value != COLLECTION_FEE) {
            revert WrongValueForCollectionFee(COLLECTION_FEE, msg.value);
        }

        uint256 _tokenId = _builderIdFromAddress(_builder);
        if (balanceOf(msg.sender, _tokenId) == 0) {
            _mint(msg.sender, _tokenId, 1, "");

            // Finances

            payable(_builder).transfer(BUILDER_REWARD);

            if (_firstCollectors[_tokenId] == address(0)) {
                // this is the first collection for this token
                _firstCollectors[_tokenId] = msg.sender;

                payable(msg.sender).transfer(FIRST_COLLECTOR_REWARD);
            }
        }
    }

    ...
}
```

We have introduced the mapping `_firstCollectors` where we keep track of the first collector
address for each Builder Card. Hence, the `if (_firstCollectors[_tokenId] == address(0))` indicates
that we are collecting the particular Builder Card for the first time. So, we have to reward the collector,
who is the `msg.sender`.

This `if` block makes our specs pass.

#### Platform Gets Rewarded

Finally, platform gets rewarded with the remaining value.

Let's write the specs:

```javascript
context(
    "when collector is the first collector for the given builder card",
    function () {

        ...

        it("rewards the platform with 0.001 - 0.005 - 0.0003 which is 0.0002", async function () {
            const { builderCard, accountA: builderAccountToCollect } =
                await loadFixture(deployBuilderCardFixture);

            const balanceBefore = await ethers.provider.getBalance(builderCard);

            // fire
            await builderCard.collect(builderAccountToCollect, {
                value: COLLECTION_FEE_IN_WEI,
            });

            const balanceAfter = await ethers.provider.getBalance(builderCard);

            expect(balanceAfter).to.equal(
                balanceBefore +
                (COLLECTION_FEE_IN_WEI -
                    BUILDER_REWARD_IN_WEI -
                    FIRST_COLLECTOR_REWARD_IN_WEI)
            );
        });
    }
);

context(
    "when collector is not the first collector of the particular builder card",
    function () {

        ...

        it("rewards the platform with 0.001 - 0.0005 which is 0.0005", async function () {
            const {
                contractDeployer,
                builderCard,
                accountA: builderAccountToCollect,
                accountB: otherCollector,
            } = await loadFixture(deployBuilderCardFixture);

            let trx = await builderCard.collect(builderAccountToCollect, {
                value: COLLECTION_FEE_IN_WEI,
            });

            await trx.wait();

            // fire OtherCollector collects the same builder card

            const balanceBefore = await ethers.provider.getBalance(builderCard);

            trx = await builderCard
                .connect(otherCollector)
                .collect(builderAccountToCollect, {
                value: COLLECTION_FEE_IN_WEI,
            });

            await trx.wait();

            const balanceAfter = await ethers.provider.getBalance(builderCard);

            expect(balanceAfter).to.equal(
                balanceBefore + (COLLECTION_FEE_IN_WEI - BUILDER_REWARD_IN_WEI)
            );
        });
    }
);
```

Note that the _platform_ is the actual Smart Contract. That's why the `balanceBefore` and `balanceAfter` is
calculated for `builderCard` variable, which represents the actual smart contract.

How do we have to change our `collect()` function to support this feature?

**We don't have to do anything**. The specs pass with current `collect()` implementation. This is because,
the `value` sent with the `collect()` transaction by the sender, is given to `_builder` and to first collector and the remaining goes to the Smart Contract by fact. This is how Ethereum payable transactions work.

#### Withdrawing Funds

Since _platform_ is the Smart Contract and it will be accumulating funds, how could we withdraw them?

We are going to expose a function that will be called `withdraw(uint256 _amount)` and that will only be
possible to be called by the _owner_ of the contract.

But who is the _owner_ of the contract. It is the _address_ that deploys the contract. We can register it
as part of the state of the contract in the implementation of the constructor:

##### Constructor To Register Owner Of Contract

```solidity
contract BuilderCard is ERC1155Supply, IBuilderCard {
    ...

    address private _contractOwner;

    ...

    constructor(string memory uri_) ERC1155(uri_) {
        _contractOwner = msg.sender;
    }
    ...
}
```

So, the deployer is registered as the `_owner` of the Smart Contract.

##### Function to Withdraw Funds

We now need a function to withdraw funds.

Let's write the specs:

```javascript
describe("#withDraw", function () {
  context("when called by a non-owner", function () {
    it("reverts with appropriate error", async function () {
        const { builderCard, accountA: otherAccount } = await loadFixture(
            deployBuilderCardFixture
        );

        const amountToWithDraw = ethers.parseEther("0.0001");

        // fire
        await expect(
            builderCard
            .connect(otherAccount)
            ["withDraw(uint256)"](amountToWithDraw)
        ).to.be.revertedWithCustomError(builderCard, "UnauthorizedCaller");
    });
  });

  context("when called by a the owner", function () {
    it("withdraws part of the accumulated funds", async function () {
        const {
            contractDeployer,
            builderCard,
            accountA: otherCollector,
            accountB: builderAccount,
            accountC: otherBuilderAccount,
        } = await loadFixture(deployBuilderCardFixture);

        // let's collect so that we put some value to the contract

        await builderCard
            .connect(otherCollector)
            .collect(builderAccount, { value: COLLECTION_FEE_IN_WEI });
        await builderCard
            .connect(otherCollector)
            .collect(otherBuilderAccount, { value: COLLECTION_FEE_IN_WEI });

        const amountToWithDraw = ethers.parseEther("0.0001");

        const balanceBeforeForContract = await ethers.provider.getBalance(
            builderCard
        );

        const balanceBeforeForOwner = await ethers.provider.getBalance(
            contractDeployer
        );

        // fire
        const trx = await builderCard["withDraw(uint256)"](amountToWithDraw);

        const receipt = await trx.wait();

        const transactionFee = calculateTransactionFee(receipt);

        const balanceAfterForContract = await ethers.provider.getBalance(
            builderCard
        );

        const balanceAfterForOwner = await ethers.provider.getBalance(
            contractDeployer
        );

        expect(balanceAfterForContract).to.equal(
            balanceBeforeForContract - amountToWithDraw
        );

        expect(balanceAfterForOwner).to.equal(
            balanceBeforeForOwner + amountToWithDraw - transactionFee
        );
    });

    context(
      "when amount to withdraw exceeds smart contract balance",
      function () {
        it("reverts with appropriate error", async function () {
            const {
                contractDeployer,
                builderCard,
                accountA: otherCollector,
                accountB: builderAccount,
                accountC: otherBuilderAccount,
            } = await loadFixture(deployBuilderCardFixture);

            const balanceBeforeForContract = await ethers.provider.getBalance(
                builderCard
            );

            const amountToWithDraw = balanceBeforeForContract + BigInt("1");

            // fire
            await expect(
                builderCard["withDraw(uint256)"](amountToWithDraw)
            ).to.be.revertedWithCustomError(
                builderCard,
                "InsufficientSmartContractBalance"
            );
        });
      }
    );
  });
});
```

The specifications are easy to understand. Note that if the `withDraw()` is not called by the
contract owner, it will revert. Also, it will revert if the amount requested is more than the
current balance of the Smart Contract.

Let's see how we can implement this:

First we amend the `IBuilderCard` interface:

```solidity
interface IBuilderCard {
    ...
    /**
     * @notice It withdraws an amount of eth from the smart contract and
     * sends it to the contract owner address. It should be called only
     * by the contract owner.
     * @param _amount the amount to withdraw
     */
    function withDraw(uint256 _amount) external;
}
```

And the implementation is like this:

```solidity
contract BuilderCard is ERC1155Supply, IBuilderCard {
    ...

    error UnauthorizedCaller();

    error InsufficientSmartContractBalance(
        uint256 _balance,
        uint256 _amountRequested
    );

    modifier onlyOwner() {
        if (msg.sender != _contractOwner) {
            revert UnauthorizedCaller();
        }
        _;
    }
    ...

    function withDraw(uint256 _amount) external onlyOwner {
        uint256 _contractBalance = address(this).balance;
        if (_contractBalance < _amount) {
            revert InsufficientSmartContractBalance(_contractBalance, _amount);
        }
        payable(_contractOwner).transfer(_amount);
    }
    ...
}
```

Look how we use the `modifier onlyOwner()` to revert if the call is not done by the contract owner.
Also, inside the `withDraw()` function, we are checking that the smart contract has enough balance,
before we transfer the amount requested for withdrawal.

#### Earnings

Another interesting view of the financials of our Smart Contract is to be able to get the earnings
of any party involved:

- Smart Contract, i.e. the Platform.
- A specific Collector.
- A specific Builder for their Builder Card.

We will expose a function named `earnings()` the interface of which will be:

```solidity
/**
*
* @param _account the account of which earnings are to be returned
*/
function earnings(address _account) external view returns (uint256);
```

Let's write some specs about this function:

```solidity
describe("#earnings", function () {
  it("returns the earnings for each party involved", async function () {
    const {
        builderCard,
        accountA: collectorAccount,
        accountB: builderAccount,
        accountC: otherBuilderAccount,
    } = await loadFixture(deployBuilderCardFixture);

    await builderCard
        .connect(collectorAccount)
        .collect(builderAccount, { value: COLLECTION_FEE_IN_WEI });

    // fire
    let earningsForCollector = await builderCard.earnings(collectorAccount);
    let earningsForBuilder = await builderCard.earnings(builderAccount);
    let earningsForPlatform = await builderCard.earnings(builderCard);

    expect(earningsForCollector).to.equal(hre.ethers.parseEther("0.0003"));
    expect(earningsForBuilder).to.equal(hre.ethers.parseEther("0.0005"));
    expect(earningsForPlatform).to.equal(hre.ethers.parseEther("0.0002"));

    // more collections earnings are accumulated

    await builderCard
        .connect(collectorAccount)
        .collect(otherBuilderAccount, { value: COLLECTION_FEE_IN_WEI });

    earningsForCollector = await builderCard.earnings(collectorAccount);
    earningsForBuilder = await builderCard.earnings(builderAccount);
    earningsForPlatform = await builderCard.earnings(builderCard);
    const earningsForOtherBuilderAccount = await builderCard.earnings(
        otherBuilderAccount
    );

    expect(earningsForCollector).to.equal(hre.ethers.parseEther("0.0006"));
    expect(earningsForBuilder).to.equal(hre.ethers.parseEther("0.0005"));
    expect(earningsForPlatform).to.equal(hre.ethers.parseEther("0.0004"));
    expect(earningsForOtherBuilderAccount).to.equal(
        hre.ethers.parseEther("0.0005")
    );
  });
});
```

The idea here is to keep track of the earnings accumulated across time for every party involved.

The implementation of this function requires some new state variable and a change in the
`collect()` function:

```solidity
contract BuilderCard is ERC1155Supply, IBuilderCard {
    ...
    mapping(address _account => uint256 _accountEarning)
        private _accountEarnings;
    ...

   function collect(address _builder) public payable {
        if (msg.value != COLLECTION_FEE) {
            revert WrongValueForCollectionFee(COLLECTION_FEE, msg.value);
        }

        uint256 remainingValue = msg.value;

        uint256 _tokenId = _builderIdFromAddress(_builder);
        if (balanceOf(msg.sender, _tokenId) == 0) {
            _mint(msg.sender, _tokenId, 1, "");

            // Finances

            payable(_builder).transfer(BUILDER_REWARD);
            remainingValue -= BUILDER_REWARD;
            _accountEarnings[_builder] += BUILDER_REWARD;

            if (_firstCollectors[_tokenId] == address(0)) {
                // this is the first collection for this token
                _firstCollectors[_tokenId] = msg.sender;

                payable(msg.sender).transfer(FIRST_COLLECTOR_REWARD);
                remainingValue -= FIRST_COLLECTOR_REWARD;
                _accountEarnings[msg.sender] += FIRST_COLLECTOR_REWARD;
            }
        }

        if (remainingValue > 0) {
            _accountEarnings[address(this)] += remainingValue;
        }
    }
    ...
}
```

We use the local variable `remainingValue` to keep track of the value that will end up in the
smart contract, i.e. the platform. Then for every reward to apply, we save the corresponding reward
value and the rewarded account in the state `mapping` named `_accountEarnings`.

At the end, the `remainingValue` is associated with the `address(this)` which is the address of the
smart contract.

This finishes the _financials_ aspect of our contract.

## Constructor and URI

Have you noticed the constructor of our contract?

```solidity
constructor(string memory uri_) ERC1155(uri_) {
    _contractOwner = msg.sender;
}
```

It is taking as argument the `uri_` that will be used to implement the metadata part of the `ERC-1155` standard.

We derive from the OpenZeppelin `ERC1155` implementation which already exposes the public function:

```solidity
function uri(uint256 _id) external view returns (string memory);
```

with the implementation:

```solidity
function uri(uint256 /* id */) public view virtual returns (string memory) {
    return _uri;
}
```

The `uri()` function returns the same URI regardless of the given `id`, or `BuilderCard` identifier in our case.
The value we will return will be the one given at the constructor of the contract.

For example `https://passport.talentprotocol.com/builder_cards/{id}.json`. It will be the responsibility of the
calling client to replace the `{id}` part according to the rules described [in the standard here](https://eips.ethereum.org/EIPS/eip-1155#metadata).

The responsibility of the implementation, i.e. the server serving this URI is to return a response which is compliant with [the standard as described here](https://eips.ethereum.org/EIPS/eip-1155#erc-1155-metadata-uri-json-schema).

But this is the subject of another long post.

## Events Emitted

What we haven't implemented yet, is the emission of the `CardCollected()` event. Please, note that any _transfer_ call will already emit the `TransferSingle` / `TransferBatch` event based on the `ERC-1155` as implemented by OpenZeppelin.

Let's write a spec to make sure that the `CardCollected()` event is emitted when `collect()` is called.

```javascript
it("emits the CardCollected event", async function () {
    const {
      contractDeployer,
      builderCard,
      accountA: builderAccountToCollect,
    } = await loadFixture(deployBuilderCardFixture);

    await expect(
      builderCard.collect(builderAccountToCollect, {
        value: COLLECTION_FEE_IN_WEI,
      })
    )
    .to.emit(builderCard, "CardCollected")
    .withArgs(builderAccountToCollect, contractDeployer);
});
```

The implementation needs a small amendment in the `collect()` function.

```solidity
function collect(address _builder) public payable {
    if (msg.value != COLLECTION_FEE) {
        revert WrongValueForCollectionFee(COLLECTION_FEE, msg.value);
    }

    uint256 remainingValue = msg.value;

    uint256 _tokenId = _builderIdFromAddress(_builder);

    bool collected = false;

    if (balanceOf(msg.sender, _tokenId) == 0) {
        _mint(msg.sender, _tokenId, 1, "");

        collected = true;

        // Finances

        payable(_builder).transfer(BUILDER_REWARD);
        remainingValue -= BUILDER_REWARD;
        _accountEarnings[_builder] += BUILDER_REWARD;

        if (_firstCollectors[_tokenId] == address(0)) {
            // this is the first collection for this token
            _firstCollectors[_tokenId] = msg.sender;

            payable(msg.sender).transfer(FIRST_COLLECTOR_REWARD);
            remainingValue -= FIRST_COLLECTOR_REWARD;
            _accountEarnings[msg.sender] += FIRST_COLLECTOR_REWARD;
        }
    }

    if (remainingValue > 0) {
        _accountEarnings[address(this)] += remainingValue;
    }

    if (collected) {
        emit CardCollected(_builder, msg.sender);
    }
}
```

We are flagging the collection by setting to `true` the value of the local variable `collected`.
At the end of the function, we `emit` if `collected` is `true`.

This makes our test pass.

## Ability to Change Reward Values After Deployment

One problem with our current implementation is that it does not allow changing the _charging_ policy
after we deploy our Smart Contract. This is because the fees and reward values are hard coded.

We will change our `IBuilderCard` interface to expose a setter to allow for setting the values to any new value that we want.

There are some rules though:

- The collection fee should not be 0.
- The sum of the first collector reward and the builder reward should be less than the
collection fee. This makes sure that the platform gets some fee too.
- The function should only be called by the contract owner.

The interface will change as follows:

```solidity
  /**
   * @notice This should only be called by the contract owner.
   * @dev It must revert if the collection fee is 0.
   * It must revert if the sum of the builder reward and the first collector reward
   * is greater than or equal to the collection fee. We want the platform to get some
   * reward.
   * @param _collectionFee The Collection Fee that should be sent as value on collect()
   * @param _builderReward The amount of the Collection Fee that goes to the builder
   * @param _firstCollectorReward The amount of the Collection Fee that goes to the first collector
   */
  function setChargingPolicy(
      uint256 _collectionFee,
      uint256 _builderReward,
      uint256 _firstCollectorReward
  ) external;

  /**
   * @return _collectionFee
   */
  function getCollectionFee() external view returns (uint256 _collectionFee);

  /**
   * @return _builderReward
   */
  function getBuilderReward() external view returns (uint256 _builderReward);

  /**
   * @return _firstCollectorReward
   */
  function getFirstCollectorReward() external view returns (uint256 _firstCollectorReward);
```

As you can see, we will also expose some getters to get back the values. This will allow us to
confirm that values have been set correctly.

Let's write the specs to cover for these function.

```javascript
  describe("#setChargingPolicy", function () {
    context("when called by a non-contract owner", function () {
      it("reverts with the appropriate error", async function () {
        const { builderCard, accountA } = await loadFixture(
          deployBuilderCardFixture
        );

        const collectionFee = ethers.parseEther("0.001");
        const builderReward = ethers.parseEther("0.0005");
        const firstCollectorReward = ethers.parseEther("0.0003");

        await expect(
          builderCard
            .connect(accountA)
            ["setChargingPolicy(uint256,uint256,uint256)"](
              collectionFee,
              builderReward,
              firstCollectorReward
            )
        ).to.be.revertedWithCustomError(builderCard, "UnauthorizedCaller");
      });
    });

    context("when called by the contract owner", function () {
      context("when collection fee is 0", function () {
        it("reverts with the appropriate custom error", async function () {
          const { builderCard } = await loadFixture(deployBuilderCardFixture);

          const collectionFee = ethers.parseEther("0.0");
          const builderReward = ethers.parseEther("0.0005");
          const firstCollectorReward = ethers.parseEther("0.0003");

          await expect(
            builderCard["setChargingPolicy(uint256,uint256,uint256)"](
              collectionFee,
              builderReward,
              firstCollectorReward
            )
          )
            .to.be.revertedWithCustomError(builderCard, "ChargingPolicyError")
            .withArgs("Collection fee should be positive");
        });
      });

      context(
        "when builder reward + first collector reward is equal to collection fee",
        function () {
          it("reverts with the appropriate custom error", async function () {
            const { builderCard } = await loadFixture(deployBuilderCardFixture);

            const collectionFee = ethers.parseEther("0.0008");
            const builderReward = ethers.parseEther("0.0005");
            const firstCollectorReward = ethers.parseEther("0.0003");

            await expect(
              builderCard["setChargingPolicy(uint256,uint256,uint256)"](
                collectionFee,
                builderReward,
                firstCollectorReward
              )
            )
              .to.be.revertedWithCustomError(builderCard, "ChargingPolicyError")
              .withArgs(
                "Collection fee should be greater than the sum of the builder and first collector reward"
              );
          });
        }
      );

      context(
        "when builder reward + first collector reward is greater than the collection fee",
        function () {
          it("reverts with the appropriate custom error", async function () {
            const { builderCard } = await loadFixture(deployBuilderCardFixture);

            const collectionFee = ethers.parseEther("0.0008");
            const builderReward = ethers.parseEther("0.0005");
            const firstCollectorReward = ethers.parseEther("0.00031");

            await expect(
              builderCard["setChargingPolicy(uint256,uint256,uint256)"](
                collectionFee,
                builderReward,
                firstCollectorReward
              )
            )
              .to.be.revertedWithCustomError(builderCard, "ChargingPolicyError")
              .withArgs(
                "Collection fee should be greater than the sum of the builder and first collector reward"
              );
          });
        }
      );

      context(
        "when builder reward + first collector reward is less than the collection fee",
        function () {
          it("sets the new charging policy values accordingly", async function () {
            const { builderCard } = await loadFixture(deployBuilderCardFixture);

            const collectionFee = ethers.parseEther("0.002");
            const builderReward = ethers.parseEther("0.0006");
            const firstCollectorReward = ethers.parseEther("0.0004");

            await builderCard["setChargingPolicy(uint256,uint256,uint256)"](
              collectionFee,
              builderReward,
              firstCollectorReward
            );

            const collectionFeeRead = await builderCard.getCollectionFee();

            expect(collectionFeeRead).to.equal(collectionFee);

            const builderRewardRead = await builderCard.getBuilderReward();

            expect(builderRewardRead).to.equal(builderReward);

            const firstCollectorRewardRead =
              await builderCard.getFirstCollectorReward();

            expect(firstCollectorRewardRead).to.equal(firstCollectorReward);
          });

          it("charges using the new values and not the default ones", async function () {
            const {
              contractDeployer,
              builderCard,
              accountA: builderAccountToCollect,
              accountB: otherCollector,
              accountC: otherBuilderAccountToCollect,
            } = await loadFixture(deployBuilderCardFixture);

            const balanceBefore = await ethers.provider.getBalance(
              contractDeployer
            );

            let trx = await builderCard
              .connect(contractDeployer)
              .collect(builderAccountToCollect, {
                value: COLLECTION_FEE_IN_WEI,
              });

            let receipt = await trx.wait();

            let transactionFee = calculateTransactionFee(receipt);

            const balanceAfter = await ethers.provider.getBalance(
              contractDeployer
            );

            expect(balanceAfter).to.equal(
              balanceBefore +
                FIRST_COLLECTOR_REWARD_IN_WEI -
                COLLECTION_FEE_IN_WEI -
                transactionFee
            );

            // now change the charging policy

            const newCollectionFee =
              COLLECTION_FEE_IN_WEI + ethers.parseEther("0.002");
            const newBuilderReward =
              BUILDER_REWARD_IN_WEI + ethers.parseEther("0.0006");
            const newFirstCollectorReward =
              FIRST_COLLECTOR_REWARD_IN_WEI + ethers.parseEther("0.0004");

            await builderCard["setChargingPolicy(uint256,uint256,uint256)"](
              newCollectionFee,
              newBuilderReward,
              newFirstCollectorReward
            );

            const otherBuilderAccountBalanceBefore =
              await ethers.provider.getBalance(otherBuilderAccountToCollect);

            const platformBalanceBefore = await ethers.provider.getBalance(
              builderCard
            );

            const otherCollectorBalanceBefore =
              await ethers.provider.getBalance(otherCollector);

            trx = await builderCard
              .connect(otherCollector)
              .collect(otherBuilderAccountToCollect, {
                value: newCollectionFee,
              });

            receipt = await trx.wait();

            transactionFee = calculateTransactionFee(receipt);

            const otherBuilderAccountBalanceAfter =
              await ethers.provider.getBalance(otherBuilderAccountToCollect);

            const platformBalanceAfter = await ethers.provider.getBalance(
              builderCard
            );

            const otherCollectorBalanceAfter = await ethers.provider.getBalance(
              otherCollector
            );

            expect(otherBuilderAccountBalanceAfter).to.equal(
              otherBuilderAccountBalanceBefore + newBuilderReward
            );

            expect(platformBalanceAfter).to.equal(
              platformBalanceBefore +
                newCollectionFee -
                newBuilderReward -
                newFirstCollectorReward
            );

            expect(otherCollectorBalanceAfter).to.equal(
              otherCollectorBalanceBefore -
                newCollectionFee -
                transactionFee +
                newFirstCollectorReward
            );
          });
        }
      );
    });
  });
```

That is quite long, but easy to understand. It speaks for itself.

Let's see how we have to change our Smart Contract to support this:

```solidity
contract BuilderCard is ERC1155Supply, IBuilderCard {
    uint256 private _collectionFee = 0.001 ether;
    uint256 private _builderReward = 0.0005 ether;
    uint256 private _firstCollectorReward = 0.0003 ether;

    ...

    // --------------------- Errors ---------------------------------------

    ...

    error ChargingPolicyError(string _message);
    //---------------------------------------------------------------------

    ...

    function collect(address _builder) public payable {
        if (msg.value != _collectionFee) {
            revert WrongValueForCollectionFee(_collectionFee, msg.value);
        }

        uint256 remainingValue = msg.value;

        uint256 _tokenId = _builderIdFromAddress(_builder);

        bool collected = false;

        if (balanceOf(msg.sender, _tokenId) == 0) {
            _mint(msg.sender, _tokenId, 1, "");

            collected = true;

            // Finances

            payable(_builder).transfer(_builderReward);
            remainingValue -= _builderReward;
            _accountEarnings[_builder] += _builderReward;

            if (_firstCollectors[_tokenId] == address(0)) {
                // this is the first collection for this token
                _firstCollectors[_tokenId] = msg.sender;

                payable(msg.sender).transfer(_firstCollectorReward);
                remainingValue -= _firstCollectorReward;
                _accountEarnings[msg.sender] += _firstCollectorReward;
            }
        }

        if (remainingValue > 0) {
            _accountEarnings[address(this)] += remainingValue;
        }

        if (collected) {
            emit CardCollected(_builder, msg.sender);
        }
    }

    ...

    function setChargingPolicy(
        uint256 collectionFee_,
        uint256 builderReward_,
        uint256 firstCollectorReward_
    ) external onlyOwner {
        if (collectionFee_ == 0) {
            revert ChargingPolicyError("Collection fee should be positive");
        }

        if (builderReward_ + firstCollectorReward_ >= collectionFee_) {
            revert ChargingPolicyError(
                "Collection fee should be greater than the sum of the builder and first collector reward"
            );
        }

        _collectionFee = collectionFee_;
        _builderReward = builderReward_;
        _firstCollectorReward = firstCollectorReward_;
    }

    function getCollectionFee() external view returns (uint256) {
        return _collectionFee;
    }

    function getBuilderReward() external view returns (uint256) {
        return _builderReward;
    }

    function getFirstCollectorReward() external view returns (uint256) {
        return _firstCollectorReward;
    }

    ...

}
```

The `setChargingPolicy()` is checking on the caller to be the contract owner. Otherwise, it reverts.
Also, it is checking on the values to follow the rules that we have set.
Finally, it sets the value to the newly introduced private state variables.

The `collect()` changes to use the new private state variables.

This implementation makes our test pass.

## Deploy with the Smart Contract Charging Policy as input to the constructor

There is still one more improvement that we want to make. Currently, if we want to start our Smart Contract
with a non-default charging policy, we don't have this ability. We have to first deploy, and then call the `setChargingPolicy()`.
But, in between the deployment and the call to `setChargingPolicy()` we might have collector already having started
collecting with a charging policy we didn't want.

I believe that it is a better idea to pass the charging policy values as part of the constructor of the contract.

In order to do that, I also decide to introduce a `struct ChargingPolicy` to group together the three properties of my
charging policy. These are the changes in my contract:

```solidity
contract BuilderCard is ERC1155Supply, IBuilderCard {
    struct ChargingPolicy {
        uint256 collectionFee;
        uint256 builderReward;
        uint256 firstCollectorReward;
    }

    ChargingPolicy private _chargingPolicy;

    ...

    constructor(
        string memory uri_,
        ChargingPolicy memory chargingPolicy_
    ) ERC1155(uri_) {
        _contractOwner = msg.sender;
        _chargingPolicy = chargingPolicy_;
    }

    function collect(address _builder) public payable {
        if (msg.value != _chargingPolicy.collectionFee) {
            revert WrongValueForCollectionFee(
                _chargingPolicy.collectionFee,
                msg.value
            );
        }

        uint256 remainingValue = msg.value;

        uint256 _tokenId = _builderIdFromAddress(_builder);

        bool collected = false;

        if (balanceOf(msg.sender, _tokenId) == 0) {
            _mint(msg.sender, _tokenId, 1, "");

            collected = true;

            // Finances

            payable(_builder).transfer(_chargingPolicy.builderReward);
            remainingValue -= _chargingPolicy.builderReward;
            _accountEarnings[_builder] += _chargingPolicy.builderReward;

            if (_firstCollectors[_tokenId] == address(0)) {
                // this is the first collection for this token
                _firstCollectors[_tokenId] = msg.sender;

                payable(msg.sender).transfer(
                    _chargingPolicy.firstCollectorReward
                );
                remainingValue -= _chargingPolicy.firstCollectorReward;
                _accountEarnings[msg.sender] += _chargingPolicy
                    .firstCollectorReward;
            }
        }

        if (remainingValue > 0) {
            _accountEarnings[address(this)] += remainingValue;
        }

        if (collected) {
            emit CardCollected(_builder, msg.sender);
        }
    }

    ...

    function setChargingPolicy(
        uint256 collectionFee_,
        uint256 builderReward_,
        uint256 firstCollectorReward_
    ) external onlyOwner {
        if (collectionFee_ == 0) {
            revert ChargingPolicyError("Collection fee should be positive");
        }

        if (builderReward_ + firstCollectorReward_ >= collectionFee_) {
            revert ChargingPolicyError(
                "Collection fee should be greater than the sum of the builder and first collector reward"
            );
        }

        _chargingPolicy.collectionFee = collectionFee_;
        _chargingPolicy.builderReward = builderReward_;
        _chargingPolicy.firstCollectorReward = firstCollectorReward_;
    }

    function getCollectionFee() external view returns (uint256) {
        return _chargingPolicy.collectionFee;
    }

    function getBuilderReward() external view returns (uint256) {
        return _chargingPolicy.builderReward;
    }

    function getFirstCollectorReward() external view returns (uint256) {
        return _chargingPolicy.firstCollectorReward;
    }

    ...
}
```

But, now that I have changed the constructor, I need to change the `deployBuilderCardFixture()` function in my specs accordingly:

```javascript
  async function deployBuilderCardFixture() {
    // Contracts are deployed using the first signer/account by default
    const [contractDeployer, accountA, accountB, accountC, accountD] =
      await hre.ethers.getSigners();

    const BuilderCard = await hre.ethers.getContractFactory(CONTRACT_NAME);

    const chargingPolicy: BuilderCard.ChargingPolicyStruct = {
      collectionFee: COLLECTION_FEE_IN_WEI,
      builderReward: BUILDER_REWARD_IN_WEI,
      firstCollectorReward: FIRST_COLLECTOR_REWARD_IN_WEI,
    };
    const builderCard = await BuilderCard.deploy(URI, chargingPolicy);

    return {
      contractDeployer,
      builderCard,
      accountA,
      accountB,
      accountC,
      accountD,
    };
  }
```

Now, all the tests are passing successfully.

## Ability to Pause a Contract from being Functional

Sometimes the contract owner might want to pause a contract from being functional.
This might be an emergency case.

This means that we want:

1. One way to _pause_ the contract.
1. One way to _unpause_ the contract.
1. Flag functions that could be executed only when the contract is not paused.
1. Flag functions that could be executed only when the contract is paused.
1. One function that would tell us whether the contract is paused or not.

Shall we develop all this functionality.

Maybe this time not (_again_). We can, _again_, rely on OpenZeppelin.

OpenZeppelin offers another very interesting <code>abstract contract</code>.

It's called [Pausable](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/Pausable.sol)

Hence, we can derive from `Pausable`:

![Builder Card Being Pausable](../../../../../images/builder-card-smart-contract/builder-card-using-pausable.png)

But, this is not enough.

We need to use the modifiers provided:

1. `whenNotPaused()`
1. `whenPaused()`

To flag the functions we want to be called on the corresponding cases.

Other than that, with `Pausable`, we get for free:

1. One `paused()` public function which tells whether the contract is paused or not.
1. One `_pause()` _internal_ function, which pauses the contract. We will have to expose an _external_ function that will internally call this function. Also, it will make sure that the _external_ function is only called by the owner of the contract.
1. One `_unpause()` _internal_ function, which unpauses the contract. Again, we will have to expose an _external_ function that will internally call this function. Also, it will make sure that the _external_function is only called by the owner of the contract.

Let's declare these functions as part of our interface `IBuilder`.

```solidity
interface IBuilder {
    /**
     * @notice Pauses the contract. Useful in emergency cases. It should only be
     * called by the owner of the smart contract, but again, this is up to the
     * implementation. Also, it shouldn't be called when the smart contract
     * is already paused.
     */
    function pause() external;

    /**
     * @notice Unpauses a contract. It should be called only by the owner of
     * the contract, and only if it is paused. But this is the responsibility
     * of the implementation.
     */
    function unpause() external;
}
```

And let's write some specs. We will leverage the `paused()` public method already
implemented for us by `Pausable`.

```javascript
  describe("#pause", function () {
    context("when called by a non-owner account", function () {
      it("reverts with the correct error", async function () {
        const { builderCard, accountA: nonOwnerAccount } = await loadFixture(
          deployBuilderCardFixture
        );

        await expect(
          builderCard.connect(nonOwnerAccount).pause()
        ).to.be.revertedWithCustomError(builderCard, "UnauthorizedCaller");
      });
    });

    context("when called by the owner", function () {
      it("pauses the contract", async function () {
        const { builderCard } = await loadFixture(deployBuilderCardFixture);

        await builderCard.pause();

        const isPaused = await builderCard.paused();

        expect(isPaused).to.be.equal(true);
      });

      context("when already paused", function () {
        it("reverts with corresponding error", async function () {
          const { builderCard } = await loadFixture(deployBuilderCardFixture);

          await builderCard.pause();

          // fire

          await expect(builderCard.pause()).to.be.revertedWithCustomError(
            builderCard,
            "EnforcedPause"
          );
        });
      });
    });
  });

  describe("#unpause", function () {
    context("when called by a non-owner account", function () {
      it("reverts with the correct error", async function () {
        const { builderCard, accountA: nonOwnerAccount } = await loadFixture(
          deployBuilderCardFixture
        );

        await expect(
          builderCard.connect(nonOwnerAccount).unpause()
        ).to.be.revertedWithCustomError(builderCard, "UnauthorizedCaller");
      });
    });

    context("when called by the owner", function () {
      it("unpauses the contract", async function () {
        const { builderCard } = await loadFixture(deployBuilderCardFixture);

        await builderCard.pause();

        // fire
        await builderCard.unpause();

        const isPaused = await builderCard.paused();

        expect(isPaused).to.be.equal(false);
      });

      context("when already unpaused", function () {
        it("reverts with corresponding error", async function () {
          const { builderCard } = await loadFixture(deployBuilderCardFixture);

          await builderCard.pause();
          await builderCard.unpause();

          // fire
          await expect(builderCard.unpause()).to.be.revertedWithCustomError(
            builderCard,
            "ExpectedPause"
          );
        });
      });
    });
  });
```

The implementation of `pause()` and `unpause()` to support these requirements is very simple:

```solidity
contract BuilderCard is ERC1155Supply, Pausable, IBuilderCard {
    ...
    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }
    ...
}
```

But, let's also write some specs about which functions should be called while paused and which
functions should be called while unpaused. The important functions are the public ones which change
the state of the contract.

1. `collect()` should not be called when paused.
1. `withDraw()` should be called even if the contract is paused.
1. `setChargingPolicy()` should be called even if the contract is paused.
1. `safeTransferFrom()` should not be called when paused.
1. `safeBatchTransferFrom` should not be called when paused.

Note: There is also the function `setApprovalForAll()` which changes the state of the contract.
It has to do with the entities which are approved to carry out transfers. We believe that this
should be callable even if the contract is paused. The ability to set the _transfer_ privilege
might be necessary even if the contract is paused.

Note also that the `safeTransferFrom()` and `safeBatchTransferFrom()`, they rely on the internal `_update()` which we have already overridden. We will take advantage of that when implementing the check for the pause state of the contract.

But first, the specs:

### Specs for the `collect()`

```javascript
    context("when contract is paused", function () {
      it("reverts with the correct error", async function () {
        const { builderCard, accountA: builderAccountToCollect } =
          await loadFixture(deployBuilderCardFixture);

        await builderCard.pause();

        await expect(
          builderCard.collect(builderAccountToCollect, {
            value: COLLECTION_FEE_IN_WEI,
          })
        ).to.be.revertedWithCustomError(builderCard, "EnforcedPause");
      });
    });
```

### Specs for the `withDraw()`

```javascript
      context("when contract is paused", function () {
        it("withdraws as before", async function () {
          const {
            builderCard,
            accountA: otherCollector,
            accountB: builderAccount,
            accountC: otherBuilderAccount,
          } = await loadFixture(deployBuilderCardFixture);

          // let's collect so that we put some value to the contract

          await builderCard
            .connect(otherCollector)
            .collect(builderAccount, { value: COLLECTION_FEE_IN_WEI });
          await builderCard
            .connect(otherCollector)
            .collect(otherBuilderAccount, { value: COLLECTION_FEE_IN_WEI });

          const amountToWithDraw = ethers.parseEther("0.0001");

          const balanceBeforeForContract = await ethers.provider.getBalance(
            builderCard
          );

          await builderCard.pause();

          // fire
          await builderCard["withDraw(uint256)"](amountToWithDraw);

          const balanceAfterForContract = await ethers.provider.getBalance(
            builderCard
          );

          expect(balanceAfterForContract).to.equal(
            balanceBeforeForContract - amountToWithDraw
          );
        });
      });
```

### Specs for `setChargingPolicy()`

```javascript
context("when contract is paused", function () {
  it("sets the new charging policy values accordingly", async function () {
    const { builderCard } = await loadFixture(
      deployBuilderCardFixture
    );

    const collectionFee = ethers.parseEther("0.002");
    const builderReward = ethers.parseEther("0.0006");
    const firstCollectorReward = ethers.parseEther("0.0004");

    await builderCard.pause();

    await builderCard["setChargingPolicy(uint256,uint256,uint256)"](
      collectionFee,
      builderReward,
      firstCollectorReward
    );

    const collectionFeeRead = await builderCard.getCollectionFee();

    expect(collectionFeeRead).to.equal(collectionFee);

    const builderRewardRead = await builderCard.getBuilderReward();

    expect(builderRewardRead).to.equal(builderReward);

    const firstCollectorRewardRead =
    await builderCard.getFirstCollectorReward();

    expect(firstCollectorRewardRead).to.equal(firstCollectorReward);
  });
});
```

### Specs for `safeTransferFrom()` and `safeBatchTransferFrom()`

```javascript
context("when contract is paused", function () {
  it("reverts with the correct error", async function () {
    const {
        contractDeployer,
        builderCard,
        accountA: otherCollector,
        accountB: builderAccountToCollect,
    } = await loadFixture(deployBuilderCardFixture);

    await builderCard.collect(builderAccountToCollect, {
        value: COLLECTION_FEE_IN_WEI,
    });

    const builderCardId = BigInt(builderAccountToCollect.address);

    await builderCard.pause();

    // fire
    await expect(
        builderCard.safeTransferFrom(
        contractDeployer,
        otherCollector,
        builderCardId,
        1n,
        "0x"
        )
    ).to.be.revertedWithCustomError(builderCard, "EnforcedPause");
  });
});
```

`safeBatchTransferFrom()` are similar.

### Implement Pausability Check

With the specs in place, setting the pausability check is very simple.

We just add the `whenNotPaused` modifier in the functions:

1. `collect()`
1. `withDraw()`
1. `setChargingPolicy()`
1. `_update()` (which covers for both `safeTransferFrom()` and `safeBatchTransferFrom()`)

## Ability to Transfer Ownership - Platform

But what about the ownership of the smart contract. Currently, the contract is owned
by whomever account deploys the smart contract:

```solidity
    ...
    constructor(
        string memory uri_,
        ChargingPolicy memory chargingPolicy_
    ) ERC1155(uri_) {
        _contractOwner = msg.sender;
        _chargingPolicy = chargingPolicy_;
    }
    ...
```

Look at the line `_contractOwner = ms.sender`.

But contract management might require that we transfer the ownership of the contract
to another account.

This _ownership_ related functionality of our contract is becoming quite complicated.

Luckily, we can rely on another OpenZeppelin implementation.

OpenZeppelin offers another _access_ related abstract contract. The [Ownable](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v5.0.1/contracts/access/Ownable.sol).

This abstract contract offers to us the following:

1. A constructor that allows to set the initial owner at the deployment time.
1. A modifier `onlyOwner()` which we can use for functions that can be called only by the
owner, like the `withDraw()` function.
1. A public view function to get the current owner (`owner()`).
1. A function to transfer ownership (`transferOwnership()`)

Hence, now our `BuilderCard` contract inherits from this smart contract:

![BuilderCard Inherits from Ownable](../../../../../images/builder-card-smart-contract/builder-card-inherits-from-openzeppelin-ownable.png)

1. We had to remove our own modifier `onlyOwner()` since we now inherit it from Ownable.
1. We also had to remove the `_contractOwner` state variable.
1. We also removed the custom error `UnauthorizedCaller`. Ownable throws the `OwnableUnauthorizedAccount` instead.
1. We had to fix all the specs accordingly, starting from the constructor.

## Closing Note

That was a long journey in implementing a decent smart contract. I hope that you
learnt a lot like I did when I worked on this project.
