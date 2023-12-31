# BugLess

<img align="right" height="400" src="logo.png">

Bug bounty programs allow developers to discover vulnerabilities in their applications by rewarding hackers that finds them.
They are mostly held in the Web2 space, and, thus, rarely provide any form of payment guarantee to whitehats.
As a result, developers are able to unfairly underpay whitehats, or even refuse to pay them.

To solve this issue, we have developed BugLess—a trustless bug bounty platform powered by [Cartesi Rollups](https://www.cartesi.io/).
Running inside a deterministic RISC-V machine that boots Linux, BugLess accepts applications written in any major programming language[^1].
Through a friendly web interface, anyone can submit applications, and sponsor them with Ether to incentivize hackers! All major wallets are supported[^2].
Meanwhile, hackers can test their exploits right on the browser, without even having to sign Web3 transactions!
Once the hacker finds a valid exploit, they can finally send a transaction requesting the reward to be transferred to their account.
If, however, no one is able to submit a valid exploit until a certain deadline, the sponsors may request a refund.

[^1]: Some notable examples of programming languages that can run inside BugLess are C, C++, Python, Lua, JavaScript, and Rust.
[^2]: BugLess supports +300 wallets, such as WalletConnect, MetaMask, Trust Wallet, and Coinbase.

## Index

- [Dependencies](#dependencies)
- [Presentation](#presentation)
- [Back-end](#back-end)
- [Building bounties](#building-bounties)
- [Tests](#tests)
- [CLI](#cli)
- [Populating DApp](#populating-dapp)
- [Front-end](#front-end)
- [Future Work](#future-work)

## Dependencies

For your purposes, not all dependencies may be required.
To help you figure out which dependencies you actually need, here is a table of dependencies for each part of the code base.

| Dependency | Presentation | Back-end | Examples | Tests | Populate | CLI | Front-end |
| :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
| `docker` | ☑️ | ☑️ | ☑️ | | | | |
| `go` | | ☑️ | | | ☑️ | ☑️ | |
| `jq` | | | | | ☑️ | | |
| `lua` | | | | ☑️ | | | |
| `npm` | | | | | | | ☑️ |
| `sunodo` | | ☑️ | | ☑️ | | | |
| `tar` | | | ☑️ | | | | |
| `wget` | | ☑️ | ☑️ | | | | |

## Presentation

For more info about the project, check out the slides.
To build the slides, run the following command:

```
make slides
```

## Back-end

### Building the machine image

```sh
make sunodo-sdk-image
sunodo build
```

### Running the Cartesi Node

```
sunodo run
```

## Building bounties

Before testing, you need to compile bounties binaries.

```sh
make bounties
```

The following bounties will be compiled and can be used for testing:

```
./tests/bounties/busybox-bounty/busybox-1.36.1-bounty_riscv64.tar.xz
./tests/bounties/lua-bounty/lua-5.4.3-bounty_riscv64.tar.xz
./tests/bounties/lua-bounty/lua-5.4.6-bounty_riscv64.tar.xz
./tests/bounties/sqlite-bounty/sqlite-3.32.2-bounty_riscv64.tar.xz
./tests/bounties/sqlite-bounty/sqlite-3.43.2-bounty_riscv64.tar.xz
```

Along with following exploits:

```
./tests/bounties/busybox-bounty/exploit-busybox-1.36.1.sh
./tests/bounties/lua-bounty/exploit-lua-5.4.3.lua
./tests/bounties/sqlite-bounty/exploit-sqlite-3.32.2.sql
```

## Tests

Before running tests, make sure you built the image and bounties, you can build them with `make all`.

```sh
make test
```

## CLI

To interact with the contract, you may use the BugLess CLI.
For all the options, run the command below.

```sh
go run ./cli help
```

### Showing the current state

```sh
go run ./cli state
```

### Sending dapp address

```sh
go run ./cli send dapp-address
```

### Sending bounty

```sh
go run ./cli send bounty \
    -n "Lua Bounty" \
    -d "Description of Lua bounty" \
    -c ./tests/bounties/lua-bounty/lua-5.4.3-bounty_riscv64.tar.xz
```

### Sending sponsor

```sh
go run ./cli send sponsor -b 0 -n "Sponsor Name" -v 0.05
```

### Sending exploit

```sh
go run ./cli send exploit \
    -b 0 \
    -n "Hacker Name" \
    -e ./tests/bounties/lua-bounty/exploit-lua-5.4.3.lua
```

### Withdraw bounty

```sh
go run ./cli send withdraw -b 0
```

### Testing exploit

```sh
go run ./cli test \
    -b 0 \
    -e ./tests/bounties/lua-bounty/exploit-lua-5.4.3.lua
```

## Populating DApp

Run the following command to fill up the DApp with test data. 

```sh
make populate
```

## Front-end

To run the frontend, execute the commands below.

```shell
cd frontend
npm install
npm run dev
```

Open http://localhost:3000 in your browser.

## Future Work

The initial version of this project was developed in one week for the ETHOnline 2023 hackathon.
During this one week, we had to design and implement a project from scratch.
With this very tight schedule, some of the features were left out for later implementation.
Below are some of those features.

- Support ENS
- Support other types of assets (ERC-20, ERC-721, and ERC-1155)
- Support syntax highlight on code blocks
- Add optional one-time setup phase for applications
- Add option to download bounty bundle
- Sandbox applications with Hypervisor
