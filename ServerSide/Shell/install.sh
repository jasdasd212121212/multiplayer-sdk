if [[ $EUID -ne 0 ]]; then
   echo "This script must be run as root (use sudo)"
   exit 1
fi

echo "Enabling TCP BBR..."

cat <<EOF > /etc/sysctl.d/10-bbr.conf
net.core.default_qdisc=fq
net.ipv4.tcp_congestion_control=bbr
EOF

sysctl --system

echo "---------------------------------------"
if sysctl net.ipv4.tcp_congestion_control | grep -q bbr; then
    echo "Success! BBR is now enabled."
    echo "Current TCP Control: $(sysctl net.ipv4.tcp_congestion_control)"
else
    echo "Error: BBR could not be enabled."
fi

cd ~
cd .. && cd ..
cd home

sudo apt update 
sudo apt install curl
sudo apt-get install git

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
\. "$HOME/.nvm/nvm.sh"
nvm install 22
node -v
npm -v

git clone --filter=blob:none --sparse https://github.com/jasdasd212121212/multiplayer-sdk.git
cd multiplayer-sdk
git sparse-checkout init --cone
git sparse-checkout set ServerSide
git checkout main
cd ServerSide
npm install
npm install forever -g
npm run build
npm run run-prod