#!/bin/bash

# ListingAI Android TWA Derleyici Betiği
# Bu betik ListingAI uygulamasını Android APK olarak derler

set -e

# Renkler
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Ayarlar
APP_NAME="ListingAI"
PACKAGE_NAME="com.listingai.app"
BUILD_TYPE="debug"
INSTALL_APK=false

# Komut satırı argümanlarını işle
while [[ $# -gt 0 ]]; do
    case $1 in
        --release)
            BUILD_TYPE="release"
            shift
            ;;
        --install)
            INSTALL_APK=true
            shift
            ;;
        *)
            echo "Bilinmeyen argüman: $1"
            exit 1
            ;;
    esac
done

# Başlık
echo -e "${BLUE}"
echo "╔════════════════════════════════════════════╗"
echo "║      $APP_NAME Android TWA Derleyici       ║"
echo "╚════════════════════════════════════════════╝"
echo -e "${NC}"

# Ortam kontrolü
check_environment() {
    echo -e "${YELLOW}[1/6] Ortam kontrolü yapılıyor...${NC}"

    # Java kontrolü
    if ! command -v java &> /dev/null; then
        echo -e "${RED}✗ Java bulunamadı${NC}"
        echo "Lütfen Java 17 yükle: brew install openjdk@17"
        exit 1
    fi
    echo -e "${GREEN}✓ Java bulundu: $(java -version 2>&1 | head -1)${NC}"

    # Gradle kontrolü
    if [ ! -f "android/gradlew" ]; then
        echo -e "${RED}✗ Android klasörü bulunamadı${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ Gradle wrapper bulundu${NC}"

    # ANDROID_SDK_ROOT kontrolü
    if [ -z "$ANDROID_SDK_ROOT" ]; then
        # Mac varsayılan yolunu dene
        if [ -d "$HOME/Library/Android/sdk" ]; then
            export ANDROID_SDK_ROOT="$HOME/Library/Android/sdk"
            echo -e "${GREEN}✓ ANDROID_SDK_ROOT otomatik bulundu${NC}"
        else
            echo -e "${RED}✗ ANDROID_SDK_ROOT ayarlanmamış${NC}"
            echo "Lütfen Android Studio yükle veya manuel olarak ayarla"
            exit 1
        fi
    fi

    if [ ! -d "$ANDROID_SDK_ROOT" ]; then
        echo -e "${RED}✗ ANDROID_SDK_ROOT geçersiz: $ANDROID_SDK_ROOT${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ Android SDK bulundu: $ANDROID_SDK_ROOT${NC}"
}

# Web dosyalarını derle
build_web() {
    echo -e "${YELLOW}[2/6] Web uygulaması derleniyor...${NC}"

    if [ ! -d "node_modules" ]; then
        echo "Node modules kurulu değil, yükleniyor..."
        npm install
    fi

    npm run build
    echo -e "${GREEN}✓ Web uygulaması başarıyla derlendi${NC}"
}

# Capacitor senkronizasyonu
sync_capacitor() {
    echo -e "${YELLOW}[3/6] Capacitor senkronize ediliyor...${NC}"

    if ! command -v npx &> /dev/null; then
        echo -e "${RED}✗ npx bulunamadı${NC}"
        exit 1
    fi

    npx cap sync android
    echo -e "${GREEN}✓ Capacitor senkronizasyonu tamamlandı${NC}"
}

# Gradle temizliği
clean_gradle() {
    echo -e "${YELLOW}[4/6] Gradle cache temizleniyor...${NC}"

    cd android
    chmod +x gradlew
    ./gradlew clean
    cd ..

    echo -e "${GREEN}✓ Gradle cache temizlendi${NC}"
}

# APK derlemesi
build_apk() {
    echo -e "${YELLOW}[5/6] APK derleniyor (${BUILD_TYPE})...${NC}"

    cd android

    if [ "$BUILD_TYPE" = "release" ]; then
        echo "Release modu için imzalama anahtarı gereklidir"
        ./gradlew bundleRelease --info
        OUTPUT_FILE="app/build/outputs/bundle/release/app-release.aab"
    else
        ./gradlew assembleDebug --info
        OUTPUT_FILE="app/build/outputs/apk/debug/app-debug.apk"
    fi

    cd ..

    if [ -f "$OUTPUT_FILE" ]; then
        echo -e "${GREEN}✓ Derleme başarılı!${NC}"
        echo -e "${GREEN}  Çıktı: $OUTPUT_FILE${NC}"
    else
        echo -e "${RED}✗ Derleme başarısız${NC}"
        exit 1
    fi
}

# APK yükleme (opsiyonel)
install_apk() {
    if [ "$INSTALL_APK" = true ]; then
        echo -e "${YELLOW}[6/6] APK Android cihazına yükleniyor...${NC}"

        if ! command -v adb &> /dev/null; then
            echo -e "${RED}✗ ADB bulunamadı${NC}"
            exit 1
        fi

        # Cihaz bağlantısını kontrol et
        if ! adb devices | grep -q "device$"; then
            echo -e "${RED}✗ Android cihazı bulunamadı${NC}"
            echo "Lütfen USB ile cihazı bağla veya emülatörü başlat"
            exit 1
        fi

        APK_FILE="android/app/build/outputs/apk/debug/app-debug.apk"
        adb install -r "$APK_FILE"

        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✓ APK başarıyla yüklendi${NC}"

            # Uygulamayı başlat
            adb shell am start -n "$PACKAGE_NAME/.MainActivity"
            echo -e "${GREEN}✓ Uygulama başlatılıyor...${NC}"
        else
            echo -e "${RED}✗ APK yükleme başarısız${NC}"
            exit 1
        fi
    fi
}

# Özet göster
show_summary() {
    echo ""
    echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║            DERLEMESİ TAMAMLANDI            ║${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════════╝${NC}"
    echo ""

    if [ "$BUILD_TYPE" = "release" ]; then
        OUTPUT="android/app/build/outputs/bundle/release/app-release.aab"
        echo -e "${GREEN}Release AAB (Play Store için):${NC}"
    else
        OUTPUT="android/app/build/outputs/apk/debug/app-debug.apk"
        echo -e "${GREEN}Debug APK (test için):${NC}"
    fi

    echo -e "  ${OUTPUT}"
    echo ""
    echo -e "${YELLOW}Sonraki adımlar:${NC}"
    echo "  1. APK'yı Android cihazında test et"
    echo "  2. https://listingai-gamma.vercel.app'dan yüklendiğini doğrula"
    echo "  3. Play Store'a yüklemek için release build oluştur"
    echo ""
}

# Ana akış
main() {
    check_environment
    build_web
    sync_capacitor
    clean_gradle
    build_apk

    if [ "$INSTALL_APK" = true ]; then
        install_apk
    fi

    show_summary
}

# Betiği çalıştır
main
