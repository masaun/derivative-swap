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


export default class DerivativeSwap extends Component {
    constructor(props) {    
        super(props);

        this.state = {
            /////// Default state
            storageValue: 0,
            web3: null,
            accounts: null,
            route: window.location.pathname.replace("/", "")
        };

        this.createEMP = this.createEMP.bind(this);

        this.createNewToken = this.createNewToken.bind(this);

        this.createToken = this.createToken.bind(this);
        this._balanceOfContract = this._balanceOfContract.bind(this);
    }


    createEMP = async () => {
        const { accounts, web3, dai, DAI_ADDRESS, expiring_multiparty_lib, stakeholder_registry, expiring_multiparty_via_new } = this.state;

        const constructorParams = { expirationTimestamp: "1590969600",      // "1588291200" is 2020-06-01T00:00:00.000Z
                                    //expirationTimestamp: "1585699200",    // "1585699200" is 2020-04-01T00:00:00.000Z
                                    collateralAddress: DAI_ADDRESS, 
                                    priceFeedIdentifier: web3.utils.utf8ToHex("UMATEST"), 
                                    syntheticName: "Test UMA Token", syntheticSymbol: "UMATEST", 
                                    collateralRequirement: { rawValue: web3.utils.toWei("1.5") },  //@notice - assigned value must be greater than "1"
                                    disputeBondPct: { rawValue: web3.utils.toWei("0.1") }, 
                                    sponsorDisputeRewardPct: { rawValue: web3.utils.toWei("0.1") }, 
                                    disputerDisputeRewardPct: { rawValue: web3.utils.toWei("0.1") }, 
                                    minSponsorTokens: { rawValue: web3.utils.toWei("0.01") }, 
                                    timerAddress: '0x0000000000000000000000000000000000000000' }

        const _roleId = 1;
        let res1 = await stakeholder_registry.methods.checkRoleOfExpiringMultiPartyCreator(_roleId).call();
        console.log('=== checkRole of ExpiringMultiPartyCreator ===', res1);

        const _deployerAddress = '0xd91df4880c64343e10F75d8E5f281BcBa4318e4b';
        let res2 = await stakeholder_registry.methods.checkRole(_roleId, _deployerAddress).call();
        console.log('=== checkRole of deployerAddress ===', res2);

        let res3 = await expiring_multiparty_via_new.methods.createEMP(constructorParams).send({ from: accounts[0] });
        console.log('=== new / createEMP() - ExpiringMultiPartyViaNew.sol ===', res3);

        //let res4 = await stakeholder_registry.methods.generateEMP(constructorParams).send({ from: accounts[0] });
        //console.log('=== createExpiringMultiParty() - ExpiringMultiPartyCreator.sol ===', res4);
    }
 

    createNewToken = async () => {
        const { accounts, web3, dai, collateral_token, synthetic_token, stakeholder_registry, token_factory, expiring_multiparty_creator, identifier_whitelist, registry, address_whitelist, DAI_ADDRESS, EXPIRING_MULTIPARTY_CREATOR_ADDRESS } = this.state;

        ////////////////////////////////////////////////
        /// Create new tokens from an existing contract
        ////////////////////////////////////////////////
       
        // collateral token balance
        let balance1 = await dai.methods.balanceOf(accounts[0]).call();
        console.log('=== balance of collateralToken ===', balance1);

        // totalSupply of synthetic token
        let totalSupply = await synthetic_token.methods.totalSupply().call();
        console.log('=== totalSupply() of syntheticToken ===', totalSupply);

        // mint synthetic token
        const _recipient = accounts[0];
        const _value = web3.utils.toWei("0.1");
        let res = await synthetic_token.methods.mint(_recipient, _value).send({ from: accounts[0] });
        console.log('=== mint() of syntheticToken ===', res);
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
        let SyntheticToken = {};
        let TokenFactory = {};
        let ExpiringMultiParty = {};
        let ExpiringMultiPartyLib = {};
        let ExpiringMultiPartyCreator = {};
        let ExpiringMultiPartyViaNew = {};
        let IdentifierWhitelist = {};
        let Registry = {};
        let AddressWhitelist = {};
        try {
          StakeholderRegistry = require("../../../../build/contracts/StakeholderRegistry.json");  // Load artifact-file of StakeholderRegistry
          Dai = require("../../../../build/contracts/IERC20.json");    //@dev - DAI
          SyntheticToken = require("../../../../build/contracts/SyntheticToken.json");  //@dev - SyntheticToken.sol
          TokenFactory = require("../../../../build/contracts/TokenFactory.json");  //@dev - TokenFactory.sol
          ExpiringMultiParty = require("../../../../build/contracts/ExpiringMultiParty.json");  //@dev - ExpiringMultiParty.sol
          ExpiringMultiPartyLib = require("../../../../build/contracts/ExpiringMultiPartyLib.json");
          ExpiringMultiPartyCreator = require("../../../../build/contracts/ExpiringMultiPartyCreator.json");  //@dev - ExpiringMultiPartyCreator.sol
          ExpiringMultiPartyViaNew = require("../../../../build/contracts/ExpiringMultiPartyViaNew.json");
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

            //@dev - Create instance of SyntheticToken.sol
            let instanceSyntheticToken = null;
            //let SYNTHETIC_TOKEN_ADDRESS = tokenAddressList["Kovan"]["UMA Synthetic Stocks May2020"];
            let SYNTHETIC_TOKEN_ADDRESS = "0xBAA2F223B505a8646518f1D17bDe979cc80cF273"; // Oil_Jul20
            instanceSyntheticToken = new web3.eth.Contract(
                SyntheticToken.abi,
                SYNTHETIC_TOKEN_ADDRESS,
            );
            console.log('=== instanceSyntheticToken ===', instanceSyntheticToken);

            //@dev - Create instance of TokenFactory.sol
            let instanceTokenFactory = null;
            let TOKEN_FACTORY_ADDRESS = contractAddressList["Kovan"]["UMA"]["TokenFactory"];  //@dev - TokenFactory.sol from UMA
            instanceTokenFactory = new web3.eth.Contract(
                TokenFactory.abi,
                TOKEN_FACTORY_ADDRESS,
            );
            console.log('=== instanceTokenFactory ===', instanceTokenFactory);

            //@dev - Create instance of ExpiringMultiPartyLib.sol
            let instanceExpiringMultiPartyLib = null;
            let EXPIRING_MULTIPARTY_LIB_ADDRESS = contractAddressList["Kovan"]["UMA"]["ExpiringMultiPartyLib"];  //@dev - ExpiringMultiPartyLib.sol from UMA
            instanceExpiringMultiPartyLib = new web3.eth.Contract(
                ExpiringMultiPartyLib.abi,
                EXPIRING_MULTIPARTY_LIB_ADDRESS,
            );
            console.log('=== instanceExpiringMultiPartyLib ===', instanceExpiringMultiPartyLib);

            //@dev - Create instance of ExpiringMultiPartyCreator.sol
            let instanceExpiringMultiPartyCreator = null;
            let EXPIRING_MULTIPARTY_CREATOR_ADDRESS = contractAddressList["Kovan"]["UMA"]["ExpiringMultiPartyCreator"];  //@dev - ExpiringMultiPartyCreator.sol from UMA
            instanceExpiringMultiPartyCreator = new web3.eth.Contract(
                ExpiringMultiPartyCreator.abi,
                EXPIRING_MULTIPARTY_CREATOR_ADDRESS,
            );
            console.log('=== instanceExpiringMultiPartyCreator ===', instanceExpiringMultiPartyCreator);

            // Create instance of contracts
            let instanceExpiringMultiPartyViaNew = null;
            if (ExpiringMultiPartyViaNew.networks) {
              deployedNetwork = ExpiringMultiPartyViaNew.networks[networkId.toString()];
              if (deployedNetwork) {
                instanceExpiringMultiPartyViaNew = new web3.eth.Contract(
                  ExpiringMultiPartyViaNew.abi,
                  deployedNetwork && deployedNetwork.address,
                );
                console.log('=== instanceExpiringMultiPartyViaNew ===', instanceExpiringMultiPartyViaNew);
              }
            }

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

            if (StakeholderRegistry || ExpiringMultiPartyViaNew) {
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
                collateral_token: instanceDai,
                synthetic_token: instanceSyntheticToken,
                token_factory: instanceTokenFactory,
                expiring_multiparty_lib: instanceExpiringMultiPartyLib,
                expiring_multiparty_creator: instanceExpiringMultiPartyCreator,
                expiring_multiparty_via_new: instanceExpiringMultiPartyViaNew,
                identifier_whitelist: instanceIdentifierWhitelist,
                registry: instanceRegistry,
                address_whitelist: instanceAddressWhitelist,
                STAKEHOLDER_REGISTRY_ADDRESS: STAKEHOLDER_REGISTRY_ADDRESS,
                DAI_ADDRESS: DAI_ADDRESS,
                SYNTHETIC_TOKEN_ADDRESS: SYNTHETIC_TOKEN_ADDRESS,
                TOKEN_FACTORY_ADDRESS: TOKEN_FACTORY_ADDRESS,
                EXPIRING_MULTIPARTY_LIB_ADDRESS: EXPIRING_MULTIPARTY_LIB_ADDRESS,
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
                            <h4>Derivative Swap</h4><br /> 
                            <h4>by using UMA Synthetic Tokens</h4> <br />

                            <Button size={'small'} mt={3} mb={2} onClick={this.createEMP}> Create EMP </Button> <br />

                            <hr />

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
