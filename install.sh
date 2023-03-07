#!/usr/bin/env bash

# Reset
Color_Off=''

# Regular Colors
Red=''
Green=''
Dim='' # White

# Bold
Bold_White=''
Bold_Green=''

if [[ -t 1 ]]; then
    # Reset
    Color_Off='\033[0m' # Text Reset
    # Regular Colors
    Red='\033[0;31m'   # Red
    Green='\033[0;32m' # Green
    Dim='\033[0;2m'    # White
fi

error_msg() {
    echo "${Red}error${Color_Off}:" "$@" >&2
    exit 1
}

info_msg() {
    echo "${Dim}$@ ${Color_Off}"
}

success_msg() {
    echo "${Green}$@ ${Color_Off}"
}

if [[ ${OS:-} = Windows_NT ]]; then
    echo 'Error: 'var' is not supported on Windows. Sorry!'
    exit 1
fi

command -v unzip >/dev/null ||
    error_msg "unzip is required to install 'var'"

case $(uname -ms) in
'Darwin x86_64')
    target=darwin-x64
    ;;
'Darwin arm64')
    target=darwin-aarch64
    ;;
'Linux aarch64' | 'Linux arm64')
    target=linux-x64
    ;;
'Linux x86_64' | *)
    target=linux-x64
    ;;
esac

info_msg "Downloading 'var' for $target"

GITHUB=${GITHUB-"https://github.com"}
github_repo="$GITHUB/denyzhirkov/var"
exe_name=var
var_uri=$github_repo/releases/latest/download/$target.zip
install_env=VAR_INSTALL
bin_env=\$$install_env/bin
install_dir=${!install_env:-$HOME/.var}
bin_dir=$install_dir/bin
exe=$bin_dir/var


if [[ ! -d $install_dir ]]; then
    mkdir -p "$install_dir" ||
        error_msg "Failed to create install directory \"$install_dir\""
fi

if [[ ! -d $bin_dir ]]; then
    mkdir -p "$bin_dir" ||
        error_msg "Failed to create install directory \"$bin_dir\""
fi

# Download and unzip
curl --fail --location --progress-bar --output "$exe.zip" "$var_uri" ||
    error_msg "Failed to download bun from \"$var_uri\""
info_msg "Downloaded 'var' to $exe.zip"

unzip -oqd "$bin_dir" "$exe.zip" ||
    error_msg "Failed to extract 'var'"
info_msg "Extracted 'var' to $bin_dir/dist/$target"

mv "$bin_dir/dist/$target" "$exe" ||
    error_msg "Failed to move extracted bun to destination"
info_msg "Moved 'var' to $exe"

rm -r "$bin_dir/dist" "$exe.zip" ||
    error_msg "Failed to remove temporary files"
info_msg "Removed temporary files"

# Make the 'var' executable
chmod +x $exe
info_msg "Made 'var' executable"

# bash
if [[ $SHELL == *bash ]]; then
    if ! command -v var &>/dev/null; then
        if [[ -f ~/.profile ]]; then
            echo "# run" >> ~/.profile
            echo "export PATH=\$PATH:$bin_dir" >> ~/.profile
        fi
        if [[ -f ~/.bashrc ]]; then
            echo "# run" >> ~/.bashrc
            echo "export PATH=\$PATH:$bin_dir" >> ~/.bashrc
        fi
        if [[ -f ~/.bash_profile ]]; then
            echo "# run" >> ~/.bash_profile
            echo "export PATH=\$PATH:$bin_dir" >> ~/.bash_profile
        fi
        if [[ -f ~/profile ]]; then
            echo "# run" >> ~/profile
            echo "export PATH=\$PATH:$bin_dir" >> ~/profile
        fi
        if [[ -f ~/bashrc ]]; then
            echo "# run" >> ~/bashrc
            echo "export PATH=\$PATH:$bin_dir" >> ~/bashrc
        fi
        if [[ -f ~/bash_profile ]]; then
            echo "# run" >> ~/bash_profile
            echo "export PATH=\$PATH:$bin_dir" >> ~/bash_profile
        fi
        success_msg "Successfully installed 'var' to $exe"
    fi
fi

# zsh
if [[ $SHELL == *zsh ]]; then
    if ! command -v var &>/dev/null; then
        if [[ -f ~/.zshrc ]]; then
            echo "# run" >> ~/.zshrc
            echo "export PATH=\$PATH:$bin_dir" >> ~/.zshrc
        fi
        if [[ -f ~/.zshenv ]]; then
            echo "# run" >> ~/.zshenv
            echo "export PATH=\$PATH:$bin_dir" >> ~/.zshenv
        fi
        if [[ -f ~/.zprofile ]]; then
            echo "# run" >> ~/.zprofile
            echo "export PATH=\$PATH:$bin_dir" >> ~/.zprofile
        fi
        if [[ -f ~/.zlogin ]]; then
            echo "# run" >> ~/.zlogin
            echo "export PATH=\$PATH:$bin_dir" >> ~/.zlogin
        fi
        if [[ -f ~/zshrc ]]; then
            echo "# run" >> ~/zshrc
            echo "export PATH=\$PATH:$bin_dir" >> ~/zshrc
        fi
        if [[ -f ~/zshenv ]]; then
            echo "# run" >> ~/zshenv
            echo "export PATH=\$PATH:$bin_dir" >> ~/zshenv
        fi
        if [[ -f ~/zprofile ]]; then
            echo "# run" >> ~/zprofile
            echo "export PATH=\$PATH:$bin_dir" >> ~/zprofile
        fi
        if [[ -f ~/zlogin ]]; then
            echo "# run" >> ~/zlogin
            echo "export PATH=\$PATH:$bin_dir" >> ~/zlogin
        fi
        success_msg "Successfully installed 'var' to $exe"
    fi
fi

# fish
if [[ $SHELL == *fish ]]; then
    if ! command -v var &>/dev/null; then
        echo "set -gx PATH \$PATH $exe" >> ~/.config/fish/config.fish
        success_msg "Successfully installed 'var' to $exe"
    fi
fi

success_msg "\nRun 'var' or 'var -h' to get started\n"
exit 0