# compile deno to binary
clear

deno lint

echo "Injecting version.."
VERSION=$(awk '/version/{gsub(/("|",)/,"",$2);print $2}' package.json)
echo "export const VERSION = '$VERSION';" > src/version.ts

rm -rf ./dist
echo "Compiling darwin-aarch64"
deno compile --output ./dist/darwin-aarch64 --target aarch64-apple-darwin --unstable --allow-ffi --allow-read --allow-write --allow-run --allow-env src/index.ts
echo "Compiled to ./dist/darwin-aarch64\n"

echo "Compiling darwin-x64"
deno compile --output ./dist/darwin-x64 --target x86_64-apple-darwin --unstable --allow-ffi --allow-read --allow-write --allow-run --allow-env src/index.ts
echo "Compiled to ./dist/darwin-x64\n"

echo "Compiling linux-x64"
deno compile --output ./dist/linux-x64 --target x86_64-unknown-linux-gnu --unstable --allow-ffi --allow-read --allow-write --allow-run --allow-env src/index.ts
echo "Compiled to ./dist/linux-x64\n"

echo "Compiling MacOS M1"
deno compile --output ./dist/var --unstable --allow-ffi --allow-read --allow-write --allow-run --allow-env src/index.ts
echo "Compiled to ./dist/var\n"

echo "Compiling win-x64"
deno compile --output ./dist/win-x64 --target x86_64-pc-windows-msvc --unstable --allow-ffi --allow-read --allow-write --allow-run --allow-env src/index.ts
echo "Compiled to ./dist/win-x64\n"
