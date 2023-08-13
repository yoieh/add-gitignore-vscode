import * as vscode from "vscode";

export async function selectWorkspace(): Promise<
  vscode.WorkspaceFolder | undefined
> {
  if (!vscode.workspace.workspaceFolders) {
    vscode.window.showErrorMessage(
      "No workspace detected. Please open a project."
    );

    return;
  }

  if (vscode.workspace.workspaceFolders.length > 1) {
    try {
      return await vscode.window.showWorkspaceFolderPick({
        placeHolder: "Select your workspace folder",
      });
    } catch (error) {
      if (error instanceof Error) {
        vscode.window.showErrorMessage(
          "Failed to fetch gitignore types.",
          error.message
        );
      }

      console.error(error);
    }
  }

  return vscode.workspace.workspaceFolders[0];
}

export default selectWorkspace;
