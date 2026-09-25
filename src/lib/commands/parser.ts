export interface ParsedCommand {
  raw: string;
  command: string;
  args: string[];
  flags: Record<string, boolean | string>;
}

export const parseCommandLine = (raw: string): ParsedCommand => {
  const trimmed = raw.trim();
  if (!trimmed) {
    return { raw, command: '', args: [], flags: {} };
  }

  // Tokenize preserving quotes
  const regex = /[^\s"']+|"([^"]*)"|'([^']*)'/g;
  const tokens: string[] = [];
  let match: RegExpExecArray | null;

  while ((match = regex.exec(trimmed)) !== null) {
    if (match[1] !== undefined) {
      tokens.push(match[1]);
    } else if (match[2] !== undefined) {
      tokens.push(match[2]);
    } else {
      tokens.push(match[0]);
    }
  }

  const [command, ...rest] = tokens;
  const args: string[] = [];
  const flags: Record<string, boolean | string> = {};

  for (let i = 0; i < rest.length; i++) {
    const token = rest[i];
    if (token.startsWith('--')) {
      const parts = token.slice(2).split('=');
      const key = parts[0];
      const val = parts.length > 1 ? parts[1] : true;
      flags[key] = val;
    } else if (token.startsWith('-') && token.length > 1) {
      // Split combined single char flags like -la -> l: true, a: true
      const chars = token.slice(1);
      for (const char of chars) {
        flags[char] = true;
      }
    } else {
      args.push(token);
    }
  }

  return {
    raw,
    command: command.toLowerCase(),
    args,
    flags,
  };
};
