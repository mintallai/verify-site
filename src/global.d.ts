declare module 'html-parse-stringify' {
  function parse(html: string): any;
  function stringify(ast: any): string;
}
