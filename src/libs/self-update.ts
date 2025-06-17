import { decoder } from './text-decoder.ts';


const bashCmd = ['bash', ['-c']];
const curlCmd = ['curl', ['-fsSL', 'https://raw.githubusercontent.com/denyzhirkov/var/master/install.sh']];


// export const selfUpdateOld = async (): Promise<[number, string | null]> => {
//   const curlProcess = Deno.run({
//     cmd: curlCmd,
//     stdout: "piped",
//     stderr: "piped",
//   });

//   const [curlStatus, curlRawOutput, curlRawError] = await Promise.all([
//     curlProcess.status(),
//     curlProcess.output(),
//     curlProcess.stderrOutput(),
//   ]);
//   curlProcess.close();

//   if (!curlStatus.success) {
//     return [
//       curlStatus.code,
//       decoder.decode(curlRawError),
//     ];
//   }

//   const bashProcess = Deno.run({
//     cmd: [...bashCmd, decoder.decode(curlRawOutput)],
//     stderr: "piped",
//   });

//   const [bashStatus, bashRawError] = await Promise.all([
//     bashProcess.status(),
//     bashProcess.stderrOutput(),
//   ]);
//   bashProcess.close();

//   if (!bashStatus.success) {
//     return [
//       bashStatus.code,
//       decoder.decode(bashRawError),
//     ];
//   }

//   return [0, null];
// };

export const selfUpdate = async (): Promise<[number, string | null]> => {
  let curlCommand: Deno.Command | null = new Deno.Command(curlCmd[0] as string, {
    args: curlCmd[1] as string[],
    stdout: "piped",
    stderr: "piped",
  });

  const curlChild = curlCommand.spawn();
  const [curlStatus, curlRawOutput, curlRawError] = await Promise.all([
    curlChild.status,
    (await curlChild.output()).stdout,
    curlChild.stderr.getReader().read(),
  ]);
  curlChild.kill();
  curlCommand = null;

  if (!curlStatus.success) {
    return [
      curlStatus.code,
      curlRawError.value !== undefined ? decoder.decode(curlRawError.value) : 'Unknown error',
    ];
  }

  let bashCommand: Deno.Command | null = new Deno.Command(bashCmd[0] as string, {
    args: [...bashCmd[1] as string[], decoder.decode(curlRawOutput)],
    stderr: "piped",
  });

  const bashChild = bashCommand.spawn();
  const [bashStatus, bashRawError] = await Promise.all([
    bashChild.status,
    bashChild.stderr.getReader().read(),
  ]);
  bashChild.kill();
  bashCommand = null;

  if (!bashStatus.success) {
    return [
      bashStatus.code,
      bashRawError.value !== undefined ? decoder.decode(bashRawError.value) : 'Unknown error',
    ];
  }

  return [0, null];
};