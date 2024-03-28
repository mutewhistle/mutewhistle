import React from 'react'
import { useDispatch } from 'react-redux'
import { TouchableOpacity, Platform, Text, StyleSheet } from 'react-native'
import Clipboard from '@react-native-clipboard/clipboard';
// import FontAwesome5Icons from 'react-native-vector-icons/FontAwesome5'
// import { Text } from 'src/components/CustomFont'
// import { styleSheetFactory, useThemedStyles } from 'src/themes'

function CopyButton({
  subject,
  content,
}: {
  subject: string
  content: string
}) {
  //const [styles] = useThemedStyles(themedStyles)
  const dispatch = useDispatch()
  const copyToClipboard = (s: string, subject: string) => {
    return () => {
      Clipboard.setString(s)
      dispatch({
        type: 'TOAST_SHOW',
        text: subject + ' was copied',
      })
    }
  }

  return (
    <TouchableOpacity onPress={copyToClipboard(content, subject)}>
      <Text style={styles.slatepackHeaderCopy}>
        Copy
        {/* <FontAwesome5Icons name="copy" size={18} style={styles.icon} /> */}
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create(
  { slatepackHeaderCopy: {
    fontWeight: Platform.select({ android: '700', ios: '500' }),
    //color: theme.link,
    fontSize: 16,
  },
  icon: {
    //color: theme.link,
  },}
)

export default CopyButton
