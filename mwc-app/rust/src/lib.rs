// Conditional compilation for iOS platform
#[cfg(target_os = "ios")]
mod ios;

use config::GRIN_WALLET_DIR;
// External crate imports
use grin_wallet_api as api;
use grin_wallet_config as config;
use grin_wallet_controller::Error;
use grin_wallet_controller::ErrorKind;
use grin_wallet_impls as impls;
use grin_wallet_libwallet as libwallet;
use grin_wallet_util::grin_core::global::ChainTypes;
use grin_wallet_util::grin_keychain as keychain;
use grin_wallet_util::grin_util as util;

// Internal crate imports
use grin_wallet_impls::lifecycle::WalletSeed;
use impls::keychain::Keychain;
use keychain::ExtKeychain;
use libwallet::proof::proofaddress::ProvableAddress;
use libwallet::swap::ethereum::Mainnet;
use libwallet::NodeClient;
use libwallet::WalletLCProvider;

// Standard library imports
use std::sync::Arc;
use util::{Mutex, ZeroingString};

use api::Owner;
use config::parse_node_address_string;
use config::WalletConfig;
use grin_wallet_util::grin_core::global;
use impls::{DefaultLCProvider, DefaultWalletImpl, HTTPNodeClient};
use libwallet::WalletInst;
use serde::{Deserialize, Serialize};

// Configuration structure for the wallet
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

// Alias for the wallet type
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

// Instantiate the wallet
fn inst_wallet<L>(wallet_config: WalletConfig, node_client: HTTPNodeClient) -> Result<Wallet, Error>
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

    // Wallet LifeCycle Provider provides all functions to initialize the wallet and work with seeds, etc...
    let lc = wallet.lc_provider().unwrap();

    // Set the top level wallet directory manually
    let _ = lc.set_top_level_directory(&wallet_config.data_file_dir);

    Ok(Arc::new(Mutex::new(wallet)))
}

// Define a function to convert a string to the corresponding enum variant
fn parse_chain_type(chain: &str) -> ChainTypes {
    match chain {
        "mainnet" => ChainTypes::Mainnet,
        "floonet" => ChainTypes::Floonet,
        "usertesting" => ChainTypes::UserTesting,
        "automatedtesting" => ChainTypes::AutomatedTesting,
        _ => ChainTypes::Floonet, // Default to Floonet if the input string doesn't match any known chain type
    }
}

// Retrieve wallet configuration from JSON
fn get_wallet_config(config: Config) -> Result<WalletConfig, Error> {
    // Parse the chain type from the provided Config
    let chain_type = parse_chain_type(&config.chain);

    // Create a new WalletConfig using default values and populate its fields
    let mut wallet_config = WalletConfig::default();
    wallet_config.chain_type = Some(chain_type);
    wallet_config.check_node_api_http_addr = config.check_node_api_http_addr;
    wallet_config.data_file_dir = config.data_file_dir;

    // Return the WalletConfig
    Ok(wallet_config)
}

// Initialize the wallet with provided configuration and passphrase
fn init_wallet(config_json: &str, phrase: &str, password: &str) -> Result<String, Error> {
    // Deserialize configuration from JSON
    let config: Config = serde_json::from_str(&config_json).unwrap();

    // Retrieve or create the wallet instance
    let wallet = get_wallet(&config)?;

    // Acquire a lock on the wallet instance to ensure exclusive access
    let mut wallet_lock = wallet.lock();

    // Retrieve the Wallet LifeCycle Provider from the locked wallet
    let lc = wallet_lock.lc_provider()?;

    // Parse the chain type from the provided Config
    let chain_type = parse_chain_type(&config.chain);

    // Create the wallet with provided passphrase and configuration
    lc.create_wallet(
        None,
        Some(ZeroingString::from(phrase)),
        32,
        ZeroingString::from(password),
        match chain_type {
            ChainTypes::Mainnet => false,
            _ => true,
        },
        Some(&config.data_file_dir),
    )?;

    Ok("".to_owned())
}

// Retrieve wallet instance from configuration
fn get_wallet(config: &Config) -> Result<Wallet, Error> {
    // Get wallet configuration
    let wallet_config = get_wallet_config(config.clone())?;

    // Determine the chain type for the wallet
    let target_chaintype = wallet_config.chain_type.unwrap_or(ChainTypes::Mainnet);

    // Initialize global chain type if not already initialized
    if !global::GLOBAL_CHAIN_TYPE.is_init() {
        global::init_global_chain_type(target_chaintype)
    };

    // Set local chain type if it differs from the global one
    if global::get_chain_type() != target_chaintype {
        global::set_local_chain_type(target_chaintype);
    };

    // A NodeClient must first be created to handle communication between
    // the wallet and the node.
    let node_list = parse_node_address_string(wallet_config.check_node_api_http_addr.clone());
    let node_client = HTTPNodeClient::new(node_list, None).unwrap();

    // Instantiate the wallet with the provided configuration and node client
    let wallet = inst_wallet::<DefaultLCProvider<HTTPNodeClient, ExtKeychain>>(
        wallet_config.clone(),
        node_client,
    )?;

    Ok(wallet)
}

// Open an existing wallet with provided configuration and password
fn open_wallet(config_json: &str, password: &str) -> Result<Wallet, Error> {
    // Deserialize configuration from JSON
    let config: Config = serde_json::from_str(&config_json).unwrap();

    // Retrieve or create the wallet instance
    let wallet = get_wallet(&config)?;

    // Acquire a lock on the wallet instance to ensure exclusive access
    let mut wallet_lock = wallet.lock();

    // Retrieve the Wallet LifeCycle Provider from the locked wallet
    let lc = wallet_lock.lc_provider()?;

    // Parse the chain type from the provided Config
    let chain_type = parse_chain_type(&config.chain);

    // Open the wallet with provided password
    let _ = lc.open_wallet(
        None,
        ZeroingString::from(password),
        false,
        match chain_type {
            ChainTypes::Mainnet => false,
            _ => true,
        },
        Some(&config.data_file_dir),
    )?;

    Ok(wallet.clone())
}

// Close the provided wallet
fn close_wallet(wallet: &Wallet) -> Result<(), Error> {
    // Acquire a lock on the wallet instance to ensure exclusive access
    let mut wallet_lock = wallet.lock();

    // Retrieve the Wallet LifeCycle Provider from the locked wallet
    let lc = wallet_lock.lc_provider()?;

    // Check if the wallet is open, if yes, close it
    if let Ok(open_wallet) = lc.wallet_exists(None, None) {
        if open_wallet {
            lc.close_wallet(None)?;
        }
    }

    Ok(())
}

// Retrieve wallet owner information
fn get_owner(
    wallet: &Wallet,
    wallet_config: &WalletConfig,
) -> Result<
    Owner<DefaultLCProvider<'static, HTTPNodeClient, ExtKeychain>, HTTPNodeClient, ExtKeychain>,
    Error,
> {
    // Create wallet owner instance
    let api_owner = Owner::new(wallet.clone(), None, None);

    // Set the top-level directory for the wallet owner
    let _ = api_owner.set_top_level_directory(&wallet_config.data_file_dir.clone());

    // Create wallet configuration for the owner
    let _ = api_owner.create_config(&wallet_config.chain_type.unwrap(), None, None, None, None);

    Ok(api_owner)
}

// Get the wallet addresses (MQS and TOR)
fn get_wallet_addresses(config_json: &str, password: &str) -> Result<Addresses, Error> {
    // Deserialize configuration from JSON
    let config: Config = serde_json::from_str(&config_json).unwrap();

    // Retrieve wallet configuration
    let wallet_config = get_wallet_config(config.clone()).unwrap();

    // Retrieve or create the wallet instance
    let wallet = get_wallet(&config).unwrap();

    // Get wallet owner
    let api_owner = get_owner(&wallet, &wallet_config).unwrap();

    // Open wallet and get keychain mask
    let keychain_mask = api_owner
        .open_wallet(None, ZeroingString::from(password), true, None)
        .unwrap();

    // Get MQS and TOR public keys
    let mqs_pub_key = api_owner.get_mqs_address(keychain_mask.as_ref()).unwrap();
    let tor_pub_key = api_owner
        .get_wallet_public_address(keychain_mask.as_ref())
        .unwrap();

    // Convert public keys to ProvableAddresses
    let mqs_addr = ProvableAddress::from_pub_key(&mqs_pub_key);
    let tor_addr = ProvableAddress::from_tor_pub_key(&tor_pub_key);

    // Return the addresses as a struct
    Ok(Addresses {
        mqs_public_address: mqs_addr.to_string(),
        tor_slatepack_address: tor_addr.to_string(),
    })
}

// Get the wallet phrase from file
fn get_wallet_phrase(data_file_dir: &str, passphrase: ZeroingString) -> Result<String, Error> {
    let seed = WalletSeed::from_file(&format!("{}/{}", ".mwc", data_file_dir), passphrase)?;
    Ok(seed.to_mnemonic()?)
}

// Generate a new seed with the specified length and return it as a mnemonic string
fn seed_new(seed_length: usize) -> Result<String, Error> {
    // Initialize a new WalletSeed with the specified length
    let seed = WalletSeed::init_new(seed_length);

    // Convert the seed to a mnemonic string and return
    Ok(seed.to_mnemonic()?)
}

// Get string with username and password
fn get_string(username: String, password: String) -> String {
    // Format and return the string
    let result = format!(
        "Your username is {} and your password is {}",
        username, password
    );
    result
}
