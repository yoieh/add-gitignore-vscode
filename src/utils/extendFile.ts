import * as vscode from "vscode";

export default async function extendFile(
  uri: vscode.Uri,
  content: string,
  readFileFunc: typeof vscode.workspace.fs.readFile = vscode.workspace.fs
    .readFile,
  writeFileFunc: typeof vscode.workspace.fs.writeFile = vscode.workspace.fs
    .writeFile
) {
  // append to .gitignore file
  const existingGitignore = await readFileFunc(
    vscode.Uri.joinPath(uri, ".gitignore")
  );

  writeFileFunc(
    vscode.Uri.joinPath(uri, ".gitignore"),
    Buffer.from(`${existingGitignore}\n${content}`)
  );
}
