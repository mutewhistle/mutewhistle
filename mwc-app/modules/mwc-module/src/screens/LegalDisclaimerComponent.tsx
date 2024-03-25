

import React, { useState } from 'react'

import { StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Link, router } from 'expo-router';
import Button from '../components/CustomButton';
import Checkbox from 'expo-checkbox';
import { colorTheme } from '../common/color';

interface OwnProps {
  acceptLegal: (value: boolean) => void;
}

//type Props = NavigationProps<'LegalDisclaimer'> & OwnProps;

export const termsUrl = 'https://ironbelly.app/terms'
export const privacyUrl = 'https://ironbelly.app/privacy'
export const grinUrl = 'https://grin-tech.org/'

const LegalDisclaimerComponent = ({ acceptLegal, navigation, route }: any) => {
  // const { nextScreen } = route?.params
  const [checked, setChecked] = useState(false)
  // const [styles, theme] = useThemedStyles(themedStyles)
  return (
    <SafeAreaView edges={['bottom']} style={styles.wrapper}>
      <View style={styles.main}>
        <Text style={styles.text}>Mwc - mobile wallet for </Text>
        <Link style={styles.text} href={grinUrl} >mimblewimble</Link>
        <Text style={styles.text}>. </Text>
        <Text style={styles.text}>
          Please, if you are not familiar with the blockchain technology, learn
          it first. It is important, that you know what you are doing!
        </Text>
        <Text style={styles.text}>
          Then read carefully Terms of Use and Privacy Policy and only then
          start using the app.
        </Text>
      </View>
      <View style={{ flexDirection: 'row'}}>
        <Checkbox
        
        onValueChange={() => {
          setChecked(!checked)
        }}
          value={checked}
           color={colorTheme.primaryColor}
      
      />
         <View style={styles.rightText}>
            <Text style={styles.checkboxText}>I agree to the </Text>
            <Link href={termsUrl}>Terms of Use</Link>
            <Text style={styles.checkboxText}> and the </Text>
            <Link href={privacyUrl}>Privacy Policy</Link>
            <Text style={styles.checkboxText}>.</Text>
          </View>
      </View>
      
      <View style={{  marginTop: 10}}>
      <Button 
        testID="IAgree"
        title={'Next'}
        style={{alignSelf: 'stretch'}}
        disabled={!checked}
        onPress={() => {
          //acceptLegal(true)
           router.push('/(home)/NewPassword');
        }}
        />
        </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
    flex: 1,
  },
  main: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    flex: 1,
    paddingTop: 16,
  },
  text: {
    fontSize: 20,
    // color: theme.onBackground,
  },
  checkboxText: {
    // color: theme.onBackground,
  },
  rightText: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    flex: 1,
    paddingLeft: 16,
  },
  
});


export default LegalDisclaimerComponent;

