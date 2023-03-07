echo "Zipping files.."

zip ./dist/darwin-aarch64.zip ./dist/darwin-aarch64
rm ./dist/darwin-aarch64

zip ./dist/darwin-x64.zip ./dist/darwin-x64
rm ./dist/darwin-x64

zip ./dist/linux-x64.zip ./dist/linux-x64
rm ./dist/linux-x64

zip ./dist/var.zip ./dist/var
rm ./dist/var

zip ./dist/win-x64.zip ./dist/win-x64.exe
rm ./dist/win-x64.exe

echo "Zipped files to ./dist"