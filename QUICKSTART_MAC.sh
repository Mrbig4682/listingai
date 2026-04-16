#!/bin/bash

# ListingAI Android TWA - Mac Hızlı Kurulum Betiği
# Bu betik Java, Android SDK'yı kontrol eder ve eksikleri kurar

echo "╔════════════════════════════════════════════╗"
echo "║   ListingAI Android TWA - Hızlı Kurulum   ║"
echo "╚════════════════════════════════════════════╝"
echo ""

# Renk tanımları
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Homebrew kontrolü ve kurulumu
check_homebrew() {
    if ! command -v brew &> /dev/null; then
        echo -e "${YELLOW}Homebrew bulunamadı, yükleniyor...${NC}"
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    else
        echo -e "${GREEN}✓ Homebrew kurulu${NC}"
    fi
}

# Java kurulumu
check_java() {
    echo ""
    echo "Java kontrol ediliyor..."

    if command -v java &> /dev/null; then
        echo -e "${GREEN}✓ Java kurulu: $(java -version 2>&1 | head -1)${NC}"
        return
    fi

    echo -e "${YELLOW}Java bulunamadı, yükleniyor...${NC}"
    brew install openjdk@17

    # Profili güncelle
    if [[ "$SHELL" == *"zsh" ]]; then
        PROFILE="$HOME/.zshrc"
    else
        PROFILE="$HOME/.bash_profile"
    fi

    if ! grep -q "JAVA_HOME" "$PROFILE"; then
        echo "" >> "$PROFILE"
        echo "# Java 17 (ListingAI TWA)" >> "$PROFILE"
        echo 'export JAVA_HOME="/opt/homebrew/opt/openjdk@17"' >> "$PROFILE"
        echo 'export PATH="$JAVA_HOME/bin:$PATH"' >> "$PROFILE"
    fi

    source "$PROFILE"
    echo -e "${GREEN}✓ Java yüklendi ve yapılandırıldı${NC}"
}

# Android SDK kontrolü
check_android_sdk() {
    echo ""
    echo "Android SDK kontrol ediliyor..."

    if [ -d "$HOME/Library/Android/sdk" ]; then
        echo -e "${GREEN}✓ Android SDK bulundu${NC}"
        return
    fi

    echo -e "${YELLOW}Android SDK bulunamadı${NC}"
    echo ""
    echo "Android SDK iki yolla kurulabilir:"
    echo ""
    echo "1. Android Studio (Önerilen):"
    echo "   • https://developer.android.com/studio adresinden indir"
    echo "   • Yükle ve ilk kurulum tamamla"
    echo ""
    echo "2. Command Line Tools (Gelişmiş):"
    echo "   • Aşağıdaki komutu çalıştır:"
    echo ""
    echo "   mkdir -p ~/Library/Android/sdk && cd ~/Library/Android/sdk"
    echo "   curl -o cmdline-tools.zip 'https://dl.google.com/android/repository/commandlinetools-mac-10406996_latest.zip'"
    echo "   unzip cmdline-tools.zip && mv cmdline-tools latest"
    echo "   sdkmanager --sdk_root=~/Library/Android/sdk 'platforms;android-34' 'build-tools;34.0.0' 'platform-tools'"
    echo ""
}

# Node.js kontrolü
check_nodejs() {
    echo ""
    echo "Node.js kontrol ediliyor..."

    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        echo -e "${GREEN}✓ Node.js kurulu: $NODE_VERSION${NC}"
        return
    fi

    echo -e "${YELLOW}Node.js bulunamadı, yükleniyor...${NC}"
    brew install node
    echo -e "${GREEN}✓ Node.js yüklendi${NC}"
}

# npm bağımlılıkları
install_npm_deps() {
    echo ""
    echo "npm bağımlılıkları kontrol ediliyor..."

    if [ -d "node_modules" ]; then
        echo -e "${GREEN}✓ npm bağımlılıkları kurulu${NC}"
        return
    fi

    echo -e "${YELLOW}npm bağımlılıkları yükleniyor...${NC}"
    npm install
    echo -e "${GREEN}✓ npm bağımlılıkları yüklendi${NC}"
}

# Ana akış
main() {
    check_homebrew
    check_java
    check_nodejs
    install_npm_deps

    echo ""
    echo "╔════════════════════════════════════════════╗"
    echo "║          KURULUM TAMAMLANDI ✓              ║"
    echo "╚════════════════════════════════════════════╝"
    echo ""
    echo -e "${YELLOW}Android SDK Kurulumu:${NC}"

    if [ ! -d "$HOME/Library/Android/sdk" ]; then
        echo -e "${RED}! Android SDK hala kurulu değil${NC}"
        echo "  Lütfen yukarıdaki talimatları izle"
        echo ""
    else
        echo -e "${GREEN}✓ Android SDK kurulu${NC}"
    fi

    echo ""
    echo -e "${GREEN}Derlemeye hazır!${NC}"
    echo ""
    echo "Başlamak için çalıştır:"
    echo -e "${YELLOW}  ./build-apk.sh${NC}"
    echo ""
}

# Betiği çalıştır
main
