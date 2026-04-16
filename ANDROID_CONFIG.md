# ListingAI Android TWA - Teknik Yapılandırması

## Genel Bilgi

| Özellik | Değer |
|---------|-------|
| **Uygulama Adı** | ListingAI |
| **Paket Adı** | com.listingai.app |
| **Web URL** | https://listingai-gamma.vercel.app |
| **Yapı Türü** | Trusted Web Activity (TWA) + Capacitor |
| **Min SDK Level** | 21 (Android 5.0) |
| **Target SDK Level** | 34 (Android 14) |
| **Compile SDK Level** | 34 |

## Android Manifest Yapılandırması

**Dosya:** `android/app/src/main/AndroidManifest.xml`

### Mevcut İzinler
```xml
<uses-permission android:name="android.permission.INTERNET" />
```

### Gerekirse Eklenecek İzinler

Aşağıdaki özellikleri aktif hale getirmek için AndroidManifest.xml'e ekle:

#### Kamera Erişimi
```xml
<uses-permission android:name="android.permission.CAMERA" />
```

#### Konum Erişimi
```xml
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
```

#### Mikrofon Erişimi
```xml
<uses-permission android:name="android.permission.RECORD_AUDIO" />
```

#### Dosya Erişimi
```xml
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```

#### Push Notifications
```xml
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
```

## Capacitor Yapılandırması

**Dosya:** `capacitor.config.json`

```json
{
  "appId": "com.listingai.app",
  "appName": "ListingAI",
  "webDir": "out",
  "server": {
    "url": "https://listingai-gamma.vercel.app",
    "cleartext": false,
    "allowNavigation": [
      "listingai-gamma.vercel.app",
      "*.vercel.app"
    ]
  },
  "android": {
    "backgroundColor": "#faf8ff",
    "allowMixedContent": false,
    "overScrollMode": "never",
    "minWebViewVersion": 90000000
  },
  "plugins": {
    "SplashScreen": {
      "launchShowDuration": 2000,
      "backgroundColor": "#7c3aed",
      "showSpinner": false,
      "androidScaleType": "CENTER_CROP",
      "splashFullScreen": true,
      "splashImmersive": true
    },
    "StatusBar": {
      "style": "LIGHT",
      "backgroundColor": "#7c3aed"
    }
  }
}
```

## Build.gradle Yapılandırması

**Dosya:** `android/app/build.gradle`

### Sürüm Bilgileri

```gradle
defaultConfig {
    applicationId "com.listingai.app"
    minSdkVersion 21        // Android 5.0+
    targetSdkVersion 34     // Android 14
    compileSdkVersion 34
    versionCode 1           // Her yayın için artır
    versionName "1.0"       // Semantic versioning
}
```

### Sürüm Güncellemeleri Nasıl Yapılır?

```gradle
// Version 1.0 → 1.0.1 (Bug fix)
versionCode 2
versionName "1.0.1"

// Version 1.0 → 1.1.0 (Yeni feature)
versionCode 3
versionName "1.1.0"

// Version 1.0 → 2.0.0 (Major release)
versionCode 4
versionName "2.0.0"
```

## Simge ve Splash Ekranı

### Simge Dosyaları

| Boyut | Dosya | Konum |
|-------|-------|-------|
| 192x192 | icon-192.png | public/ |
| 512x512 | icon-512.png | public/ |
| 1024x1024 | icon-1024.png | public/ |

Capacitor otomatik olarak dönüştürür:
- 48x48 (ldpi)
- 72x72 (hdpi)
- 96x96 (xhdpi)
- 144x144 (xxhdpi)
- 192x192 (xxxhdpi)

### Splash Ekranı Yapılandırması

```json
"SplashScreen": {
  "launchShowDuration": 2000,          // 2 saniye göster
  "backgroundColor": "#7c3aed",        // Mor arka plan
  "showSpinner": false,                // Spinner gösterme
  "androidScaleType": "CENTER_CROP",   // Simgeyi ortala
  "splashFullScreen": true,            // Tam ekran
  "splashImmersive": true              // Gesture navigation bar gizle
}
```

## Renk Şeması

### Primary Colors

```
Brand Color (Brand Primary):    #7c3aed (Violet)
Background Color:               #faf8ff (Very Light Purple)
Status Bar Color:               #7c3aed (Violet)
Splash Background:              #7c3aed (Violet)
```

### Özel Renkler (web uygulamasında)

`src/` klasöründe kullanılan renkler:
- Primary: #7c3aed
- Secondary: (tanımlanan varsa)
- Success: (tanımlanan varsa)
- Danger: (tanımlanan varsa)

## Network Yapılandırması

### HTTPS Enforced

```json
"server": {
  "url": "https://listingai-gamma.vercel.app",
  "cleartext": false,
  "allowNavigation": [
    "listingai-gamma.vercel.app",
    "*.vercel.app",
    "*.listingai.com"  // Kendi domain ekle
  ]
}
```

**Not:** Web sunucusu HTTPS kullanmalıdır. HTTP'ye izin verilmez.

### Mixed Content Desteği

```json
"allowMixedContent": false
```

HTTPS sayfasında HTTP içeriği yüklenmez (güvenlik).

## ProGuard Yapılandırması

**Dosya:** `android/app/proguard-rules.pro`

Release build'inde kod obfuskasyonu için.

### Standart Rules

```proguard
# Keep Capacitor plugins
-keep public class * extends com.getcapacitor.Plugin
-keep public class * extends com.getcapacitor.CapacitorPlugin

# Keep platform files
-keep class com.getcapacitor.** { *; }
-keep public class androidx.** { public *; }

# Keep JavaScript interface
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}
```

## Gradle Wrapper

**Dosya:** `android/gradlew` ve `gradle/wrapper/gradle-wrapper.properties`

Gradle sürümü otomatik indirilir. Proxy ayarı gerekirse:

```properties
# ~/.gradle/gradle.properties
systemProp.http.proxyHost=proxy.example.com
systemProp.http.proxyPort=8080
systemProp.https.proxyHost=proxy.example.com
systemProp.https.proxyPort=8080
```

## İleri Yapılandırmalar

### Firebase Cloud Messaging (Push Notifications)

1. Firebase Projesi oluştur: https://firebase.google.com/console
2. `google-services.json` indir
3. `android/app/` klasörüne koy
4. `build.gradle` dosyasında:

```gradle
dependencies {
    implementation 'com.google.firebase:firebase-messaging:23.2.1'
}
```

### Facebook/Google Login

`android/app/build.gradle` dosyasına ekle:

```gradle
dependencies {
    // Facebook Login
    implementation 'com.facebook.android:facebook-android-sdk:[latest]'

    // Google Sign-In
    implementation 'com.google.android.gms:play-services-auth:20.7.0'
}
```

### WebRTC (Video Call)

```gradle
dependencies {
    implementation 'org.webrtc:google-webrtc:M102'
}
```

### Payment Gateway (Strip, PayPal)

```gradle
dependencies {
    implementation 'com.stripe:stripe-android:20.25.0'
}
```

## Test ve Debug Yapılandırması

### Debug Mode

Build variant'i değiştir:
```bash
cd android
./gradlew assembleDebug    # Debug APK
./gradlew assembleRelease  # Release AAB
```

### Logcat ile Debug

```bash
adb logcat | grep com.listingai.app
```

### WebView Debug

Chrome DevTools ile debug et:
```bash
# Chrome'da aç:
chrome://inspect
```

## Signing Yapılandırması (Release)

**Dosya:** `android/app/build.gradle`

```gradle
signingConfigs {
    release {
        storeFile file(System.getenv("KEYSTORE_PATH") ?: "listingai.keystore")
        storePassword System.getenv("KEYSTORE_PASSWORD") ?: ""
        keyAlias System.getenv("KEY_ALIAS") ?: "listingai"
        keyPassword System.getenv("KEY_PASSWORD") ?: ""
    }
}
```

Environment variables ile kur:

```bash
export KEYSTORE_PATH="$HOME/listingai-release-key.keystore"
export KEYSTORE_PASSWORD="your-password"
export KEY_ALIAS="listingai"
export KEY_PASSWORD="your-key-password"

./build-apk.sh --release
```

## Performance Optimization

### ProGuard Minification

Release build'inde otomatik etkinleştir:

```gradle
buildTypes {
    release {
        minifyEnabled true
        proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
    }
}
```

### WebView Version

```json
"android": {
    "minWebViewVersion": 90000000  // Chrome 90+
}
```

## CI/CD Integration

GitHub Actions için `.github/workflows/android-build.yml`:

```yaml
name: Android Build

on: [push, pull_request]

jobs:
  build:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - name: Setup JDK
        uses: actions/setup-java@v2
        with:
          distribution: 'adopt'
          java-version: '17'
      - name: Build APK
        run: |
          npm install
          npm run build
          cd android
          ./gradlew assembleDebug
```

---

**Son Güncelleme:** April 4, 2026
**Dokümantasyon Sürümü:** 1.0
