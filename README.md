### Mute Whistle
Shhh.

## Run IOS APP
- npm i
- npm run
## start App
- npx expo start -c 

## iOS Build

build based on the target type your xcode supports

- Install Rust iOS targets
	- `rustup target add aarch64-apple-ios aarch64-apple-ios-sim x86_64-apple-ios`
- Compile Rust code for iOS
	- `cargo build --release --target aarch64-apple-ios`
	- `cargo build --release --target aarch64-apple-ios-sim`
  - `cargo build --target x86_64-apple-ios`

- Generate .h file for Rust code
	- `cbindgen --lang c --crate native_rust_lib --output native_rust_lib.h`
	- Note: This requires the `cbindgen` package to be installed. If you don't have it, you can install it with `cargo install cbindgen`
- Copy compiled Rust code to expo module
	- Note: Right now I've only got this working for the simulator target. To get this working on an actual device, we'll need to figure out what the current target is and conditionally use either the ios or ios-sim build
	- Create a new folder at `/modules/mwc-module/ios/rust`
	- Copy the `libnative_rust_lib.a` file from your target folder to `/modules/my-rust-module/ios/rust`
	- Copy the `native_rust_lib.h` file generated to `/modules/my-rust-module/ios/rust`
- Update `modules/mwc-module/ios/MwcModule.podspec` to include Rust code
	- Add `s.vendored_libraries = 'libnative_rust_lib.a'`
- Update native swift code to use Rust code
	- Add method to call Rust function in `MyModule.swift`
- Update podfile
	- `pod install --project-directory=ios`
- Import module in RN front-end and use them
- Start app in iOS simluator
  - `npm run ios`

## Android

- Install Rust Android targets
	- `rustup target add aarch64-linux-android armv7-linux-androideabi i686-linux-android x86_64-linux-android`
- Add `jni = "0.21.1"` dependency to Cargo.toml
- Add "cdylib" to crate-type in Cargo.toml to create a dynamic library
- Install `cargo-ndk`
	- `cargo install cargo-ndk`
- Build Rust code for Android
	- `cargo ndk --target aarch64-linux-android --platform 31 -- build --release`
	- `cargo ndk --target armv7-linux-androideabi --platform 31 -- build --release`
	- `cargo ndk --target i686-linux-android --platform 31 -- build --release`
	- `cargo ndk --target x86_64-linux-android --platform 31 -- build --release`
- Move compiled Rust code to expo module
  - Create a new folder at `/modules/my-rust-module/android/src/main/jniLibs`
  - Copy the `.so` files from `/target/aarch64-linux-android/release` to `/modules/my-rust-module/android/src/main/jniLibs/arm64-v8a`
  - Copy the `.so` files from `/target/armv7-linux-androideabi/release` to `/modules/my-rust-module/android/src/main/jniLibs/armeabi-v7a`
  - Copy the `.so` files from `/target/i686-linux-android/release` to `/modules/my-rust-module/android/src/main/jniLibs/x86`
  - Copy the `.so` files from `/target/x86_64-linux-android/release` to `/modules/my-rust-module/android/src/main/jniLibs/x86_64`
- Update `MyRustModule.kt` to use Rust code
  - Load library in `MyRustModule.kt`
  - Add function type to `MyRustModule.kt`
  - Define function in `MyRustModule.kt`
- Start app in Android emulator
  - `npm run android`
