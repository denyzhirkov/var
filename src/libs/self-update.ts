const bashCmd = ['bash', '-c'];
const curlCmd = ['curl', '-fsSL', 'https://raw.githubusercontent.com/denyzhirkov/var/master/install.sh'];

const decoder = new TextDecoder();

export const selfUpdate = async (): Promise<[number, string | null]> => {
  const curlProcess = Deno.run({
    cmd: curlCmd,
    stdout: "piped",
    stderr: "piped",
  });
  
  const [curlStatus, curlRawOutput, curlRawError] = await Promise.all([
    curlProcess.status(),
    curlProcess.output(),
    curlProcess.stderrOutput(),
  ]);
  curlProcess.close();

  if (!curlStatus.success) {
    return [
      curlStatus.code,
      decoder.decode(curlRawError),
    ];
  }

  const bashProcess = Deno.run({
    cmd: [...bashCmd, decoder.decode(curlRawOutput)],
    stderr: "piped",
  });

  const [bashStatus, bashRawError] = await Promise.all([
    bashProcess.status(),
    bashProcess.stderrOutput(),
  ]);
  bashProcess.close();

  if (!bashStatus.success) {
    return [
      bashStatus.code,
      decoder.decode(bashRawError),
    ];
  }

  return [0, null];
};