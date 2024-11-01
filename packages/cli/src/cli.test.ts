import { execSync } from 'child_process';
import { describe, it, expect } from 'vitest';

describe('CLI', () => {
  it('should display help information', () => {
    const output = execSync('node packages/cli/src/cli.ts --help').toString();
    expect(output).toContain('Usage: wagmi [command] [options]');
    expect(output).toContain('Commands:');
    expect(output).toContain('generate');
    expect(output).toContain('init');
  });

  it('should display version information', () => {
    const output = execSync('node packages/cli/src/cli.ts --version').toString();
    expect(output.trim()).toMatch(/^\d+\.\d+\.\d+$/);
  });

  it('should throw an error for unknown command', () => {
    try {
      execSync('node packages/cli/src/cli.ts unknown');
    } catch (error) {
      expect(error.message).toContain('Unknown command: unknown');
    }
  });

  it('should execute generate command', () => {
    const output = execSync('node packages/cli/src/cli.ts generate').toString();
    expect(output).toContain('Validating plugins');
  });

  it('should execute init command', () => {
    const output = execSync('node packages/cli/src/cli.ts init').toString();
    expect(output).toContain('Creating config');
  });
});
