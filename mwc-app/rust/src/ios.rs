use super::*;
use std::ffi::{CStr, CString};
use std::os::raw::c_char;

macro_rules! unwrap_string_to_c (
    ($func:expr, $error:expr) => (
        match $func {
            Ok(res) => {
                *$error = 0;
                CString::new(res.to_owned()).unwrap().into_raw()
            }
            Err(e) => {
                *$error = 1;
                CString::new(
                    serde_json::to_string(&format!("{}",e)).unwrap()).unwrap().into_raw()
            }
        }
        ));

macro_rules! unwrap_to_c (
    ($func:expr, $error:expr) => (
        match $func {
            Ok(res) => {
                *$error = 0;
                Box::into_raw(Box::new(res)) as usize
            }
            Err(e) => {
                *$error = 1;
                CString::new(
                    serde_json::to_string(&format!("{}",e)).unwrap()).unwrap().into_raw() as usize
            }
        }
        ));

fn cstr_to_rust(s: *const c_char) -> String {
    unsafe { CStr::from_ptr(s).to_string_lossy().into_owned() }
}

#[no_mangle]
pub unsafe extern "C" fn cstr_free(s: *mut c_char) {
    if s.is_null() {
        return;
    }
    CString::from_raw(s);
}

// Lib Functions
#[no_mangle]
pub unsafe extern "C" fn c_init_wallet(
    config_str: *const c_char,
    phrase: *const c_char,
    password: *const c_char,
    error: *mut u8,
) -> *const c_char {
    unwrap_string_to_c!(
        init_wallet(
            &cstr_to_rust(config_str),
            &cstr_to_rust(phrase),
            &cstr_to_rust(password),
        ),
        error
    )
}

#[no_mangle]
pub unsafe extern "C" fn c_get_test_string(
    password: *const c_char,
    error: *mut u8,
) -> *const c_char {
    unwrap_string_to_c!(get_test_string(cstr_to_rust(password)), error)
}
