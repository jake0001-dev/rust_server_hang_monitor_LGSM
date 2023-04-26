
echo "Install Script for LGSM Stall Monitor"


echo "Checking if Node is installed"
if [ ! -x "$(command -v node)" ]; then
    echo "Node not found. Please install Node first."
    exit 1
fi


echo "Downloading Stall Monitor"
git clone https://github.com/jake0001-dev/rust_server_hang_monitor_LGSM
cd rust_server_hang_monitor_LGSM
npm install


echo "Installation Complete"
echo "Please edit the config.json file to your liking"
echo "Then run the monitor with 'pm2 start index.js'"
echo "To view the monitor, run 'pm2 monit'"

exit 0