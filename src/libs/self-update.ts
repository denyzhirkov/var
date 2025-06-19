import { decoder } from './text-decoder.ts';


const bashCmd = ['bash', ['-c']];
const curlCmd = ['curl', ['-fsSL', 'https://raw.githubusercontent.com/denyzhirkov/var/master/install.sh']];

export const selfUpdate = async (): Promise<[number, string | null]> => {
  let curlCommand: Deno.Command | null = new Deno.Command(curlCmd[0] as string, {
    args: curlCmd[1] as string[],
    stdout: "piped",
    stderr: "piped",
  });

  const curlChild = curlCommand.spawn();
  const curlOutput = await curlChild.output();
  const curlStatus = await curlChild.status;
  curlCommand = null;

  if (!curlStatus.success) {
    return [
      curlStatus.code,
      curlOutput.stderr.length > 0 ? decoder.decode(curlOutput.stderr) : 'Unknown error',
    ];
  }

  let bashCommand: Deno.Command | null = new Deno.Command(bashCmd[0] as string, {
    args: [...bashCmd[1] as string[], decoder.decode(curlOutput.stdout)],
    stderr: "piped",
  });

  const bashChild = bashCommand.spawn();
  const bashOutput = await bashChild.output();
  const bashStatus = await bashChild.status;
  bashCommand = null;

  if (!bashStatus.success) {
    return [
      bashStatus.code,
      bashOutput.stderr.length > 0 ? decoder.decode(bashOutput.stderr) : 'Unknown error',
    ];
  }

  return [0, null];
};