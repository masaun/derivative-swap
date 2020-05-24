# Derivative Swap by using UMA's Priceless Synthetic Tokens


***
## 【Introduction of Derivative Swap by using UMA's Priceless Synthetic Tokens】
- This repos is dApp for derivative swap by using UMA's Priceless Synthetic Tokens.
  - One of UMA's Priceless Synthetic Tokens feature is creating various pair (derivative). That is able to track price not only cryptocurrency, but also stock prices(Such as the stock price of TSLA, etc...) and commodity prices(Such as the commodity price of Oil)
  - Following a feature above, I have tried to build derivative swap by using UMA's Priceless Synthetic Tokens.
  - It has potential to be involved stock and bond and commodity into DeFi(decentralized finance) market and be able to trade them with various pair. In case it is realized, it can bring more liquidity and connectivity (between crypto assets and traditional assets) into DeFi market.

&nbsp;


## 【User Flow】

&nbsp;

***

## 【Setup】(※ Implementation is in progress)
### Setup wallet by using Metamask
1. Add MetaMask to browser (Chrome or FireFox or Opera or Brave)    
https://metamask.io/  


2. Adjust appropriate newwork below 
```
Kovan Test Network
```

&nbsp;


### Setup backend
1. Deploy contracts to Kovan Test Network
```
(root directory)

$ npm run migrate:Kovan
```

&nbsp;


### Setup frontend
1. Add an `.env` file under the directory of `./client`.

2. Add `SKIP_PREFLIGHT_CHECK=true` to an `.env` file under the directory of `./client`.    
（Recommend to reference from `./client/.env.example`）

3. Execute command below in root directory.
```
$ npm run client
```

4. Access to browser by using link 
```
http://127.0.0.1:3000/idle-insurance-fund
```

&nbsp;


***

## 【References】
- [UMA protocol]
    - [Blog]：Announcing the UMA Synthetic Token Builder
    https://medium.com/uma-project/announcing-the-uma-synthetic-token-builder-8bf37c645e94

    - [Demo dApp]：
        - Synthetic Token Builder（@ Rinekby ）
        https://tokenbuilder.umaproject.org/

    - [Doc]： "Priceless Synthetic Tokens"
        - Explanation
        https://docs.umaproject.org/uma/getting_started/priceless_defi_contracts.html#_priceless_synthetic_tokens
        - Flow of Priceless Synthetic Tokens
        https://docs.umaproject.org/uma/synthetic_tokens/explainer.html#_creating_synthetic_tokens_from_an_existing_contract

        <br>

    - [Doc]：Tutorial / Smart Contract
    https://docs.umaproject.org/uma/synthetic_tokens/creating_from_truffle.html#_parameterize_and_deploy_a_contract

    - [Doc]：Contract Address
        - Kovan Synthetic Tokens
        https://docs.umaproject.org/uma/developer_reference/contract_addresses.html#_kovan_network_id_42
        - Rinkeby
        - Kovan
        https://docs.umaproject.org/uma/developer_reference/contract_addresses.html

        <br>

    - [Repos / UMA]：
        - UMAprotocol/protocol/core
        https://github.com/UMAprotocol/protocol/tree/master/core
