import React from 'react'
import ReactNative, {
  KeyboardTypeOptions,
  ReturnKeyTypeOptions,
  TextInputIOSProps,
  NativeSyntheticEvent,
  TextInputFocusEventData,
  TextInputSubmitEditingEventData,
  View,
  StyleSheet,
  TextInput,
  Text,
} from 'react-native'
// import { TextInput, Text } from 'src/components/CustomFont'
// import {
//   slightlyTransparent,
//   styleSheetFactory,
//   useThemedStyles,
// } from 'src/themes'
type Props = {
  units?: string;
  placeholder?: string;
  testID?: string;
  title?: string;
  maxLength?: number;
  value: string;
  onChange: (value: string) => void;
  onFocus?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  autoFocus: boolean;
  secureTextEntry?: boolean;
  textContentType?: TextInputIOSProps['textContentType'];
  keyboardType?: KeyboardTypeOptions;
  autoCorrect?: boolean;
  getRef?: (instance: ReactNative.TextInput | null) => void;
  returnKeyType?: ReturnKeyTypeOptions;
  onSubmitEditing?: (
    e: NativeSyntheticEvent<TextInputSubmitEditingEventData>,
  ) => void;
  multiline?: boolean;
  readonly?: boolean;
};

const styles = StyleSheet.create({
  input: {
    marginLeft: -20,
    padding: 20,
    marginRight: -20,
    //backgroundColor: theme.surface,
    //color: theme.onSurface,
    fontSize: 18,
    fontWeight: '400',
    flexGrow: 1,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
   // color: theme.onBackground,
  },
  layout: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
  },
});

function FormTextInput(props: Props) {
  //const [styles, theme] = useThemedStyles(themedStyles)
  const {
    onChange,
    title,
    textContentType,
    keyboardType,
    returnKeyType,
    getRef,
    onSubmitEditing,
    ...passedProps
  } = props
  return (
    <React.Fragment>
      {title && <Text style={styles.title}>{title}</Text>}
      <View style={styles.layout}>
        <TextInput
          style={styles.input}
          // placeholderTextColor={slightlyTransparent(theme.onSurface)}
          // selectionColor={theme.onSurface}
          onChangeText={onChange}
          ref={getRef}
          keyboardType={keyboardType ?? 'default'}
          textContentType={textContentType ?? 'none'}
          returnKeyType={returnKeyType ?? 'default'}
          onSubmitEditing={onSubmitEditing}
          {...passedProps}
        />
      </View>
    </React.Fragment>
  )
}

export default FormTextInput
