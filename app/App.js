import * as React from 'react';
import { WebView } from 'react-native-webview';
import { SafeAreaView, StatusBar } from 'react-native';

export default class App extends React.Component {
  render () {
    return (
      <>
        <StatusBar barStyle="white-content" />
        <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
          <WebView source={{ uri: 'https://www.ffaso.com' }} style={{ marginTop: 0 }} />
        </SafeAreaView>
      </>
    )
  }
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
