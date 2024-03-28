import ExpoModulesCore

public class MwcModule: Module {
  // Each module class must implement the definition function. The definition consists of components
  // that describes the module's functionality and behavior.
  // See https://docs.expo.dev/modules/module-api for more details about available components.
  public func definition() -> ModuleDefinition {
    // Sets the name of the module that JavaScript code will use to refer to the module. Takes a string as an argument.
    // Can be inferred from module's class name, but it's recommended to set it explicitly for clarity.
    // The module will be accessible from `requireNativeModule('MwcModule')` in JavaScript.
    Name("MwcModule")

    // Sets constant properties on the module. Can take a dictionary or a closure that returns a dictionary.
    Constants([
      "PI": Double.pi
    ])

    // Defines event names that the module can send to JavaScript.
    Events("onChange")

    // Defines a JavaScript synchronous function that runs the native code on the JavaScript thread.
    Function("initWallet") { (config: String, phrase:String, password: String) -> String in
    // Convert Swift strings to C strings
    guard let configCString = config.cString(using: .utf8) else {
        print("Error converting config to C string")
        return ""
    }


     guard let phraseCString = phrase.cString(using: .utf8) else {
        print("Error converting phrase to C string")
        return ""
    }


    
    guard let passwordCString = password.cString(using: .utf8) else {
        print("Error converting password to C string")
        return ""
    }

    // Call the Rust function
    guard let resultCString = get_init_wallet(configCString,phraseCString, passwordCString) else {
        print("Error calling get_test_string")
        return ""
    }

    // Convert the result from C string to Swift string
    let result = String(cString: resultCString)

    // Free the memory allocated by the Rust function
    free(resultCString)

    return result
}

    

    Function("getTestString") { (username: String, password: String) -> String in
    // Convert Swift strings to C strings
    guard let usernameCString = username.cString(using: .utf8) else {
        print("Error converting username to C string")
        return ""
    }
    
    guard let passwordCString = password.cString(using: .utf8) else {
        print("Error converting password to C string")
        return ""
    }

    // Call the Rust function
    guard let resultCString = get_test_string(usernameCString, passwordCString) else {
        print("Error calling get_test_string")
        return ""
    }

    // Convert the result from C string to Swift string
    let result = String(cString: resultCString)

    // Free the memory allocated by the Rust function
    free(resultCString)

    return result
}


    // AsyncFunction("initWallet") { (a: Int32, b: Int32) -> Int32 in
    //   return rust_add(a, b)
    // }

    // Defines a JavaScript function that always returns a Promise and whose native code
    // is by default dispatched on the different thread than the JavaScript runtime runs on.
    AsyncFunction("setValueAsync") { (value: String) in
      // Send an event to JavaScript.
      self.sendEvent("onChange", [
        "value": value
      ])
    }

    // Enables the module to be used as a native view. Definition components that are accepted as part of the
    // view definition: Prop, Events.
    View(MwcModuleView.self) {
      // Defines a setter for the `name` prop.
      Prop("name") { (view: MwcModuleView, prop: String) in
        print(prop)
      }
    }
  }
}
