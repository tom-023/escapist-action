import * as core from '@actions/core';
import { expect, test, jest } from '@jest/globals';

// Mocking @actions/core
jest.mock('@actions/core');

describe('escapist-action', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Clear all INPUT_ environment variables
    for (const key of Object.keys(process.env)) {
      if (key.startsWith('INPUT_')) {
        delete process.env[key];
      }
    }
  });

  test('escapes double quotes', () => {
    const mockSetOutput = jest.mocked(core.setOutput);
    const mockGetInput = jest.mocked(core.getInput);

    mockGetInput.mockImplementation((name: string) => {
      if (name === 'string') return 'Hello "World"';
      if (name === 'characters') return '"';
      return '';
    });

    // Import and run the action
    jest.isolateModules(() => {
      require('../src/index');
    });

    expect(mockSetOutput).toHaveBeenCalledWith('escaped', 'Hello \\"World\\"');
  });

  test('escapes multiple special characters', () => {
    const mockSetOutput = jest.mocked(core.setOutput);
    const mockGetInput = jest.mocked(core.getInput);

    mockGetInput.mockImplementation((name: string) => {
      if (name === 'string') return 'Price: $100 | Quantity: 5';
      if (name === 'characters') return '$,|';
      return '';
    });

    jest.isolateModules(() => {
      require('../src/index');
    });

    expect(mockSetOutput).toHaveBeenCalledWith('escaped', 'Price: \\$100 \\| Quantity: 5');
  });

  test('escapes shell special characters', () => {
    const mockSetOutput = jest.mocked(core.setOutput);
    const mockGetInput = jest.mocked(core.getInput);

    mockGetInput.mockImplementation((name: string) => {
      if (name === 'string') return 'Hello & <World> {test} [array] (parens)';
      if (name === 'characters') return '&,<,>,{,},[,],(,)';
      return '';
    });

    jest.isolateModules(() => {
      require('../src/index');
    });

    expect(mockSetOutput).toHaveBeenCalledWith(
      'escaped',
      'Hello \\& \\<World\\> \\{test\\} \\[array\\] \\(parens\\)'
    );
  });

  test('handles empty string', () => {
    const mockSetOutput = jest.mocked(core.setOutput);
    const mockGetInput = jest.mocked(core.getInput);

    mockGetInput.mockImplementation((name: string) => {
      if (name === 'string') return '';
      if (name === 'characters') return '"';
      return '';
    });

    jest.isolateModules(() => {
      require('../src/index');
    });

    expect(mockSetOutput).toHaveBeenCalledWith('escaped', '');
  });

  test('handles string with no special characters', () => {
    const mockSetOutput = jest.mocked(core.setOutput);
    const mockGetInput = jest.mocked(core.getInput);

    mockGetInput.mockImplementation((name: string) => {
      if (name === 'string') return 'Hello World';
      if (name === 'characters') return '",$';
      return '';
    });

    jest.isolateModules(() => {
      require('../src/index');
    });

    expect(mockSetOutput).toHaveBeenCalledWith('escaped', 'Hello World');
  });

  test('escapes backslashes', () => {
    const mockSetOutput = jest.mocked(core.setOutput);
    const mockGetInput = jest.mocked(core.getInput);

    mockGetInput.mockImplementation((name: string) => {
      if (name === 'string') return 'C:\\Users\\test';
      if (name === 'characters') return '\\';
      return '';
    });

    jest.isolateModules(() => {
      require('../src/index');
    });

    expect(mockSetOutput).toHaveBeenCalledWith('escaped', 'C:\\\\Users\\\\test');
  });

  test('handles regex special characters in escape list', () => {
    const mockSetOutput = jest.mocked(core.setOutput);
    const mockGetInput = jest.mocked(core.getInput);

    mockGetInput.mockImplementation((name: string) => {
      if (name === 'string') return 'test.file[1].txt';
      if (name === 'characters') return '.,[,]';
      return '';
    });

    jest.isolateModules(() => {
      require('../src/index');
    });

    expect(mockSetOutput).toHaveBeenCalledWith('escaped', 'test\\.file\\[1\\]\\.txt');
  });

  test('trims whitespace from character list', () => {
    const mockSetOutput = jest.mocked(core.setOutput);
    const mockGetInput = jest.mocked(core.getInput);

    mockGetInput.mockImplementation((name: string) => {
      if (name === 'string') return 'Hello "World"';
      if (name === 'characters') return ' " , $ ';
      return '';
    });

    jest.isolateModules(() => {
      require('../src/index');
    });

    expect(mockSetOutput).toHaveBeenCalledWith('escaped', 'Hello \\"World\\"');
  });

  test('handles error gracefully', () => {
    const mockSetFailed = jest.mocked(core.setFailed);
    const mockGetInput = jest.mocked(core.getInput);

    mockGetInput.mockImplementation(() => {
      throw new Error('Test error');
    });

    jest.isolateModules(() => {
      require('../src/index');
    });

    expect(mockSetFailed).toHaveBeenCalledWith('Test error');
  });
});
