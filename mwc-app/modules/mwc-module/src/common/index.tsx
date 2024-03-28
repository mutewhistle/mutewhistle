import { Platform } from 'react-native'
import RNFS from 'react-native-fs'
export const isAndroid = Platform.OS === 'android';

export const SLATES_DIRECTORY = RNFS.DocumentDirectoryPath + '/slates'


export const checkSlatesDirectory = () => {
  RNFS.exists(SLATES_DIRECTORY).then(exists => {
    if (!exists) {
      RNFS.mkdir(SLATES_DIRECTORY, {
        NSURLIsExcludedFromBackupKey: true,
      }).then(() => {
        console.log(`${SLATES_DIRECTORY} was created`)
      })
    }
  })
}

export const checkApplicationSupportDirectory = () => {
  RNFS.exists(APPLICATION_SUPPORT_DIRECTORY).then(exists => {
    if (!exists) {
      RNFS.mkdir(APPLICATION_SUPPORT_DIRECTORY, {
        NSURLIsExcludedFromBackupKey: true,
      }).then(() => {
        console.log(`${APPLICATION_SUPPORT_DIRECTORY} was created`)
      })
    }
  })
}

export const checkWalletDataDirectory = async () => {
  const exists = await RNFS.exists(WALLET_DATA_DIRECTORY)
  if (!exists) {
    await RNFS.mkdir(WALLET_DATA_DIRECTORY, {
      NSURLIsExcludedFromBackupKey: true,
    })
    console.log(`${WALLET_DATA_DIRECTORY} was created`)
  }
}


export const APPLICATION_SUPPORT_DIRECTORY = isAndroid
  ? RNFS.DocumentDirectoryPath
    : RNFS.LibraryDirectoryPath + '/Application Support'
  
export const WALLET_DATA_DIRECTORY =
  APPLICATION_SUPPORT_DIRECTORY + '/wallet_data'