import * as vscode from "vscode";

export default async function createFile(uri: vscode.Uri, content: string) {
  // create .gitignore file
  vscode.workspace.fs.writeFile(
    vscode.Uri.joinPath(uri, ".gitignore"),
    Buffer.from(content)
  );
}
