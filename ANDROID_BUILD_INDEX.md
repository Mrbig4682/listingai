# ListingAI Android TWA - Derleme Sistem Rehberi

> **Türkçe kullanıcı için: [BAŞLA.txt](./BAŞLA.txt) dosyasını oku!**

## 🎯 Ne Yapacağız?

ListingAI web uygulamasını native Android'e dönüştüreceğiz. Bu sistem:
- **Bubblewrap/Capacitor tabanlı değildir**
- **Google'ın Trusted Web Activity (TWA) teknolojisini kullanır**
- **Command line'dan APK/AAB derlenebilir**
- **Mac M4 Pro'da anında çalışır**

## 📚 Dosya Rehberi

### 🔴 HEMEN BAŞLA (Yeni Kullanıcı)

```
1. BAŞLA.txt (Türkçe hızlı başlangıç)
   ↓
2. ./QUICKSTART_MAC.sh (Kurulum betiği)
   ↓
3. ./build-apk.sh (Derleme)
```

### 🟡 DETAYLI REHBERLER

| Dosya | İçerik | Okuma Süresi |
|-------|--------|--------------|
| **README_ANDROID.md** | Sistem genel bakışı, yapı, komutlar | 5 min |
| **BUILD_ANDROID.md** | Kapsamlı kurulum ve hata çözümü | 15 min |
| **BUILD_APK_MAC.md** | Mac'e özel detaylı adımlar | 20 min |
| **ANDROID_CONFIG.md** | Teknik yapılandırma ve advanced ayarlar | 10 min |

### 🟢 OTOMATİK BETIKLER

| Script | Amaç | Çalıştırma |
|--------|------|-----------|
| **QUICKSTART_MAC.sh** | İlk kurulum (Java, Node, SDK kontrol) | `./QUICKSTART_MAC.sh` |
| **build-apk.sh** | APK/AAB derleme | `./build-apk.sh` |

## 🚀 Hızlı Başlama (3 adım)

### 1. Ön Kontrol (1 dakika)
```bash
java -version    # Java 17+ gerekli
node --version   # Node 18+ gerekli
npm --version
```

### 2. Android Studio Yükle (Android SDK Manager'dan)
- Android 14 (API 34)
- Android 13 (API 33)
- Build Tools
- Platform Tools

### 3. Derleme
```bash
./build-apk.sh                # Debug APK
./build-apk.sh --install      # Debug + USB yüklemesi
./build-apk.sh --release      # Release AAB (Play Store)
```

## 📋 Kurulum Checklist

- [ ] Java 17 yüklü (`java -version`)
- [ ] Node.js 18+ yüklü (`node --version`)
- [ ] Android Studio yüklü
- [ ] Android SDK indirme tamamlandı (API 34, 33)
- [ ] ~/.zshrc'ye JAVA_HOME ve ANDROID_SDK_ROOT eklendi
- [ ] `./QUICKSTART_MAC.sh` başarıyla çalıştı
- [ ] `npm install` tamamlandı
- [ ] `./build-apk.sh` başarıyla derle yapıldı

## 🎯 Adım Adım Yol Haritası

```
Başla (BAŞLA.txt)
    ↓
Android Studio Yükle
    ↓
Java 17 + Node Yükle (QUICKSTART_MAC.sh)
    ↓
Environment Variable Ayarla
    ↓
npm install
    ↓
./build-apk.sh
    ↓
app-debug.apk (android/app/build/outputs/)
    ↓
Cihaza yükle ve test et
    ↓
Release ve Play Store (opsiyonel)
```

## 🛠️ Komut Referansı

### Derleme
```bash
./build-apk.sh                    # Debug APK derle
./build-apk.sh --install          # Debug + cihaza yükle
./build-apk.sh --release          # Release AAB (Play Store)
```

### Test ve Debug
```bash
adb devices                       # Bağlı cihazları göster
adb logcat | grep ListingAI       # Log göster
adb install -r app-debug.apk      # Manuel yükleme
adb shell am start -n com.listingai.app/.MainActivity  # Başlat
```

### Temizlik ve Yeniden Derleme
```bash
cd android && ./gradlew clean && cd ..
rm -rf node_modules package-lock.json
npm install
./build-apk.sh
```

## ❓ Sorun Giderme Hızlı Referansı

| Hata | Çözüm | Dosya |
|------|-------|-------|
| "Java not found" | `brew install openjdk@17` | BUILD_ANDROID.md |
| "Android SDK not found" | Android Studio SDK Manager | BUILD_APK_MAC.md |
| "ANDROID_SDK_ROOT not set" | `export ANDROID_SDK_ROOT=$HOME/Library/Android/sdk` | BUILD_APK_MAC.md |
| "Gradle errors" | `cd android && ./gradlew clean && cd ..` | ANDROID_CONFIG.md |
| "Build failed" | Log'u oku: `adb logcat` | BUILD_ANDROID.md |

## 📱 Proje Bilgileri

```
Uygulama Adı:      ListingAI
Paket Adı:         com.listingai.app
Web URL:           https://listingai-gamma.vercel.app
Simgeler:          public/icon-*.png
Target SDK:        34 (Android 14)
Min SDK:           21 (Android 5.0)
Build Aracı:       Gradle + Capacitor
Yapı Türü:         TWA (Trusted Web Activity)
```

## 🎨 Yapılandırma Dosyaları

```
capacitor.config.json              # TWA ayarları
android/app/build.gradle           # Android build dosyası
android/app/AndroidManifest.xml    # Android manifest
android/gradle.properties           # Gradle properties
```

## 🌍 Web Kodu Güncellemeleri

Web uygulaması (React/Next.js) değişirse:

```bash
npm run build                    # Web'i derle (out/ klasörü)
npx cap sync android             # Capacitor'ü senkronize et
./build-apk.sh                   # Yeni APK derle
```

## 📦 Çıktı Dosyaları

| Çıktı | Konum | Boyut | Amaç |
|-------|-------|-------|------|
| app-debug.apk | `android/app/build/outputs/apk/debug/` | 6-8 MB | Test |
| app-release.aab | `android/app/build/outputs/bundle/release/` | 5-7 MB | Play Store |

## 🎯 Play Store Yayınlama

1. Signing key oluştur: `keytool -genkey ...`
2. Release derle: `./build-apk.sh --release`
3. [Google Play Console](https://play.google.com/console)'da yükle
4. Internal Testing → Beta → Production

Detaylı: [BUILD_ANDROID.md](./BUILD_ANDROID.md) → "Play Store'a Yükleme" bölümü

## 📞 Hızlı Yardım

### İlk Derleme Başarısız
1. Tüm log'u oku
2. [BUILD_ANDROID.md](./BUILD_ANDROID.md) sorun giderme bölümü
3. [BAŞLA.txt](./BAŞLA.txt) Adım 4'ü kontrol et

### Cihaza Yükleme Başarısız
```bash
adb devices                    # Cihaz bağlı mı?
adb uninstall com.listingai.app   # Eski APK'yı kaldır
./build-apk.sh --install      # Yeniden yükle
```

### Emülatör Kullan
```bash
# Android Studio'da:
Tools → Device Manager → Emülatör başlat

# Komut satırından:
emulator -avd Pixel_4a_API_34 &
./build-apk.sh --install
```

## 🔐 Güvenlik Notları

- APK'nı imzalama anahtarını güvenli tut
- Release keystore'u Git'te commitle
- Production build için `--release` flag kullan
- Firebase google-services.json korunmalı

## 📊 Yapı Sistemi Özeti

```
Kaynaklar (src/)
    ↓ (npm run build)
Web Çıktısı (out/)
    ↓ (npx cap sync android)
Capacitor Android (android/)
    ↓ (./build-apk.sh)
APK/AAB (build/outputs/)
    ↓ (adb install / Play Store)
Android Device / Play Store
```

## 🎓 Öğrenme Kaynakları

- 📖 [Capacitor Android Docs](https://capacitor.ionicframework.com/docs/android)
- 📖 [Trusted Web Activity Guide](https://developers.google.com/web/android/trusted-web-activity)
- 📖 [Android Developer Portal](https://developer.android.com)
- 🎥 [YouTube TWA Tutorial](https://www.youtube.com/watch?v=6NV6JFdR3c0)

## ✅ Başarılı Derlemeden Sonra

- [ ] APK dosyası var (`app-debug.apk`)
- [ ] Dosya boyutu 6-8 MB
- [ ] Android cihazına yüklü (varsa)
- [ ] Uygulama başlıyor
- [ ] Web sitesi yükleniyor
- [ ] Simge göründü

## 🚨 En Sık Sorulan Sorular

**S: Build'in tamamlanması ne kadar zaman alır?**
C: İlk derleme: 5-10 dakika. Sonraki derlemeler: 1-3 dakika.

**S: Java sürümü kaç olmalı?**
C: Java 17 veya üzeri. `java -version` ile kontrol et.

**S: Android Studio şart mı?**
C: SDK yüklü olması şart. Android Studio en kolay yoludur.

**S: Web kodu değişirse?**
C: `npm run build` → `./build-apk.sh`

**S: Offline çalışır mı?**
C: Evet, Capacitor caching otomatik yapıyor.

**S: Mac M4 Pro uyumlu mu?**
C: Tam uyumlu, ARM64 desteğine sahip.

---

## 📍 Başlamak İçin Oku:

1. **Türkçe**: [BAŞLA.txt](./BAŞLA.txt)
2. **English**: [README_ANDROID.md](./README_ANDROID.md)
3. **Detaylı**: [BUILD_ANDROID.md](./BUILD_ANDROID.md)

---

**Sürüm**: 1.0
**Son Güncelleme**: 4 Nisan 2026
**Durumu**: ✅ Hazır (Üretim)
