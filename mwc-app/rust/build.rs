extern crate cbindgen;

use std::env;

fn main() {
    let crate_dir = env::var("CARGO_MANIFEST_DIR").unwrap();

    cbindgen::Builder::new()
        .with_crate(crate_dir)
        .with_language(cbindgen::Language::C)
        .with_autogen_warning(
            r#"typedef struct api_server {} api_server;
            typedef struct wallet {} wallet;"#,
        )
        // .rename_item("ApiServer", "api_server")
        // .rename_item("Wallet", "wallet")
        .generate()
        .expect("Unable to generate bindings")
        .write_to_file("../modules/mwc-module/ios/rust/mwc_wallet_lib.h");
}
