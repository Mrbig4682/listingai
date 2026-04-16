# ListingAI Android TWA Derleyici Rehberi (Mac)

Bu rehber, ListingAI web uygulamasını Android Trusted Web Activity (TWA) olarak derlemeye yardımcı olur.

## Sistem Gereksinimleri

- macOS 12.0 veya üzeri (M1/M2/M3/M4 Pro uyumlu)
- Minimum 8 GB RAM (ideal: 16 GB)
- Minimum 15 GB boş disk alanı

## Adım 1: Xcode Command Line Tools Kurulumu

```bash
xcode-select --install
```

## Adım 2: Homebrew Kurulumu (eğer yoksa)

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

## Adım 3: Java/JDK Kurulumu

```bash
# Java 17 yükle (Android geliştirme için önerilen sürüm)
brew install openjdk@17

# Java path'ini bash/zsh profiline ekle
# ~/.zshrc veya ~/.bash_profile dosyasını aç ve ekle:
# export PATH="/opt/homebrew/opt/openjdk@17/bin:$PATH"
# export JAVA_HOME="/opt/homebrew/opt/openjdk@17"

# Sonra terminalı yenile:
source ~/.zshrc
# veya
source ~/.bash_profile

# Kontrol et:
java -version
```

## Adım 4: Android SDK Kurulumu

### Seçenek A: Android Studio (Önerilen)
1. https://developer.android.com/studio adresinden indir
2. Yükle ve aç
3. Android Studio Preferences > Appearance & Behavior > System Settings > Android SDK
4. Aşağıdaki bileşenleri yükle:
   - **SDK Platforms**: Android 14 (API 34), Android 13 (API 33)
   - **SDK Tools**:
     - Android SDK Build-Tools (latest)
     - Android Emulator
     - Android SDK Platform-Tools
     - Google Play Services
5. Android SDK Location'u not et (genellikle: ~/Library/Android/sdk)

### Seçenek B: Command Line Tools (İleri Kullanıcılar)
```bash
# Android SDK dizini oluştur
mkdir -p ~/Library/Android/sdk
cd ~/Library/Android/sdk

# Command line tools indir (macOS M1/M4 Pro için ARM64 sürümü)
curl -o cmdline-tools.zip "https://dl.google.com/android/repository/commandlinetools-mac-10406996_latest.zip"
unzip cmdline-tools.zip
mv cmdline-tools latest

# Path ayarla
echo 'export ANDROID_SDK_ROOT=~/Library/Android/sdk' >> ~/.zshrc
echo 'export PATH=$ANDROID_SDK_ROOT/cmdline-tools/latest/bin:$PATH' >> ~/.zshrc
source ~/.zshrc

# SDK bileşenlerini yükle
sdkmanager --sdk_root=$ANDROID_SDK_ROOT "platforms;android-34" "build-tools;34.0.0" "platform-tools"
```

## Adım 5: Environment Variables Ayarla

`~/.zshrc` veya `~/.bash_profile` dosyasına ekle:

```bash
export JAVA_HOME="/opt/homebrew/opt/openjdk@17"
export ANDROID_SDK_ROOT="$HOME/Library/Android/sdk"
export PATH="$JAVA_HOME/bin:$ANDROID_SDK_ROOT/cmdline-tools/latest/bin:$ANDROID_SDK_ROOT/tools:$ANDROID_SDK_ROOT/tools/bin:$ANDROID_SDK_ROOT/platform-tools:$PATH"
```

Terminal'i yenile:
```bash
source ~/.zshrc
```

## Adım 6: Derleyici Betiğini Çalıştır

```bash
cd /path/to/listingai
chmod +x build-apk.sh
./build-apk.sh
```

## Sonuç

Başarılı derlemeden sonra APK dosyası bulunur:
- **Debug APK**: `android/app/build/outputs/apk/debug/app-debug.apk`
- **Release APK**: `android/app/build/outputs/bundle/release/app-release.aab` (Play Store için)

## Android'de Test Etme

### USB ile Test (Fiziksel Cihaz)
```bash
# Android cihazı bağla, USB debugging'i etkinleştir
adb devices  # Cihazı görsün
./build-apk.sh --install

# Veya manuel yükleme:
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```

### Emülatör ile Test
```bash
# Android Studio'dan emülatör başlat veya:
emulator -avd Pixel_4a_API_34 &

# APK yükle:
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```

## Sorun Giderme

### "Gradle daemon exited unexpectedly"
```bash
cd android
./gradlew --stop
./gradlew clean
```

### "ANDROID_SDK_ROOT not found"
Android SDK yolu doğru ayarlandığından emin ol.

### "Gradle sync failed"
```bash
cd android
rm -rf .gradle build
./gradlew clean
```

## Release Build (Play Store için)

Signing key oluştur:
```bash
keytool -genkey -v -keystore ~/listingai-release-key.keystore \
  -keyalg RSA -keysize 2048 -validity 10000 -alias listingai
```

`android/gradle.properties` dosyasına ekle:
```properties
MYAPP_RELEASE_STORE_FILE=~/listingai-release-key.keystore
MYAPP_RELEASE_KEY_ALIAS=listingai
MYAPP_RELEASE_STORE_PASSWORD=<password>
MYAPP_RELEASE_KEY_PASSWORD=<password>
```

Release bundle oluştur:
```bash
cd android
./gradlew bundleRelease
```

AAB dosyası: `android/app/build/outputs/bundle/release/app-release.aab`

## Başarılı Derlemeden Sonra

1. APK veya AAB dosyasını telefonda test et
2. Web uygulaması https://listingai-gamma.vercel.app'dan yükleniyor mu kontrol et
3. Kullanıcı arayüzü düzgün göründü mü?
4. Play Store'a upload etmek için AAB dosyasını kullan

## Yardımcı Kaynaklar

- [Capacitor Android Docs](https://capacitor.ionicframework.com/docs/android)
- [Android Developer Guide](https://developer.android.com/guide)
- [Trusted Web Activities Guide](https://developers.google.com/web/android/trusted-web-activity)
