use grin_wallet_api as api;
use grin_wallet_config as config;
use grin_wallet_controller::Error;
use grin_wallet_controller::ErrorKind;
use grin_wallet_impls as impls;
use grin_wallet_libwallet as libwallet;
use grin_wallet_util::grin_core::global::ChainTypes;
use grin_wallet_util::grin_keychain as keychain;
use grin_wallet_util::grin_util as util;

use grin_wallet_impls::lifecycle::WalletSeed;
use impls::keychain::Keychain;
use keychain::ExtKeychain;
use libwallet::proof::proofaddress::ProvableAddress;
use libwallet::NodeClient;
use libwallet::WalletLCProvider;

use std::sync::Arc;
use util::{Mutex, ZeroingString};

use api::Owner;
use config::parse_node_address_string;
use config::WalletConfig;
use grin_wallet_util::grin_core::global;
use impls::{DefaultLCProvider, DefaultWalletImpl, HTTPNodeClient};
use libwallet::WalletInst;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone)]
struct Config {
    data_file_dir: String,
    check_node_api_http_addr: String,
    chain: String,
    account: Option<String>,
}

// Define a struct to hold the addresses
struct Addresses {
    mqs_public_address: String,
    tor_slatepack_address: String,
}

type Wallet = Arc<
    Mutex<
        Box<
            dyn WalletInst<
                'static,
                DefaultLCProvider<'static, HTTPNodeClient, ExtKeychain>,
                HTTPNodeClient,
                ExtKeychain,
            >,
        >,
    >,
>;

fn inst_wallet<L>(
    wallet_config: WalletConfig,
    node_client: HTTPNodeClient,
) -> Result<
    Arc<
        Mutex<
            Box<
                dyn WalletInst<
                    'static,
                    DefaultLCProvider<'static, HTTPNodeClient, ExtKeychain>,
                    HTTPNodeClient,
                    ExtKeychain,
                >,
            >,
        >,
    >,
    Error,
>
where
    DefaultWalletImpl<'static, HTTPNodeClient>: WalletInst<'static, L, HTTPNodeClient, ExtKeychain>,
    L: WalletLCProvider<'static, HTTPNodeClient, ExtKeychain>,
{
    let mut wallet =
        Box::new(DefaultWalletImpl::<'static, HTTPNodeClient>::new(node_client.clone()).unwrap())
            as Box<
                dyn WalletInst<
                    'static,
                    DefaultLCProvider<HTTPNodeClient, ExtKeychain>,
                    HTTPNodeClient,
                    ExtKeychain,
                >,
            >;

    // Wallet LifeCycle Provider provides all functions init wallet and work with seeds, etc...
    let lc = wallet.lc_provider().unwrap();

    // The top level wallet directory should be set manually (in the reference implementation,
    // this is provided in the WalletConfig)
    let _ = lc.set_top_level_directory(&wallet_config.data_file_dir);

    Ok(Arc::new(Mutex::new(wallet)))
}

fn get_wallet_config(config: Config) -> Result<WalletConfig, Error> {
    let chain_type = match config.chain.as_ref() {
        "mainnet" => ChainTypes::Mainnet,
        "floonet" => ChainTypes::Floonet,
        "usertesting" => ChainTypes::UserTesting,
        "automatedtesting" => ChainTypes::AutomatedTesting,
        _ => ChainTypes::Floonet,
    };

    let mut wallet_config = WalletConfig::default();
    wallet_config.chain_type = Some(chain_type);
    wallet_config.check_node_api_http_addr = config.check_node_api_http_addr;
    wallet_config.data_file_dir = config.data_file_dir;

    Ok(wallet_config)
}

fn init_wallet(config_json: &str, phrase: &str, password: &str) -> Result<(), Error> {
    // TODO: error handling here: Handle when we can't parse the config due to invalid config
    let config: Config = serde_json::from_str(&config_json).unwrap();
    let wallet_config = get_wallet_config(config.clone())?;
    let wallet = get_wallet(&config)?;
    let api_owner = get_owner(&wallet, &wallet_config)?;
    let _ = api_owner.create_wallet(None, None, 0, ZeroingString::from(password.clone()), None);

    Ok(())
}

fn get_wallet(config: &Config) -> Result<Wallet, Error> {
    let wallet_config = get_wallet_config(config.clone())?;
    let target_chaintype = wallet_config.chain_type.unwrap_or(ChainTypes::Mainnet);

    if !global::GLOBAL_CHAIN_TYPE.is_init() {
        global::init_global_chain_type(target_chaintype)
    };

    if global::get_chain_type() != target_chaintype {
        global::set_local_chain_type(target_chaintype);
    };

    // A NodeClient must first be created to handle communication between
    // the wallet and the node.
    let node_list = parse_node_address_string(wallet_config.check_node_api_http_addr.clone());
    let node_client = HTTPNodeClient::new(node_list, None).unwrap();

    let wallet = inst_wallet::<DefaultLCProvider<HTTPNodeClient, ExtKeychain>>(
        wallet_config.clone(),
        node_client,
    )?;

    return Ok(wallet);
}

fn open_wallet(config_json: &str, password: &str) -> Result<Wallet, Error> {
    // TODO: error handling here: Handle when we can't parse the config due to invalid config
    let config: Config = serde_json::from_str(&config_json).unwrap();
    let wallet = get_wallet(&config)?;
    let mut wallet_lock = wallet.lock();
    let lc = wallet_lock.lc_provider()?;
    let wallet_inst = lc.open_wallet(
        None,
        ZeroingString::from(password.clone()),
        true,
        false,
        Some(&config.data_file_dir),
    )?;

    Ok(wallet.clone())
}

fn close_wallet(wallet: &Wallet) -> Result<(), Error> {
    let mut wallet_lock = wallet.lock();
    let lc = wallet_lock.lc_provider()?;
    if let Ok(open_wallet) = lc.wallet_exists(None, None) {
        if open_wallet {
            lc.close_wallet(None)?;
        }
    }

    Ok(())
}

fn get_owner(
    wallet: &Wallet,
    wallet_config: &WalletConfig,
) -> Result<
    Owner<DefaultLCProvider<'static, HTTPNodeClient, ExtKeychain>, HTTPNodeClient, ExtKeychain>,
    Error,
> {
    let api_owner = Owner::new(wallet.clone(), None, None);
    let _ = api_owner.set_top_level_directory(&wallet_config.data_file_dir.clone());
    let _ = api_owner.create_config(&wallet_config.chain_type.unwrap(), None, None, None, None);

    Ok(api_owner)
}

fn get_wallet_address(config_json: &str, password: &str) -> Result<Addresses, Error> {
    let config: Config = serde_json::from_str(&config_json).unwrap();
    let wallet_config = get_wallet_config(config.clone()).unwrap();
    let wallet = get_wallet(&config).unwrap();

    let api_owner = get_owner(&wallet, &wallet_config).unwrap();
    let keychain_mask = api_owner
        .open_wallet(None, ZeroingString::from(password), true, None)
        .unwrap();

    let mqs_pub_key = api_owner.get_mqs_address(keychain_mask.as_ref()).unwrap();
    let tor_pub_key = api_owner
        .get_wallet_public_address(keychain_mask.as_ref())
        .unwrap();

    let mqs_addr = ProvableAddress::from_pub_key(&mqs_pub_key);
    let tor_addr = ProvableAddress::from_tor_pub_key(&tor_pub_key);

    // Return the addresses as a struct
    Ok(Addresses {
        mqs_public_address: mqs_addr.to_string(),
        tor_slatepack_address: tor_addr.to_string(),
    })
}

fn get_wallet_phrase(config_json: &str, password: &str) {
    let config: Config = serde_json::from_str(&config_json).unwrap();
    let wallet_config = get_wallet_config(config.clone()).unwrap();
    let wallet = get_wallet(&config).unwrap();

    let api_owner = get_owner(&wallet, &wallet_config).unwrap();
    let res = api_owner.get_mnemonic(
        None,
        ZeroingString::from(password),
        Some(wallet_config.data_file_dir.clone().as_str()),
    );

    println!("{}", "phrase".to_string());
    println!("{}", &*res.unwrap());

    // grin_wallet_impls::lifecycle::show_recovery_phrase(ZeroingString::from(res.unwrap()));

    let seed = WalletSeed::from_file(
        &wallet_config.get_data_path().as_str(),
        ZeroingString::from(password),
    );

    // grin_wallet_impls::lifecycle::show_recovery_phrase();
    println!("{}", "phrase".to_string());
    println!("{}", &*ZeroingString::from(password));
}

fn main() {
    // THESE ARE SAMPLE SIMULATIONS CALLS FOR THE WALLET USED FOR TESTING
    let test_config = Config {
        data_file_dir: "./.mwc".to_string(),
        check_node_api_http_addr: "".to_string(),
        chain: format!("{:?}", ChainTypes::Floonet.clone()),
        account: None,
    };

    let config_json = serde_json::to_string(&test_config).unwrap();
    let password = "password";

    let _ = init_wallet(&config_json, "", &password);
    let _ = open_wallet(&config_json, &password);
    let _ = get_wallet_address(&config_json, &password);
    let _ = get_wallet_phrase(&config_json, &password);
}
