import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  BackHandler,
  Linking,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import type { WebViewNavigation } from "react-native-webview";

const WEBSITE_URL = "https://wryoualdi.github.io/-novem-ever-yours-/";
const WEBSITE_ORIGIN = "https://wryoualdi.github.io";

export default function App() {
  const webView = useRef<WebView>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [canGoBack, setCanGoBack] = useState(false);

  const handleBack = useCallback(() => {
    if (canGoBack && !failed) {
      webView.current?.goBack();
      return true;
    }
    return false;
  }, [canGoBack, failed]);

  useEffect(() => {
    const subscription = BackHandler.addEventListener("hardwareBackPress", handleBack);
    return () => subscription.remove();
  }, [handleBack]);

  const handleNavigation = useCallback((event: WebViewNavigation) => {
    setCanGoBack(event.canGoBack);
  }, []);

  const handleExternalNavigation = useCallback((request: { url: string }) => {
    const url = request.url;
    if (
      url.startsWith("about:blank") ||
      url.startsWith("data:") ||
      url.startsWith(WEBSITE_ORIGIN)
    ) return true;

    Linking.openURL(url).catch(() => undefined);
    return false;
  }, []);

  const retry = () => {
    setFailed(false);
    setLoading(true);
    webView.current?.reload();
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView edges={["top", "bottom"]} style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#F7F0EA" />
      <WebView
        ref={webView}
        source={{ uri: WEBSITE_URL }}
        style={styles.webview}
        originWhitelist={["https://*", "http://*", "about:*", "data:*"]}
        onShouldStartLoadWithRequest={handleExternalNavigation}
        onNavigationStateChange={handleNavigation}
        onLoadStart={() => { setLoading(true); setFailed(false); }}
        onLoadEnd={() => setLoading(false)}
        onError={() => { setLoading(false); setFailed(true); }}
        onHttpError={(event) => {
          if (event.nativeEvent.statusCode >= 500) {
            setLoading(false);
            setFailed(true);
          }
        }}
        javaScriptEnabled
        domStorageEnabled
        sharedCookiesEnabled
        cacheEnabled
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction
        mixedContentMode="never"
        setSupportMultipleWindows={false}
        pullToRefreshEnabled
        applicationNameForUserAgent="Novem-ever-Yours-Android"
        allowsBackForwardNavigationGestures={false}
        renderLoading={() => null}
      />

      {loading && !failed && (
        <View pointerEvents="none" style={styles.loading}>
          <Text style={styles.monogram}>N</Text>
          <Text style={styles.brand}>Novem-ever Yours</Text>
          <Text style={styles.tagline}>WITH LOVE, IN EVERY SEASON</Text>
          <ActivityIndicator color="#7A3345" style={styles.spinner} />
        </View>
      )}

      {failed && (
        <View style={styles.error}>
          <Text style={styles.errorMark}>♡</Text>
          <Text style={styles.errorTitle}>A little pause between seasons</Text>
          <Text style={styles.errorCopy}>
            Website belum dapat dijangkau. Periksa koneksi internet, lalu coba lagi.
          </Text>
          <Pressable accessibilityRole="button" onPress={retry} style={({ pressed }) => [styles.retry, pressed && styles.pressed]}>
            <Text style={styles.retryText}>Try again</Text>
          </Pressable>
        </View>
      )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F7F0EA" },
  webview: { flex: 1, backgroundColor: "#F7F0EA" },
  loading: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F7F0EA",
  },
  monogram: { color: "#713044", fontFamily: "serif", fontSize: 76, lineHeight: 86 },
  brand: { color: "#713044", fontFamily: "serif", fontSize: 23, fontStyle: "italic", marginTop: 12 },
  tagline: { color: "#718092", fontSize: 9, letterSpacing: 3, marginTop: 10 },
  spinner: { marginTop: 34 },
  error: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 34,
    backgroundColor: "#F7F0EA",
  },
  errorMark: { color: "#A85D6C", fontSize: 54 },
  errorTitle: { color: "#713044", fontFamily: "serif", fontSize: 25, textAlign: "center", marginTop: 18 },
  errorCopy: { color: "#687586", fontSize: 14, lineHeight: 22, textAlign: "center", marginTop: 12 },
  retry: { backgroundColor: "#713044", borderRadius: 24, paddingHorizontal: 28, paddingVertical: 13, marginTop: 26 },
  retryText: { color: "#FFF9F4", fontSize: 13, fontWeight: "600", letterSpacing: 0.4 },
  pressed: { opacity: 0.78 },
});
