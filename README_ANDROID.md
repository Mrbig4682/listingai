# ListingAI Android TWA - Derleme Sistemi

Açık kaynak ListingAI web uygulamasını native Android uygulamasına dönüştüren **Trusted Web Activity (TWA)** projesidir.

## 📱 Nedir?

Trusted Web Activity, Google'ın [Android aracılığıyla web uygulamalarının PWA davranışını destekleyen bir tekniktir. Bu system:

- **Web Kodu Korunur:** React/Next.js kaynağı değişmez
- **Native Performans:** Chrome tabanlı, GPU hızlandırılmış
- **Play Store Uyumlu:** AAB (Android App Bundle) ile yayınlanabilir
- **Çevrimdışı Destek:** Capacitor caching otomatik
- **Web Özellikleri:** PWA, Notifications, Camera, Location, etc.

## 🚀 Hızlı Kurulum (Mac)

### 1. Ön Gereksinimler
```bash
# Kontrol et
java -version        # Java 17+ gerekli
node --version       # Node.js 18+ gerekli
npm --version
```

### 2. İlk Kurulum
```bash
cd /path/to/listingai
chmod +x QUICKSTART_MAC.sh
./QUICKSTART_MAC.sh
```

Bu betik:
- ✓ Java 17'yi kurar
- ✓ Node.js bağımlılıklarını yükler
- ✓ Android SDK'yı kontrol eder

### 3. Android Studio Kurulması
1. İndir: https://developer.android.com/studio
2. Aç ve kurulumu tamamla
3. **SDK Manager**'dan:
   - Android 14 (API 34)
   - Android 13 (API 33)
   - Build Tools
   - Platform Tools

### 4. Derleme
```bash
./build-apk.sh              # Debug APK (test)
./build-apk.sh --install    # Debug + cihaza yükle
./build-apk.sh --release    # Release AAB (Play Store)
```

## 📁 Dosya Yapısı

```
listingai/
├── src/                         # React/Next.js Kaynağı
├── public/
│   ├── icon-192.png            # 192x192 simge
│   ├── icon-512.png            # 512x512 simge
│   └── icon-1024.png           # 1024x1024 simge
├── android/                     # Capacitor Android Projesi
│   ├── app/
│   │   ├── build.gradle        # Android yapı dosyası
│   │   └── src/
│   │       ├── main/
│   │       │   ├── AndroidManifest.xml
│   │       │   └── res/
│   │       └── test/
│   ├── build.gradle            # Root gradle
│   ├── gradlew                 # Gradle wrapper
│   └── gradle/
├── capacitor.config.json       # TWA yapılandırması
├── build-apk.sh               # Derleme betiği
├── QUICKSTART_MAC.sh           # Mac kurulum betiği
├── BUILD_ANDROID.md           # Detaylı rehber
├── BUILD_APK_MAC.md           # Mac-özel rehber
├── ANDROID_CONFIG.md          # Teknik yapılandırma
└── README_ANDROID.md          # Bu dosya
```

## 🔧 Yapılandırma

### App Bilgileri (`capacitor.config.json`)

```json
{
  "appId": "com.listingai.app",
  "appName": "ListingAI",
  "server": {
    "url": "https://listingai-gamma.vercel.app"
  },
  "android": {
    "backgroundColor": "#faf8ff"
  }
}
```

### Renk Şeması
- **Brand:** #7c3aed (Mor - splash, status bar)
- **Background:** #faf8ff (Açık mor)

## 📦 Derleme Komutları

| Komut | Açıklama | Çıktı |
|-------|----------|-------|
| `./build-apk.sh` | Debug APK derle | `app-debug.apk` |
| `./build-apk.sh --install` | Debug + test cihazına yükle | `app-debug.apk` + USB yüklemesi |
| `./build-apk.sh --release` | Release AAB derle | `app-release.aab` |

## 🎯 Play Store'a Yayınlama

### 1. Signing Key Oluştur (ilk seferde)
```bash
keytool -genkey -v -keystore ~/listingai-release-key.keystore \
  -keyalg RSA -keysize 2048 -validity 10000 -alias listingai
```

### 2. gradle.properties Yapılandırması
```bash
echo 'MYAPP_RELEASE_STORE_FILE=~/listingai-release-key.keystore' >> android/gradle.properties
echo 'MYAPP_RELEASE_KEY_ALIAS=listingai' >> android/gradle.properties
```

### 3. Release Bundle Oluştur
```bash
./build-apk.sh --release
```

### 4. Play Console'a Yükle
- Git: https://play.google.com/console
- "Internal Testing" → AAB Yükle
- "Alpha" → "Beta" → "Production" Yayınla

## 🧪 Test

### USB ile Test
```bash
# Cihazı bağla, USB debugging'i aç
adb devices               # Cihazı görsün
./build-apk.sh --install
```

### Emülatör ile Test
```bash
# Android Studio'dan emülatör başlat
emulator -avd Pixel_4a_API_34 &
./build-apk.sh --install
```

### WebView Debug
```bash
# Chrome'da DevTools aç
chrome://inspect
```

## 📊 Proje Bilgisi

| Özellik | Değer |
|---------|-------|
| **Türü** | Trusted Web Activity + Capacitor |
| **Framework** | React + Next.js |
| **Dil** | TypeScript |
| **Target SDK** | 34 (Android 14) |
| **Min SDK** | 21 (Android 5.0) |
| **Web URL** | https://listingai-gamma.vercel.app |
| **Paket Adı** | com.listingai.app |

## 🐛 Sorun Giderme

### Java bulunamadı
```bash
brew install openjdk@17
export JAVA_HOME="/opt/homebrew/opt/openjdk@17"
```

### Android SDK bulunamadı
1. Android Studio yükle
2. SDK Manager'dan SDK'yı kur
3. `ANDROID_SDK_ROOT` ayarla

### Gradle hataları
```bash
cd android
./gradlew --stop
./gradlew clean
cd ..
./build-apk.sh
```

### APK yükleme başarısız
```bash
adb uninstall com.listingai.app
./build-apk.sh --install
```

## 📚 Detaylı Rehberler

- **[BUILD_ANDROID.md](./BUILD_ANDROID.md)** - Tamamlı kurulum ve derleyici rehberi
- **[BUILD_APK_MAC.md](./BUILD_APK_MAC.md)** - Mac-özel ayrıntılı kurulum
- **[ANDROID_CONFIG.md](./ANDROID_CONFIG.md)** - Teknik yapılandırma referansı

## 🔗 Faydalı Kaynaklar

- 📖 [Capacitor Docs](https://capacitor.ionicframework.com/docs/android)
- 📖 [Android Developer Guide](https://developer.android.com/guide)
- 📖 [Trusted Web Activities](https://developers.google.com/web/android/trusted-web-activity)
- 🎥 [Android Build Tutorial](https://www.youtube.com/watch?v=6NV6JFdR3c0)

## ⚡ İpuçları

1. **Web Değişiklikleri:** `npm run build` → `./build-apk.sh`
2. **Sürüm Artırma:** `android/app/build.gradle` → `versionCode`
3. **Test Cihazı:** USB debugging'i Settings > Developer Options'ta aç
4. **Release:** `google-services.json` (Firebase) koyunca push notifications çalışır

## 📞 Destek

Sorunlar için:
1. Logs kontrol et: `adb logcat | grep ListingAI`
2. BUILD_APK_MAC.md'deki sorun giderme bölümüne bak
3. Android Studio'da sync'i yenile: File → Sync Project

---

**Son Güncelleme:** April 4, 2026
**Sürüm:** 1.0
**Yapı Türü:** Debug & Release APK/AAB
**Desteklenen Platformlar:** macOS (M1/M2/M3/M4), Linux, Windows
