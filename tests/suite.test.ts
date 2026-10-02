import { describe, it, expect } from 'vitest';
import { parseDuration, formatDuration, formatPlaceholders, secureRandomInt } from '../packages/shared/src/index.js';

describe('Shared Utilities Test Suite', () => {
  it('should parse duration strings accurately to milliseconds', () => {
    expect(parseDuration('10s')).toBe(10000);
    expect(parseDuration('5m')).toBe(300000);
    expect(parseDuration('2h')).toBe(7200000);
    expect(parseDuration('1d')).toBe(86400000);
    expect(parseDuration('invalid')).toBeNull();
  });

  it('should format duration milliseconds to human readable strings', () => {
    expect(formatDuration(10000)).toBe('10s');
    expect(formatDuration(300000)).toBe('5m');
    expect(formatDuration(86400000)).toBe('1d');
  });

  it('should format message placeholders correctly', () => {
    const template = 'Welcome {mention} ({user}) to {server}! Member #{memberCount}.';
    const result = formatPlaceholders(template, {
      user: { id: '123456', username: 'john_doe', tag: 'john_doe#0001' },
      guild: { name: 'Null Testing Guild', memberCount: 100 },
    });
    expect(result).toBe('Welcome <@123456> (john_doe#0001) to Null Testing Guild! Member #100.');
  });

  it('should produce valid secure random integer within bounds', () => {
    for (let i = 0; i < 50; i++) {
      const val = secureRandomInt(10);
      expect(val).toBeGreaterThanOrEqual(0);
      expect(val).toBeLessThan(10);
    }
  });
});
