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
    echo 'Error: 'run' is not supported on Windows. Sorry!'
    exit 1
fi

command -v unzip >/dev/null ||
    error_msg "unzip is required to install 'run'"

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

info_msg "Downloading 'run' for $target"

GITHUB=${GITHUB-"https://github.com"}
github_repo="$GITHUB/denyzhirkov/run"
exe_name=run
run_uri=$github_repo/releases/latest/download/run-$target.zip
install_env=RUN_INSTALL
bin_env=\$$install_env/bin
install_dir=${!install_env:-$HOME/.run}
bin_dir=$install_dir/bin
exe=$bin_dir/run

echo $install_dir
echo $bin_dir