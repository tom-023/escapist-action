import * as core from '@actions/core';

async function run(): Promise<void> {
  try {
    const inputString: string = core.getInput('string', { required: true });
    const charactersToEscape: string = core.getInput('characters', { required: true });

    const escapeChars: string[] = charactersToEscape.split(',').map(char => char.trim());

    let escapedString: string = inputString;

    escapeChars.forEach((char: string) => {
      if (char) {
        const regex = new RegExp(char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
        escapedString = escapedString.replace(regex, '\\' + char);
      }
    });

    core.setOutput('escaped', escapedString);

    core.info(`Original string: ${inputString}`);
    core.info(`Characters to escape: ${charactersToEscape}`);
    core.info(`Escaped string: ${escapedString}`);

  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    } else {
      core.setFailed('An unexpected error occurred');
    }
  }
}

run();