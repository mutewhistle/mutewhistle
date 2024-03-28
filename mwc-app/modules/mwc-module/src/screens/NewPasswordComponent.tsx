import React, { useEffect, useRef, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native';
import { connect } from 'react-redux'
import Button from '../components/CustomButton';
import FormTextInput from '../components/FormTextInput';
import { router } from 'expo-router';
import { initWallet } from '../../../mwc-module';
import { useAppDispatch } from '../store/hooks';
import { callInitWallet } from '../../../../app/(home)/NewPasswordSlice';

type Props = {
  error: Error | undefined | null;
  newWallet: boolean;
  setIsNew: (value: boolean) => void;
};

function NewPasswordComponent(props: Props) {
  const dispatch = useAppDispatch();
  const newWallet: Props['newWallet'] = true;
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    
  },[newWallet])

  const handleSubmit = () => {
    const mnemonic = dispatch(callInitWallet(password));
    if (!newWallet && mnemonic) router.push('/(home)/VerifyPaperKey');
      
    else router.push({
      pathname: "/(home)/ViewPaperKey", params: { fromSettings: false, mnemonic }
      })
  };

  return (
    <>
      <View style={styles.wrapper}>
        <Text>Choose a strong password to protect your new wallet.</Text>
        <FormTextInput
          testID="Password"
          returnKeyType={"next"}
          autoFocus={true}
          secureTextEntry={true}
          onChange={setPassword}
          value={password}
          title="Password"
        />
        {/* <Spacer /> */}
        <FormTextInput
          testID="ConfirmPassword"
          returnKeyType={"done"}
          autoFocus={false}
          secureTextEntry={true}
          onChange={setConfirmPassword}
          onFocus={() => {
            // setTimeout(() => {
            //   scrollView.current?.scrollToEnd()
            // }, 100)
          }}
          value={confirmPassword}
          title="Confirm password"
        />
        {/* <FlexGrow />
          <Spacer /> */}
        <View>
          <Button
            testID="SubmitPassword"
            title={"Continue"}
            onPress={async () => {
              handleSubmit();
              // if (newWallet) {
              //   const mnemonic = await WalletBridge.seedNew(32)
              //   navigation.navigate('ViewPaperKey', {
              //     fromSettings: false,
              //     mnemonic,
              //     password,
              //   })
              // } else {
              //   navigation.navigate('VerifyPaperKey', {
              //     title: 'Paper key',
              //     password,
              //   })
              // }
            }}
            disabled={!(password && password === confirmPassword)}
          />
        </View>
      </View>
    </>
  );
}

export default NewPasswordComponent;


const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
    flex: 1,
  },
})