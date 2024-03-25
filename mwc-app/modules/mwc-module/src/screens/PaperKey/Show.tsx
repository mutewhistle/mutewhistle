/**
 * Copyright 2019 Ironbelly Devs
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
// import {
//   FlexGrow,
//   isAndroid,
//   Spacer,
//   UnderHeaderBlock,
//   UnderHeaderBlockText,
// } from 'src/common'
// import { monoSpaceFont, Button, Text } from 'src/components/CustomFont'
// import { NavigationProps } from 'src/common/types'
// import {
//   slightlyTransparent,
//   styleSheetFactory,
//   useThemedStyles,
// } from 'src/themes'
import { SafeAreaView } from 'react-native-safe-area-context'
import Button from '../../components/CustomButton';
import { router } from 'expo-router';
// import CopyButton from 'src/components/CopyButton'

interface OwnProps {
  mnemonic: string;
  phrase: string;
  generateSeed: (length: number) => void;
}

// type Props = NavigationProps<'ViewPaperKey'> & OwnProps;

function Show({ route, navigation }: any) {
  //const [styles] = useThemedStyles(themedStyles)
  // const { fromSettings, mnemonic } = route?.params
  return (
    <SafeAreaView edges={['bottom']} style={styles.wrapper}>

        <Text>
          Your paper key is the only way to restore your Grin wallet if your
          phone is lost, stolen, broken, or upgraded.
          
            It consists of 24 words. Please write them down on a piece of paper and keep safe.
        </Text>

      <View style={styles.words}>
        <Text style={styles.wordText}>
          {/* {mnemonic} */}
          mnemonic
        </Text>
      </View>
      <View style={styles.copyButton}>
        {/* <CopyButton content={mnemonic} subject="Paper Key" /> */}
         <Button
            testID="PaperKey"
            title={'Paper Key'}
            onPress={async () => {
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
            // disabled={!(password && password === confirmPassword)}
          />
      </View>
      {/* <FlexGrow />fromSettings */}
       <View style={{flexWrap: 'wrap',
    flexDirection: 'column',
    flex: 1}}>
      {true && (
        <Button
          testID="ShowPaperKeyContinueButton"
          title="Continue"
          disabled={false}
          style={styles.continueButton}
            onPress={() => {
             router.push('/(home)/VerifyPaperKey');
            // if (route.params.password) {
            //   navigation.navigate('VerifyPaperKey', {
            //     title: 'Verify Paper Key',
            //     mnemonic,
            //     password: route.params.password,
            //   })
            // }
          }}
        />
        )}
        </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingHorizontal: 16,
  },
  scrollView: { flex: 1, backgroundColor: 'brown' },
  words: {
    marginBottom: 16,
    marginHorizontal: 0,
    //backgroundColor: theme.surface,
    padding: 16,
    borderRadius: 16,
  },
  wordText: {
    fontSize: 18,
    // color: theme.onBackground,
    // fontFamily: monoSpaceFont,
    lineHeight: 36,
    textAlign: 'center',
    fontWeight: '600',
  },
  wordNumber: {
   // color: slightlyTransparent(theme.onBackground),
    paddingVertical: 8,
    fontSize: 24,
   // fontFamily: monoSpaceFont,
  },
  copyButton: {
    alignItems: 'center',
  },
  continueButton: {
    //marginBottom: isAndroid ? 16 : 0,
  },
})

export default Show
