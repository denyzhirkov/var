#!/usr/bin/env bash

set -e

readonly GITHUB=${GITHUB-"https://github.com"}
readonly github_repo="$GITHUB/denyzhirkov/var"
readonly exe_name=var
readonly install_env=VAR_INSTALL
readonly bin_env=\$$install_env/bin
readonly install_dir=${!install_env:-$HOME/.var}
readonly bin_dir=$install_dir/bin
readonly exe=$bin_dir/var

error_msg() {
    printf ' 💀 %s\n' "$@" >&2
    exit 1
}

info_msg() {
    printf '[✓] %s\n' "$@"
}

success_msg() {
    printf ' 🔥 %s\n' "$@"
}

add_line_if_missing() {
    local line="$1"
    local file="$2"
    grep -Fxq "$line" "$file" 2>/dev/null || echo "$line" >> "$file"
}

if [[ ${OS:-} = Windows_NT ]]; then
    error_msg "'var' is not supported on Windows"
fi

command -v unzip >/dev/null || error_msg "unzip is required to install 'var'"

case $(uname -ms) in
    'Darwin x86_64') target=darwin-x64 ;;
    'Darwin arm64') target=darwin-aarch64 ;;
    'Linux aarch64' | 'Linux arm64') target=linux-x64 ;;
    'Linux x86_64' | *) target=linux-x64 ;;
esac

info_msg "Downloading 'var' for $target"

curl -L --fail --progress-bar --output "$exe.zip" "$github_repo/releases/latest/download/$target.zip" ||
    error_msg "Failed to download 'var'"

info_msg "Downloaded 'var' to $exe.zip"

mkdir -p "$bin_dir"
unzip -oqd "$bin_dir" "$exe.zip" ||
    error_msg "Failed to extract 'var'"

info_msg "Extracted 'var' to $bin_dir/dist/$target"

mv -f "$bin_dir/dist/$target" "$exe" ||
    error_msg "Failed to move extracted 'var' to destination"

info_msg "Moved 'var' to $exe"

rm -rf "$bin_dir/dist" "$exe.zip" ||
    error_msg "Failed to remove temporary files"

info_msg "Removed temporary files"

chmod +x "$exe"
info_msg "Made 'var' executable"

if [[ $SHELL == *bash ]]; then
    if ! command -v var &>/dev/null; then
        for file in ~/.profile ~/.bashrc ~/.bash_profile ~/profile ~/bashrc ~/bash_profile; do
            if [[ -f $file ]]; then
                add_line_if_missing '# var' "$file"
                add_line_if_missing "export PATH=\$PATH:$bin_dir" "$file"
                success_msg "Updated $file"
            fi
        done
        success_msg "Successfully installed 'var' to $exe"
    fi
fi

if [[ $SHELL == *zsh ]]; then
    if ! command -v var &>/dev/null; then
        for file in ~/.zshrc ~/.zshenv ~/.zprofile ~/.zlogin ~/zshrc ~/zshenv ~/zprofile ~/zlogin; do
            if [[ -f $file ]]; then
                add_line_if_missing '# var' "$file"
                add_line_if_missing "export PATH=\$PATH:$bin_dir" "$file"
                success_msg "Updated $file"
            fi
        done
        success_msg "Successfully installed 'var' to $exe"
    fi
fi

if [[ $SHELL == *fish ]]; then
    if ! command -v var &>/dev/null; then
        printf 'set -gx PATH $PATH %s\n' "$exe" >> ~/.config/fish/config.fish
        success_msg "Updated ~/.config/fish/config.fish"
        success_msg "Successfully installed 'var' to $exe"
    fi
fi

printf 'Restart terminal and run %s or %s -h to get started\n' "$exe_name" "$exe_name"
