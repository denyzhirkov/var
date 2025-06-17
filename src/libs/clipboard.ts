// This file is intended to be run in the Deno runtime, where the Deno namespace is globally available.
import { decoder } from './text-decoder.ts';

const buildOs = Deno.build.os as "darwin" | "linux" | "windows";

function getClipboardCmd(type: 'copy' | 'paste') {
  if (type === 'copy') {
    return {
      "darwin": ["pbcopy", []],
      "linux": ["xclip", ["-selection", "clipboard", "-i"]],
      "windows": ["powershell", ["-Command", "Set-Clipboard"]],
    }[buildOs];
  } else {
    return {
      "darwin": ["pbpaste", []],
      "linux": ["xclip", ["-selection", "clipboard", "-o"]],
      "windows": ["powershell", ["-Command", "Get-Clipboard"]],
    }[buildOs];
  }
}

export async function copy(text: string): Promise<void> {
  const cmd = getClipboardCmd('copy');
  if (!cmd) throw new Error(`Clipboard copy utility not supported on this OS: ${buildOs}`);
  let command: Deno.Command | null = new Deno.Command(cmd[0], {
    args: cmd[1],
    stdin: "piped",
    stdout: "null",
    stderr: "piped",
  });
  try {
    const child = command.spawn();
    // Write to stdin
    const writer = child.stdin.getWriter();
    await writer.write(new TextEncoder().encode(text));
    await writer.close();
    // Await process completion
    const { code, stderr } = await child.output();
    if (code !== 0) {
      throw new Error(`Clipboard copy failed: ${decoder.decode(stderr).trim()}`);
    }
  } catch (err) {
    throw new Error(`Clipboard copy error: ${err.message}`);
  } finally {
    command = null;
  }
}

export async function paste(): Promise<string> {
  const cmd = getClipboardCmd('paste');
  if (!cmd) throw new Error(`Clipboard paste utility not supported on this OS: ${buildOs}`);
  let command: Deno.Command | null = new Deno.Command(cmd[0], {
    args: cmd[1],
    stdout: "piped",
    stderr: "piped",
  });
  try {
    const { code, stdout, stderr } = await command.output();
    if (code !== 0) {
      throw new Error(`Clipboard paste failed: ${decoder.decode(stderr).trim()}`);
    }
    return decoder.decode(stdout);
  } catch (err) {
    throw new Error(`Clipboard paste error: ${err.message}`);
  } finally {
    command = null;
  }
}