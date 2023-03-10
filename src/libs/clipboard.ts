const buildOs = Deno.build.os as "darwin" | "linux" | "windows";

export async function copy(text: string): Promise<void> {
  const cmd = {
    "darwin": ["pbcopy"],
    "linux": ["xclip", "-selection", "clipboard", "-i"],
    "windows": ["powershell", "-Command", "Set-Clipboard"],
  }[buildOs];
  const process = Deno.run({ cmd, stdin: "piped" });
  await process.stdin.write(new TextEncoder().encode(text));
  process.stdin.close();
  await process.status();
}

export async function paste(): Promise<string> {
  const cmd = {
    "darwin": ["pbpaste"],
    "linux": ["xclip", "-selection", "clipboard", "-o"],
    "windows": ["powershell", "-Command", "Get-Clipboard"],
  }[buildOs];
  const process = Deno.run({ cmd, stdout: "piped" });
  const output = await process.output();
  process.close();
  return new TextDecoder().decode(output);
}
