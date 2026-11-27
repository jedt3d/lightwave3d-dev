(() => {
  'use strict';

  const keywords = new Set([
    'if', 'else', 'for', 'foreach', 'while', 'do', 'switch', 'case', 'default',
    'break', 'continue', 'return', 'true', 'false', 'nil',
  ]);
  const tokens = /(?<comment>\/\/[^\r\n]*|\/\*[\s\S]*?(?:\*\/|(?![\s\S])))|(?<string>"(?:\\[^\r\n]|[^"\\\r\n])*"|'(?:\\[^\r\n]|[^'\\\r\n])*')|^(?<indent>[\t ]*)(?<directive>@[a-z_]\w*)|(?<number>\b(?:0x[0-9a-f]+|\d+(?:\.\d*)?(?:e[+-]?\d+)?)(?!\w)|\.\d+(?:e[+-]?\d+)?(?!\w))|(?<call>[a-z_]\w*(?=[\t ]*\())|(?<word>[a-z_]\w*)|(?<operator>[=<>+*/!&|%^-])/gim;
  const escapes = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  const escape = (text) => text.replace(/[&<>"']/g, (character) => escapes[character]);

  function typeOf(match) {
    const { comment, string, directive, number, word, call, operator } = match.groups;
    if (comment) return 'comment';
    if (string) return 'string';
    if (directive) return 'directive';
    if (number) return 'number';
    if (operator) return 'operator';
    if (keywords.has(word ?? call)) return 'keyword';
    if (word === 'main' || call) return 'function';
    return null;
  }

  function highlight(source, language) {
    if (!/^(?:lscript|ls)$/i.test(language)) return '';

    let result = '';
    let offset = 0;
    for (const match of source.matchAll(tokens)) {
      const type = typeOf(match);
      const indent = match.groups.indent ?? '';
      const token = escape(match[0].slice(indent.length));
      result += escape(source.slice(offset, match.index)) + indent;
      result += type ? `<span class="ls-${type}">${token}</span>` : token;
      offset = match.index + match[0].length;
    }
    return result + escape(source.slice(offset));
  }

  window.highlightLScript = highlight;
})();
