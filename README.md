# StudyFind Blockchain Medical Record Saver

A mobile-based decentralized application (DAPP) used to store medical records. Built with ReactNative, NodeJS and Ethereum.

## Release Note v1.0
### Patient Features
- Login
- Sign out
- Create account
- Upload medical record with new image taken
- Upload medical record with image stored on phone
- Delete existing medical record
- View existing medical record
- View profile information
- View accepted viewers
- Block viewers
- View access invitations from professionals
- Accept access invitivitations from professionals
- Reject access invitations form professionals

### Professional Features
- Login
- Sign out
- Create account
- View list of patients
- View profile information
- View information of selected patient
- View medical records of a selected patient
- Send access invitation to patients

### Bug Fixes
- Fixed errors in uploading large images
- Fixed errors in managing multiple invitations simultaneously
- Fixed errors in loading patient profile

### Known Bugs and Defects
- When creating an account, a user can request resending the verification code immediately after requesting a previous verification code. However, they should be given around 60 seconds.
- There is no restriction on the length of a user’s name, so styling will be compromised if the user’s name or a professional’s institute name is too long.
- Cannot delete multiple records at the same time.

## Requirements
MacOS or Windows 7 and higher, with [Android Studio](https://developer.android.com/studio/install) and Android emulator installed.

## Dependencies and installation
Install [NodeJS](https://nodejs.org/en/) 14 or higher on your computer, then:
- On terminal, go to /src/backend/ directory, run `npm install`.
- On terminal, go to /src/frontend/ directory, run `npm install --save`.

List of dependencies:
- [@google-cloud/firestore ^4.15.1](https://github.com/googleapis/nodejs-firestore)
- [body-parser ^1.19.0](https://github.com/expressjs/body-parser)
- [cors ^2.8.4](https://github.com/expressjs/cors)
- [dotenv ^6.1.0](https://github.com/motdotla/dotenv)
- [express ^4.17.1](https://github.com/expressjs/express)
- [ganache-cli ^6.12.2](https://github.com/trufflesuite/ganache-cli-archive)
- [js-sha256 ^0.9.0](https://github.com/emn178/js-sha256)
- [nodemailer ^6.6.3](https://github.com/nodemailer/nodemailer)
- [solc ^0.8.7](https://github.com/ethereum/solc-js)
- [web3 ^1.5.2](https://github.com/PlatONnetwork/client-sdk-js)
- [axios ^0.21.4](https://github.com/axios/axios)
- [mocha ^9.1.3](https://github.com/mochajs/mocha)
- [nodemon ^2.0.14](https://github.com/remy/nodemon)
- [truffle-hdwallet-provider ^1.0.17](https://github.com/trufflesuite/truffle-hdwallet-provider)
- [@expo/vector-icons ^12.0.5](https://github.com/expo/vector-icons)
- [@react-native-community/masked-view ^0.1.10](https://github.com/LaudateCorpus1/react-native-masked-view)
- [@react-native-picker/picker ^1.15.0](https://github.com/react-native-picker/picker)
- [expo ~40.0.0](https://github.com/expo/expo)
- [expo-app-loading ^1.1.2](https://github.com/null-none/expo-app-loading)
- [expo-file-system ~9.3.0](https://github.com/expo/expo)
- [expo-image-picker ~9.2.0](https://github.com/expo/expo)
- [expo-permissions ~10.0.0](https://github.com/expo/expo)
- [expo-status-bar ~1.0.3](https://github.com/expo/expo)
- [native-base ^2.8.2](https://github.com/GeekyAnts/NativeBase)
- [react 16.13.1](https://github.com/facebook/react)
- [react-dom 16.13.1](https://github.com/facebook/react)
- [react-native](https://github.com/expo/react-native/archive/sdk-40.0.1.tar.gz)
- [react-native-elements ^3.3.2](https://github.com/react-native-elements/react-native-elements)
- [react-native-fs ^2.18.0](https://github.com/itinance/react-native-fs)
- [react-native-gesture-handler ~1.8.0](https://github.com/software-mansion/react-native-gesture-handler)
- [react-native-image-base64 ^0.1.4](https://github.com/Snapp-FidMe/react-native-image-base64)
- [react-native-ionicons ^4.6.5](https://github.com/arniu/react-native-ionicons)
- [react-native-keyboard-aware-scroll-view ^0.9.3](https://github.com/APSL/react-native-keyboard-aware-scroll-view)
- [react-native-keyboard-aware-scrollview ^2.1.0](https://github.com/wix/react-native-keyboard-aware-scrollview)
- [react-native-linear-gradient ^2.5.6](https://github.com/react-native-linear-gradient/react-native-linear-gradient)
- [react-native-paper ^4.9.2](https://github.com/callstack/react-native-paper)
- [react-native-reanimated ^1.13.3](https://github.com/software-mansion/react-native-reanimated)
- [react-native-safe-area-context ^3.2.0](https://github.com/th3rdwave/react-native-safe-area-context)
- [react-native-screens ~2.15.2](https://github.com/software-mansion/react-native-screens)
- [react-native-select-dropdown ^1.1.0](https://github.com/AdelRedaa97/react-native-select-dropdown)
- [react-native-vector-icons ^8.1.0](https://github.com/oblador/react-native-vector-icons)
- [react-native-web ~0.13.12](https://github.com/necolas/react-native-web)
- [react-navigation ^4.4.4](https://github.com/srameshr/react-native-redux-crud)
- [react-navigation-header-buttons ^6.3.1](https://github.com/vonovak/react-navigation-header-buttons)
- [react-navigation-stack ^2.10.4](https://github.com/react-navigation/stack)
- [react-navigation-tabs ^2.11.1](https://github.com/react-navigation/tabs)
- [react-redux ^7.2.4](https://github.com/reduxjs/react-redux)
- [reanimated-bottom-sheet ^1.0.0-alpha.22](https://github.com/osdnk/react-native-reanimated-bottom-sheet)
- [redux ^4.1.1](https://github.com/reduxjs/redux)
- [@babel/core ^7.9.0](https://github.com/babel/babel)

## How to run
1. Follow the previous instructions to set up environment and install dependencies.
2. Open Android Studio and go to AVD Manager --> create virtual device.
3. On terminal, go to /src/backend/ directory, run `npm start`. The terminal should display "server running on PORT 3000".
4. Open the virtual device created in step #2 above.
5. On terminal, go to /src/frontend/ directory, run `npm run android`. This will take a while on the first time.

## Troubleshoot
- If Android emulator fails to start, reinstall the emulator in AVD manager. (This problem occurs frequently)
- If you are using Windows and see the error message `Unable to locate adb within SDK` when starting emulator, follow this [instruction](https://docs.microsoft.com/en-us/xamarin/android/get-started/installation/android-emulator/troubleshooting?pivots=windows#incorrect-bios-settings) enable virtualization option on your CPU.
- If you cannot create a virtual device, configure x86 images before proceeding to the final set up page.
- For any other problems, refer to the [Android Studio Official Website](https://developer.android.com/studio/run/emulator-troubleshooting)
