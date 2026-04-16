# ListingAI Android TWA Uygulaması Derleme Kılavuzu

Bu proje, ListingAI web uygulamasını (https://listingai-gamma.vercel.app) native Android uygulamasına dönüştüren bir **Trusted Web Activity (TWA)** 'dir.

## Hızlı Başlangıç (30 saniye)

```bash
# Dosyanı indir
cd /path/to/listingai

# Otomatik derlemeyi çalıştır
./build-apk.sh
```

**Debug APK çıktısı:** `android/app/build/outputs/apk/debug/app-debug.apk`

## Nedir Trusted Web Activity?

TWA, web uygulamanızı Chrome tabanlı bir native Android uygulaması içine yerleştiren Google'ın tekniğidir. Avantajları:

✓ Web kodu değişmez (React/Next.js)
✓ iOS ve Android'de tutarlı deneyim
✓ Google Play Store'a yüklenebilir
✓ Kullanıcılar PWA dosyalarını indirebilir

## Sistem Gereksinimleri

### Mac M4 Pro için

- **Java 17+** (OpenJDK)
- **Android SDK** (API Level 33+)
- **Gradle** (otomatik indirilir)
- **Node.js 18+** (npm)

## Kurulum Adımları

### 1. Java Yükle (ilk seferde)

```bash
# Homebrew varsa:
brew install openjdk@17

# ~/.zshrc dosyasına ekle:
export JAVA_HOME="/opt/homebrew/opt/openjdk@17"
export PATH="$JAVA_HOME/bin:$PATH"

# Yeniden yükle:
source ~/.zshrc

# Kontrol:
java -version
```

### 2. Android Studio Yükle

1. İndir: https://developer.android.com/studio
2. Aç ve ilk kurulum tamamla
3. "Android SDK" → "SDK Tools" bölümünden indir:
   - Android 14 (API 34)
   - Android 13 (API 33)
   - Build Tools (latest)
   - Platform Tools

### 3. Environment Variable Ayarla

`~/.zshrc` dosyasına ekle:

```bash
export ANDROID_SDK_ROOT="$HOME/Library/Android/sdk"
export PATH="$ANDROID_SDK_ROOT/cmdline-tools/latest/bin:$PATH"
```

## Derleme Komutları

### Debug Derleme (Test için)

```bash
cd listingai
./build-apk.sh
```

Çıktı: `android/app/build/outputs/apk/debug/app-debug.apk`

### Release Derleme (Play Store için)

Önce imzalama anahtarı oluştur:

```bash
keytool -genkey -v -keystore ~/listingai-release-key.keystore \
  -keyalg RSA -keysize 2048 -validity 10000 -alias listingai
```

Sonra:

```bash
cd listingai
./build-apk.sh --release
```

Çıktı: `android/app/build/outputs/bundle/release/app-release.aab`

### Test ve Yükleme

```bash
# USB'de cihaz varken:
./build-apk.sh --install

# Veya manuel yükleme:
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```

## Proje Yapısı

```
listingai/
├── src/                    # React Next.js kaynağı
├── out/                    # Derlenmiş web dosyaları
├── android/                # Capacitor Android projesi
│   ├── app/
│   │   └── build.gradle    # Android yapılandırması
│   └── gradlew             # Gradle wrapper
├── capacitor.config.json   # TWA yapılandırması
├── build-apk.sh           # Derleme betiği
├── BUILD_APK_MAC.md       # Detaylı Mac rehberi
└── BUILD_ANDROID.md       # Bu dosya
```

## Yapılandırma

### App Bilgileri (capacitor.config.json)

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

- **Brand Color (Splash):** #7c3aed (mor)
- **Background:** #faf8ff (açık arka plan)

## Sorun Giderme

### "ANDROID_SDK_ROOT not found"

```bash
# Android Studio'dan bulun:
# Preferences → Appearance & Behavior → System Settings → Android SDK

# Manual olarak ayarla:
export ANDROID_SDK_ROOT="$HOME/Library/Android/sdk"
```

### "Gradle daemon exited unexpectedly"

```bash
cd android
./gradlew --stop
./gradlew clean
cd ..
./build-apk.sh
```

### "Could not find com.android.tools.build:gradle"

```bash
rm -rf android/build android/.gradle
./build-apk.sh
```

### APK yükleme başarısız

```bash
# Cihazı kontrol et:
adb devices

# Eski APK'yı kaldır:
adb uninstall com.listingai.app

# Tekrar yükle:
./build-apk.sh --install
```

## Play Store'a Yükleme

1. Google Play Console'a git: https://play.google.com/console
2. Yeni uygulama oluştur
3. "App bundles" → `app-release.aab` yükle
4. Mağaza listeleme bilgilerini doldur
5. Release aşamasından geç

## Test Kontrol Listesi

- [ ] APK Android cihazında yüklü
- [ ] Uygulama başlıyor
- [ ] Web sayfası yükleniyor
- [ ] Tüm bağlantılar çalışıyor
- [ ] Ofline modu (Cache) çalışıyor
- [ ] Bildirimler çalışıyor (varsa)

## İleri Bilgiler

### Versiyon Güncellemeleri

`android/app/build.gradle` dosyasında:

```gradle
defaultConfig {
    versionCode 1      // Her yayın için artır
    versionName "1.0"  // Semantic versioning
}
```

### Simge ve Splash Ekranı

- **Icon:** `public/icon-192.png` (192x192)
- **Icon:** `public/icon-512.png` (512x512)
- Capacitor otomatik olarak dönüştürür

### İzinler

`android/app/src/main/AndroidManifest.xml` dosyasını düzenle:

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.CAMERA" />
<!-- İhtiyaç olan diğer izinler -->
```

## Faydalı Kaynaklar

- 📖 [Capacitor Android Docs](https://capacitor.ionicframework.com/docs/android)
- 📖 [Trusted Web Activities](https://developers.google.com/web/android/trusted-web-activity)
- 📖 [Android Developer Guide](https://developer.android.com/guide)
- 🎥 [TWA Derlemesi Video Rehberi](https://www.youtube.com/watch?v=6NV6JFdR3c0)

## Sık Sorulan Sorular (FAQ)

**S: Web kodu değişirse ne yapmalıyım?**
Cevap: `npm run build` çalıştır, sonra `./build-apk.sh` ile yeni APK oluştur.

**S: Çevrimdışı modda çalışır mı?**
Cevap: Evet, Capacitor otomatik caching yapıyor. PWA manifest ayarlarını kontrol et.

**S: Push Notifications'ı nasıl etkinleştirim?**
Cevap: `google-services.json` dosyasını Firebase'den indir ve `android/app/` klasörüne koy.

**S: macOS'te M1/M2/M3/M4'ü destekliyor mu?**
Cevap: Evet, tam destek var.

---

**Son Güncelleme:** April 4, 2026
**Yapı Türü:** TWA (Trusted Web Activity) + Capacitor
**API Seviyesi:** 33+
