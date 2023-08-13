import * as vscode from "vscode";

export default async function createFile(
  uri: vscode.Uri,
  content: string,
  writeFileFunc: typeof vscode.workspace.fs.writeFile = vscode.workspace.fs
    .writeFile
) {
  // create .gitignore file
  writeFileFunc(vscode.Uri.joinPath(uri, ".gitignore"), Buffer.from(content));
}
