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