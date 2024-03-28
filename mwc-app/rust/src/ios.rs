use std::ffi::{CString, CStr};
use std::os::raw::c_char;
use std::ptr;
use super::*;


#[no_mangle]
pub extern "C" fn rust_add(left: i32, right: i32) -> i32 {
    left + right
}


#[no_mangle]
pub extern "C" fn get_test_string(username: *const c_char, password: *const c_char) -> *mut c_char {
    unsafe {
        // Convert username and password from C strings to Rust strings
        let username_cstr = CStr::from_ptr(username);
        let password_cstr = CStr::from_ptr(password);

        // Perform the necessary operations
        let username_str = match username_cstr.to_str() {
            Ok(s) => s,
            Err(e) => {
                eprintln!("Error converting username to string: {}", e);
                return ptr::null_mut();
            }
        };
        
        let password_str = match password_cstr.to_str() {
            Ok(s) => s,
            Err(e) => {
                eprintln!("Error converting password to string: {}", e);
                return ptr::null_mut();
            }
        };

        println!("Received username: {}, password: {}", username_str, password_str);

        let result = get_string(username_str.to_string(),password_str.to_string());

        // Convert the result back to a C string and return it
        CString::into_raw(CString::new(result).unwrap()) as *mut _
    }
}


#[no_mangle]
pub extern "C" fn get_init_wallet(config: *const c_char, phrase: *const c_char, password: *const c_char) -> *mut c_char {
    unsafe {
        // Convert username and password from C strings to Rust strings
        let config_cstr = CStr::from_ptr(config);
        let phrase_cstr = CStr::from_ptr(phrase);
        let password_cstr = CStr::from_ptr(password);

        // Perform the necessary operations
        let config_str = match config_cstr.to_str() {
            Ok(s) => s,
            Err(e) => {
                eprintln!("Error converting config to string: {}", e);
                return ptr::null_mut();
            }
        };
        
        let password_str = match password_cstr.to_str() {
            Ok(s) => s,
            Err(e) => {
                eprintln!("Error converting password to string: {}", e);
                return ptr::null_mut();
            }
        };

        let phrase_str = match phrase_cstr.to_str() {
            Ok(s) => s,
            Err(e) => {
                eprintln!("Error converting phrase to string: {}", e);
                return ptr::null_mut();
            }
        };

        println!("Received config: {}, password: {}", config_str, password_str);

        let result = init_wallet(config_str, phrase_str, password_str);

        // Convert the result back to a C string and return it
        CString::into_raw(CString::new(result).unwrap()) as *mut _
       
    }
}




/// cbindgen:ignore
#[cfg(target_os = "android")]
pub mod android {
    use crate::rust_add;
    use jni::JNIEnv;
    use jni::objects::JClass;
    use jni::sys::jint;
    
    #[no_mangle]
    pub unsafe extern "C" fn Java_expo_modules_myrustmodule_MyRustModule_rustAdd(
        _env: JNIEnv,
        _class: JClass,
        a: jint,
        b: jint
    ) -> jint {
        rust_add(a, b)
    }
}