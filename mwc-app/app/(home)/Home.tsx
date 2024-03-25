import React from "react";
import {  Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Button from "../../modules/mwc-module/src/components/CustomButton";
import { router } from "expo-router";


type Props = {
  walletInit: () => void;
  switchToMainnet: () => void;
  switchToFloonet: () => void;
  error: Error | undefined | null;
  walletCreated: boolean;
  isFloonet: boolean;
  //settings: SettingsState;
  legalAccepted: boolean;
};



const Home: React.FC<Props> = ({ }) => {
  
  const onNewWallet = (isNew: boolean) => {
    console.log({ isNew });
     router.push('/(home)/LegalDisclaimer');
  }

  return (
   <View testID="HomeScreen" style={styles.wrapper}>
      <View style={styles.flexGrow}></View>
      <View>
        <Text style={styles.appTitle}>Mimblewimble</Text>
        <Text style={styles.appSlogan}>mwc wallet you've deserved</Text>
      </View>

      <Button
        onPress={()=> onNewWallet(true)}
        onLongPress={() => {
          // Handle button long-press event
        }}
        title="Create new wallet"
        iconLeft={[]}
        iconRight={[]}
        style={styles.actionButton}
        textStyle={[]}
        testID="NewWalletButton"
        // ... Other props
      />
      <Button
        onPress={() =>onNewWallet(false)}
        onLongPress={() => {
          // Handle button long-press event
        }}
        title="Restore from paper key"
        iconLeft={[]}
        iconRight={[]}
        style={styles.actionButton}
        textStyle={[]}
        // ... Other props
      />
       <View style={styles.flexGrow}></View>
      {/* <Spacer />
      {isFloonet && (
        <View style={styles.testnetDisclaimer}>
          <Text style={styles.testnetDisclaimerText}>
            This app is configured to use testnet
          </Text>
          <NativeButton
            title="Switch to mainnet"
            onPress={() => switchToMainnet()}
          />
        </View>
      )}
      <FlexGrow />
      
      <TouchableOpacity style={styles.version} onPress={onVersionClick}>
        <Text>
          Version: {DeviceInfo.getVersion()} build {DeviceInfo.getBuildNumber()}
        </Text>
      </TouchableOpacity> */}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    padding: 16,
    flexGrow: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  actionButton: {
    marginBottom: 20,
    width: '100%',
  },
  appTitle: {
    fontSize: 32,
    fontWeight: '600',
  },
  appSlogan: {
    fontSize: 20,
    fontWeight: '500',
    marginBottom: 30,
  },
  testnetDisclaimer: {
    width: '100%',
    alignItems: 'center',
  },
  testnetDisclaimerText: {
    textAlign: 'center',
    width: '100%',
  },
  version: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingBottom: Platform.select({ ios: 8, android: 40 }),
  },
   flexGrow: {
    flexGrow: 1,
  },
});

export default Home;
