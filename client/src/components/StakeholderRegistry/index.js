import React, { Component } from "react";
import getWeb3, { getGanacheWeb3, Web3 } from "../../utils/getWeb3";

import App from "../../App.js";

import { Typography, Grid, TextField } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import { theme } from '../../utils/theme';
import { Loader, Button, Card, Input, Heading, Table, Form, Flex, Box, Image, EthAddress } from 'rimble-ui';
import { zeppelinSolidityHotLoaderOptions } from '../../../config/webpack';

import styles from '../../App.module.scss';
//import './App.css';

import { walletAddressList } from '../../data/walletAddress/walletAddress.js'
import { contractAddressList } from '../../data/contractAddress/contractAddress.js'
import { tokenAddressList } from '../../data/tokenAddress/tokenAddress.js'


export default class StakeholderRegistry extends Component {
    constructor(props) {    
        super(props);

        this.state = {
            /////// Default state
            storageValue: 0,
            web3: null,
            accounts: null,
            route: window.location.pathname.replace("/", "")
        };

        this._createSyntheticTokenPosition = this._createSyntheticTokenPosition.bind(this);
        this._createExpiringMultiParty = this._createExpiringMultiParty.bind(this); 
        this.createNewToken = this.createNewToken.bind(this);

        this.createToken = this.createToken.bind(this);
        this._balanceOfContract = this._balanceOfContract.bind(this);
    }


    _createSyntheticTokenPosition = async () => {
        const { accounts, web3, dai, DAI_ADDRESS, stakeholder_registry, token_factory, expiring_multiparty_creator, identifier_whitelist, registry, address_whitelist } = this.state;

        const constructorParams = { expirationTimestamp: "1590969600",      // "1588291200" is 2020-06-01T00:00:00.000Z
                                    //expirationTimestamp: "1585699200",    // "1585699200" is 2020-04-01T00:00:00.000Z
                                    collateralAddress: DAI_ADDRESS, 
                                    priceFeedIdentifier: web3.utils.utf8ToHex("UMATEST"), 
                                    syntheticName: "Test UMA Token", syntheticSymbol: "UMATEST", 
                                    collateralRequirement: { rawValue: web3.utils.toWei("1.5") }, 
                                    disputeBondPct: { rawValue: web3.utils.toWei("0.1") }, 
                                    sponsorDisputeRewardPct: { rawValue: web3.utils.toWei("0.1") }, 
                                    disputerDisputeRewardPct: { rawValue: web3.utils.toWei("0.1") }, 
                                    minSponsorTokens: { rawValue: web3.utils.toWei("0.1") }, 
                                    timerAddress: '0x0000000000000000000000000000000000000000' }

        const txResult = await expiring_multiparty_creator.methods.createSyntheticTokenPosition(constructorParams).send({ from: accounts[0] });
        console.log('=== txResult of createSyntheticTokenPosition() ===', txResult);        
    }


    _createExpiringMultiParty = async () => {
        const { accounts, web3, dai, DAI_ADDRESS, stakeholder_registry, token_factory, expiring_multiparty_creator, identifier_whitelist, registry, address_whitelist } = this.state;

        ////////////////////////////////////////////////
        /// Parameterize and deploy a contract
        ////////////////////////////////////////////////

        let tokenFactoryAddress = await expiring_multiparty_creator.methods.tokenFactoryAddress().call();
        console.log('=== tokenFactoryAddress ===', tokenFactoryAddress);        
        // Log: === tokenFactoryAddress === 0x478049C316035a3Cf0e1d73fdeD5BC45D1CeFde4

        // Whitelist collateral currency
        //await collateralTokenWhitelist.addToWhitelist(collateralToken.address, { from: contractCreator });

        const constructorParams = { expirationTimestamp: "1590969600",      // "1588291200" is 2020-06-01T00:00:00.000Z
                                    //expirationTimestamp: "1585699200",    // "1585699200" is 2020-04-01T00:00:00.000Z
                                    collateralAddress: DAI_ADDRESS, 
                                    priceFeedIdentifier: web3.utils.utf8ToHex("UMATEST"), 
                                    syntheticName: "Test UMA Token", syntheticSymbol: "UMATEST", 
                                    collateralRequirement: { rawValue: web3.utils.toWei("1.5") }, 
                                    disputeBondPct: { rawValue: web3.utils.toWei("0.1") }, 
                                    sponsorDisputeRewardPct: { rawValue: web3.utils.toWei("0.1") }, 
                                    disputerDisputeRewardPct: { rawValue: web3.utils.toWei("0.1") }, 
                                    minSponsorTokens: { rawValue: web3.utils.toWei("0.1") }, 
                                    timerAddress: '0x0000000000000000000000000000000000000000' }

        await identifier_whitelist.methods.addSupportedIdentifier(constructorParams.priceFeedIdentifier).send({ from: accounts[0] });
        await registry.methods.addMember(1, expiring_multiparty_creator.address).send({ from: accounts[0] });

        let collateralTokenWhitelist = await expiring_multiparty_creator.methods.collateralTokenWhitelist().call();
        console.log('=== collateralTokenWhitelist ===', collateralTokenWhitelist);
        // Log: === collateralTokenWhitelist === 0xAc803f66CB647999036fC6fACd205c3a00650b0b

        await address_whitelist.methods.addToWhitelist(collateralTokenWhitelist).send({ from: accounts[0] });

        const txResult = await expiring_multiparty_creator.methods.createExpiringMultiParty(constructorParams).send({ from: accounts[0] });
        console.log('=== txResult ===', txResult);
        //const emp = await ExpiringMultiParty.at(txResult.logs[0].args.expiringMultiPartyAddress);
    }


    createNewToken = async () => {
        const { accounts, web3, dai, stakeholder_registry, token_factory, expiring_multiparty_creator, identifier_whitelist, registry, address_whitelist, DAI_ADDRESS, EXPIRING_MULTIPARTY_CREATOR_ADDRESS } = this.state;

        const constructorParams = { expirationTimestamp: "1590969600",      // "1588291200" is 2020-06-01T00:00:00.000Z
                                    //expirationTimestamp: "1585699200",    // "1585699200" is 2020-04-01T00:00:00.000Z
                                    collateralAddress: DAI_ADDRESS, 
                                    priceFeedIdentifier: web3.utils.utf8ToHex("UMATEST"), 
                                    syntheticName: "Test UMA Token", syntheticSymbol: "UMATEST", 
                                    collateralRequirement: web3.utils.toWei("1.5"), 
                                    disputeBondPct: web3.utils.toWei("0.1"), 
                                    sponsorDisputeRewardPct: web3.utils.toWei("0.1"), 
                                    disputerDisputeRewardPct: web3.utils.toWei("0.1"), 
                                    minSponsorTokens: web3.utils.toWei("0.1"), 
                                    timerAddress: '0x0000000000000000000000000000000000000000' }

        await address_whitelist.methods.addToWhitelist(constructorParams.collateralAddress).send({ from: accounts[0] });
        let addressWhitelist = address_whitelist.methods.getWhitelist().call();
        console.log('=== addressWhitelist ===', addressWhitelist);


        ////////////////////////////////////////////////
        /// Create new tokens from an existing contract
        ////////////////////////////////////////////////

        //@dev - 1. we will create synthetic tokens from that contract.
        const collateralToken = await dai;
        //await collateralToken.allocateTo(accounts[0], web3.utils.toWei("10000"));
        await collateralToken.methods.approve(EXPIRING_MULTIPARTY_CREATOR_ADDRESS, web3.utils.toWei("10000")).send({ from: accounts[0] });

        //@dev - 2. We can now create a synthetic token position
        await expiring_multiparty_creator.methods.createExpiringMultiParty(constructorParams).send({ from: accounts[0] });

        //dev - 3. check that we now have synthetic tokens
       
        // collateral token balance

        // synthetic token balance
        //let res = await syntheticToken.methods.balanceOf(accounts[0]).call();
        //console.log('=== balance of syntheticToken ===', res);

        // position information
        await expiring_multiparty_creator.methods.positions(accounts[0]).send({ from: accounts[0] });
    }

    // redeemToken = async () => {
    //     const { accounts, web3, dai, stakeholder_registry, token_factory, expiring_multiparty_creator, identifier_whitelist, registry } = this.state;
    //     ////////////////////////////////////////////////
    //     /// Redeem tokens against a contract
    //     ////////////////////////////////////////////////

    //     //@dev - 1. Token sponsor can redeem some of the tokens we minted even before the synthetic token expires
    //     await syntheticToken.approve(emp.address, web3.utils.toWei("10000"));
    //     await emp.redeem({ rawValue: web3.utils.toWei("50") });

    //     //@dev - 2. check that our synthetic token balance
    //     (await collateralToken.balanceOf(accounts[0]))
    //       .toString()(
    //         // collateral token balance
    //         await syntheticToken.balanceOf(accounts[0])
    //       )
    //       .toString();
    //     // synthetic token balance
    //     await emp.positions(accounts[0]);
    //     // position information
    // }

    // withdrawToken = async () => {
    //     const { accounts, web3, dai, stakeholder_registry, token_factory, expiring_multiparty_creator, identifier_whitelist, registry } = this.state;
    //     ////////////////////////////////////////////////
    //     /// Deposit and withdraw collateral
    //     ////////////////////////////////////////////////

    //     //@dev - 1. Deposit 10 additional collateral tokens
    //     await emp
    //         .deposit({ rawValue: web3.utils.toWei("10") })(await collateralToken.balanceOf(accounts[0]))
    //         .toString();

    //     //@dev - 2. Deposit 10 additional collateral tokens
    //     await emp.requestWithdrawal({ rawValue: web3.utils.toWei("10") });

    //     //@dev - 3. Simulate the withdrawal liveness period passing without a dispute of our withdrawal request
    //     await emp.setCurrentTime((await emp.getCurrentTime()).toNumber() + 1001);
    //     await emp.withdrawPassedRequest();

    //     //@dev - 4. check that our collateral token balance has returned to 9,925.
    //     (await collateralToken.balanceOf(accounts[0])).toString();
    //     // collateral token balance
    // }








    createToken = async () => {
        const { accounts, web3, dai, stakeholder_registry, token_factory } = this.state;

        const _tokenName = "UMA Synthetic Test Token May 2022";
        const _tokenSymbol = "UMATEST_May2022";
        const _tokenDecimals = 18;

        let res1 = await token_factory.methods.createToken(_tokenName, _tokenSymbol, _tokenDecimals).send({ from: accounts[0] });
        console.log('=== response of _createToken() function 1 ===\n', res1);

        let res2 = await stakeholder_registry.methods._createToken(_tokenName, _tokenSymbol, _tokenDecimals).send({ from: accounts[0] });
        console.log('=== response of _createToken() function 2 ===\n', res2);
    }

    _balanceOfContract = async () => {
        const { accounts, web3, dai, stakeholder_registry } = this.state;

        let res1 = await stakeholder_registry.methods.balanceOfContract().call();
        console.log('=== response of balanceOfContract() function ===\n', res1);
    }








    //////////////////////////////////// 
    ///// Refresh Values
    ////////////////////////////////////
    refreshValues = (instanceStakeholderRegistry) => {
        if (instanceStakeholderRegistry) {
          //console.log('refreshValues of instanceStakeholderRegistry');
        }
    }


    //////////////////////////////////// 
    ///// Ganache
    ////////////////////////////////////
    getGanacheAddresses = async () => {
        if (!this.ganacheProvider) {
            this.ganacheProvider = getGanacheWeb3();
        }
        if (this.ganacheProvider) {
            return await this.ganacheProvider.eth.getAccounts();
        }
        return [];
    }

    componentDidMount = async () => {
        const hotLoaderDisabled = zeppelinSolidityHotLoaderOptions.disabled;
     
        let StakeholderRegistry = {};
        let Dai = {};
        let TokenFactory = {};
        let ExpiringMultiParty = {};
        let ExpiringMultiPartyCreator = {};
        let IdentifierWhitelist = {};
        let Registry = {};
        let AddressWhitelist = {};
        try {
          StakeholderRegistry = require("../../../../build/contracts/StakeholderRegistry.json");  // Load artifact-file of StakeholderRegistry
          Dai = require("../../../../build/contracts/IERC20.json");    //@dev - DAI
          TokenFactory = require("../../../../build/contracts/TokenFactory.json");  //@dev - TokenFactory.sol
          ExpiringMultiParty = require("../../../../build/contracts/ExpiringMultiParty.json");  //@dev - ExpiringMultiParty.sol
          ExpiringMultiPartyCreator = require("../../../../build/contracts/ExpiringMultiPartyCreator.json");  //@dev - ExpiringMultiPartyCreator.sol
          IdentifierWhitelist = require("../../../../build/contracts/IdentifierWhitelist.json");  //@dev - IdentifierWhitelist.sol 
          Registry = require("../../../../build/contracts/Registry.json");  //@dev - Registry.sol  
          AddressWhitelist = require("../../../../build/contracts/AddressWhitelist.json");  //@dev - AddressWhitelist.sol  
        } catch (e) {
          console.log(e);
        }

        try {
          const isProd = process.env.NODE_ENV === 'production';
          if (!isProd) {
            // Get network provider and web3 instance.
            const web3 = await getWeb3();
            let ganacheAccounts = [];

            try {
              ganacheAccounts = await this.getGanacheAddresses();
            } catch (e) {
              console.log('Ganache is not running');
            }

            // Use web3 to get the user's accounts.
            const accounts = await web3.eth.getAccounts();
            // Get the contract instance.
            const networkId = await web3.eth.net.getId();
            const networkType = await web3.eth.net.getNetworkType();
            const isMetaMask = web3.currentProvider.isMetaMask;
            let balance = accounts.length > 0 ? await web3.eth.getBalance(accounts[0]): web3.utils.toWei('0');
            balance = web3.utils.fromWei(balance, 'ether');

            let instanceStakeholderRegistry = null;
            let deployedNetwork = null;
            let STAKEHOLDER_REGISTRY_ADDRESS = StakeholderRegistry.networks[networkId.toString()].address;

            // Create instance of contracts
            if (StakeholderRegistry.networks) {
              deployedNetwork = StakeholderRegistry.networks[networkId.toString()];
              if (deployedNetwork) {
                instanceStakeholderRegistry = new web3.eth.Contract(
                  StakeholderRegistry.abi,
                  deployedNetwork && deployedNetwork.address,
                );
                console.log('=== instanceStakeholderRegistry ===', instanceStakeholderRegistry);
              }
            }

            //@dev - Create instance of DAI-contract
            let instanceDai = null;
            let DAI_ADDRESS = tokenAddressList["Kovan"]["DAI"]; //@dev - DAI（on Kovan）
            instanceDai = new web3.eth.Contract(
              Dai.abi,
              DAI_ADDRESS,
            );
            console.log('=== instanceDai ===', instanceDai);

            //@dev - Create instance of TokenFactory.sol
            let instanceTokenFactory = null;
            let TOKEN_FACTORY_ADDRESS = contractAddressList["Kovan"]["UMA"]["TokenFactory"];  //@dev - TokenFactory.sol from UMA
            instanceTokenFactory = new web3.eth.Contract(
                TokenFactory.abi,
                TOKEN_FACTORY_ADDRESS,
            );
            console.log('=== instanceTokenFactory ===', instanceTokenFactory);

            //@dev - Create instance of ExpiringMultiPartyCreator.sol
            let instanceExpiringMultiPartyCreator = null;
            let EXPIRING_MULTIPARTY_CREATOR_ADDRESS = contractAddressList["Kovan"]["UMA"]["ExpiringMultiPartyCreator"];  //@dev - ExpiringMultiPartyCreator.sol from UMA
            instanceExpiringMultiPartyCreator = new web3.eth.Contract(
                ExpiringMultiPartyCreator.abi,
                EXPIRING_MULTIPARTY_CREATOR_ADDRESS,
            );
            console.log('=== instanceExpiringMultiPartyCreator ===', instanceExpiringMultiPartyCreator);

            //@dev - Create instance of IdentifierWhitelist.sol
            let instanceIdentifierWhitelist = null;
            let IDENTIFIER_WHITELIST_ADDRESS = contractAddressList["Kovan"]["UMA"]["IdentifierWhitelist"];  //@dev - IdentifierWhitelist.sol from UMA
            instanceIdentifierWhitelist = new web3.eth.Contract(
                IdentifierWhitelist.abi,
                IDENTIFIER_WHITELIST_ADDRESS,
            );
            console.log('=== instanceIdentifierWhitelist ===', instanceIdentifierWhitelist);

            //@dev - Create instance of Registry.sol
            let instanceRegistry = null;
            let REGISTRY_ADDRESS = contractAddressList["Kovan"]["UMA"]["Registry"];  //@dev - Registry.sol from UMA
            instanceRegistry = new web3.eth.Contract(
                Registry.abi,
                REGISTRY_ADDRESS,
            );
            console.log('=== instanceRegistry ===', instanceRegistry);

            //@dev - Create instance of AddressWhitelist.sol
            let instanceAddressWhitelist = null;
            let ADDRESS_WHITELIST_ADDRESS = contractAddressList["Kovan"]["UMA"]["AddressWhitelist"];  //@dev - AddressWhitelist.sol from UMA
            instanceAddressWhitelist = new web3.eth.Contract(
                AddressWhitelist.abi,
                ADDRESS_WHITELIST_ADDRESS,
            );
            console.log('=== instanceAddressWhitelist ===', instanceAddressWhitelist);


            if (StakeholderRegistry) {
              // Set web3, accounts, and contract to the state, and then proceed with an
              // example of interacting with the contract's methods.
              this.setState({ 
                web3, 
                ganacheAccounts, 
                accounts, 
                balance, 
                networkId, 
                networkType, 
                hotLoaderDisabled,
                isMetaMask, 
                stakeholder_registry: instanceStakeholderRegistry,
                dai: instanceDai,
                token_factory: instanceTokenFactory,
                expiring_multiparty_creator: instanceExpiringMultiPartyCreator,
                identifier_whitelist: instanceIdentifierWhitelist,
                registry: instanceRegistry,
                address_whitelist: instanceAddressWhitelist,
                STAKEHOLDER_REGISTRY_ADDRESS: STAKEHOLDER_REGISTRY_ADDRESS,
                DAI_ADDRESS: DAI_ADDRESS,
                TOKEN_FACTORY_ADDRESS: TOKEN_FACTORY_ADDRESS,
                EXPIRING_MULTIPARTY_CREATOR_ADDRESS: EXPIRING_MULTIPARTY_CREATOR_ADDRESS,
                IDENTIFIER_WHITELIST_ADDRESS: IDENTIFIER_WHITELIST_ADDRESS,
                REGISTRY_ADDRESS: REGISTRY_ADDRESS,
                ADDRESS_WHITELIST_ADDRESS: ADDRESS_WHITELIST_ADDRESS
              }, () => {
                this.refreshValues(
                  instanceStakeholderRegistry
                );
                setInterval(() => {
                  this.refreshValues(instanceStakeholderRegistry);
                }, 5000);
              });
            }
            else {
              this.setState({ web3, ganacheAccounts, accounts, balance, networkId, networkType, hotLoaderDisabled, isMetaMask });
            }
          }
        } catch (error) {
          // Catch any errors for any of the above operations.
          alert(
            `Failed to load web3, accounts, or contract. Check console for details.`,
          );
          console.error(error);
        }
    }


    render() {
        const { accounts, stakeholder_registry } = this.state;

        return (
            <div className={styles.widgets}>
                <Grid container style={{ marginTop: 32 }}>
                    <Grid item xs={12}>
                        <Card width={"auto"} 
                              maxWidth={"420px"} 
                              mx={"auto"} 
                              my={5} 
                              p={20} 
                              borderColor={"#E8E8E8"}
                        >
                            <h4>UMA Synthetic Tokens HackMoney</h4> <br />

                            <Button size={'small'} mt={3} mb={2} onClick={this._createSyntheticTokenPosition}> Create SyntheticToken Position </Button> <br />

                            <Button size={'small'} mt={3} mb={2} onClick={this._createExpiringMultiParty}> Create Expiring MultiParty </Button> <br />

                            <Button size={'small'} mt={3} mb={2} onClick={this.createNewToken}> Create New Token </Button> <br />

                            <hr />                            

                            <Button size={'small'} mt={3} mb={2} onClick={this.createToken}> Create Synthetic Token </Button> <br />

                            <Button mainColor="DarkCyan" size={'small'} mt={3} mb={2} onClick={this._balanceOfContract}> Balance of contract </Button> <br />
                        </Card>
                    </Grid>

                    <Grid item xs={4}>
                    </Grid>

                    <Grid item xs={4}>
                    </Grid>
                </Grid>
            </div>
        );
    }

}
