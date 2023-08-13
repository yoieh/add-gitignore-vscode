import * as vscode from "vscode";

export default async function extendFile(uri: vscode.Uri, content: string) {
  // append to .gitignore file
  const existingGitignore = await vscode.workspace.fs.readFile(
    vscode.Uri.joinPath(uri, ".gitignore")
  );

  vscode.workspace.fs.writeFile(
    vscode.Uri.joinPath(uri, ".gitignore"),
    Buffer.from(`${existingGitignore}\n${content}`)
  );
}
