# Quick Start Guide

> **Note**
> `daed` (UI component) is bundled with [dae-wing](https://github.com/daeuniverse/dae-wing) (backend API server) and [dae](https://github.com/daeuniverse/dae) (core).

## How to run

> **Note**
> - NEVER LET YOUR COMPUTER SLEEP OR HIBIRNATE WHILE PROXY IS STILL ON!
> - NEVER SWITCH NETWORK WHILE PROXY IS STILL ON!
> - TURN IT OFF BEFORE YOU MOVE OR LEAVE YOUR COMPUTER!
> - OR YOU WILL HAVE POSSIBILITY TO NEED A REBOOT TO RECOVER YOUR NETWORK CONNECTIVITY!

### Download pre-compiled binaries

Releases are available in <https://github.com/daeuniverse/daed/releases>

> **Note**
> If you would like to get a taste of new features, there are `PR Builds` available. Most of the time, newly proposed changes will be included in `PRs` and will be exported as cross-platform executable binaries in builds (GitHub Action Workflow Build). Noted that newly introduced features are sometimes buggy, do it at your own risk. However, we still highly encourage you to check out our latest builds as it may help us further analyze features stability and resolve potential bugs accordingly.

PR-builds are available in <https://github.com/daeuniverse/daed/actions/workflows/pr-build.yml>

### Spin up server locally

```bash
sudo chmod +x ./daed
sudo install -Dm755 daed /usr/bin/
sudo daed run

# helper
sudo daed [-h,--help]
```

### Debian / Ubuntu

Releases are available in <https://github.com/daeuniverse/daed/releases> or the following command gets the latest version of the precompiled installation package consistent with your current system architecture

``````shell
# Download
wget -P /tmp https://github.com/daeuniverse/daed/releases/latest/download/installer-daed-linux-$(arch).deb

# install
sudo dpkg -i /tmp/installer-daed-linux-$(arch).deb
rm /tmp/installer-daed-linux-$(arch).deb

# Start daed
sudo systemctl start daed

# enable daed start automatically
sudo systemctl enable daed
``````

### RedHat

Releases are available in <https://github.com/daeuniverse/daed/releases> or the following command gets the latest version of the precompiled installation package consistent with your current system architecture

``````shell
# Download
wget -P /tmp https://github.com/daeuniverse/daed/releases/latest/download/installer-daed-linux-$(arch).rpm

# install
sudo rpm -ivh /tmp/installer-daed-linux-$(arch).rpm
rm /tmp/installer-daed-linux-$(arch).rpm

# Start daed
sudo systemctl start daed

# enable daed start automatically
sudo systemctl enable daed
``````

### OpenSUSE

Releases are available in <https://github.com/daeuniverse/daed/releases> or the following command gets the latest version of the precompiled installation package consistent with your current system architecture

``````shell
# Download
wget -P /tmp https://github.com/daeuniverse/daed/releases/latest/download/installer-daed-linux-$(arch).rpm

# install
sudo zypper install /tmp/installer-daed-linux-$(arch).rpm
rm /tmp/installer-daed-linux-$(arch).rpm

# Start daed
sudo systemctl start daed

# enable daed start automatically
sudo systemctl enable daed
``````

### Arch Linux

Releases are available in <https://github.com/daeuniverse/daed/releases> or the following command installs the latest version of the precompiled installation package consistent with your current system architecture

#### AUR
##### Latest Release
``````shell
[yay/paru] -S daed
``````
##### Latest Git Version
``````shell
[yay/paru] -S daed-git
``````

#### archlinuxcn
##### Latest Release (Optimized for x86-64 v3)
``````shell
sudo pacman -S daed-bin-x64-v3
``````
##### Latest Release (General x86-64 or aarch64)
``````shell
sudo pacman -S daed
``````
##### Latest Git Version
``````shell
sudo pacman -S daed-git
``````
### Docker (Experimental)

Pre-built Docker images are available in `ghcr.io/daeuniverse/daed`, `quay.io/daeuniverse/daed` and `daeuniverse/daed`. 

#### Take `ghcr.io` for example, the command below pulls and runs the latest image

```shell
sudo docker run -d \
    --privileged \
    --network=host \
    --pid=host \
    --restart=unless-stopped \
    -v /sys:/sys \
    -v /etc/daed:/etc/daed \
    --name=daed \
    ghcr.io/daeuniverse/daed:latest
```

#### You may also build from source:

```shell
# clone the repository
git clone https://github.com/daeuniverse/daed --recursive

# build the image
docker build -t daed .

# run the container
sudo docker run -d \
    --privileged \
    --network=host \
    --pid=host \
    --restart=unless-stopped \
    -v /sys:/sys \
    -v /etc/daed:/etc/daed \
    --name=daed \
    daed
```


> **NOTE**
> - Docker currently supports only i386(x86-32), amd64(x86-64), armv7 and arm64(armv8). (Alpha)
> - Only amd64 is tested working as expected, but not fully tested yet. (Beta)
> - For self build from source, only amd64 and arm64 will run.
> - Please refer to https://github.com/daeuniverse/daed/discussions/291 and relevant PRs and Issues for details
> - Volunteers are welcomed.


## Access Panel

If everything goes well, open your browser and navigate to `http://localhost:2023`

Happy Hacking!
