export type Snippet = {
  id: string;
  title: string;
  language: string;
  code: string;
  createdAt: string;
};

export type NewSnippet = {
  title: string;
  language: string;
  code: string;
};

export const LANGUAGES = [
  "typescript",
  "javascript",
  "python",
  "go",
  "rust",
  "html",
  "css",
  "json",
  "bash",
  "plaintext",
] as const;
