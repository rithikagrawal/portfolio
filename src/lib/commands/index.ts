import { parseCommandLine } from './parser';
import { commandRegistry, CommandResult } from './registry';
import { getNodeByPath } from '@/lib/filesystem';

export async function executeCommand(raw: string): Promise<CommandResult> {
  const trimmed = raw.trim();
  if (!trimmed) {
    return { type: 'text', content: '' };
  }

  const parsed = parseCommandLine(trimmed);
  const handler = commandRegistry[parsed.command];

  if (!handler) {
    return {
      type: 'error',
      content: `bash: ${parsed.command}: command not found. Type 'help' to view available commands.`,
    };
  }

  try {
    return await handler(parsed);
  } catch (err) {
    return {
      type: 'error',
      content: `An unexpected error occurred while executing '${parsed.command}': ${String(err)}`,
    };
  }
}

// Tab auto-completion engine
export function getCompletions(input: string, cwd: string): { completed: string; suggestions: string[] } {
  const trimmed = input.trimStart();
  const tokens = trimmed.split(/\s+/);

  // If completing the first word (command)
  if (tokens.length <= 1) {
    const prefix = tokens[0] || '';
    const commands = Object.keys(commandRegistry);
    const matches = commands.filter((cmd) => cmd.startsWith(prefix.toLowerCase()));

    if (matches.length === 1) {
      return { completed: matches[0] + ' ', suggestions: [] };
    }
    return { completed: input, suggestions: matches };
  }

  // If completing arguments (e.g. file or directory names)
  const currentToken = tokens[tokens.length - 1];
  const node = getNodeByPath(cwd);

  if (!node || !node.children) {
    return { completed: input, suggestions: [] };
  }

  const fileEntries = Object.keys(node.children);
  const matches = fileEntries.filter((name) =>
    name.toLowerCase().startsWith(currentToken.toLowerCase())
  );

  if (matches.length === 1) {
    const matchedNode = node.children[matches[0]];
    const suffix = matchedNode.type === 'dir' ? '/' : ' ';
    const prefix = tokens.slice(0, -1).join(' ') + ' ';
    return { completed: prefix + matches[0] + suffix, suggestions: [] };
  }

  return { completed: input, suggestions: matches };
}
