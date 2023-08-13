import * as vscode from "vscode";

export default async function selectWorkspace(
  workspace: typeof vscode.workspace = vscode.workspace,
  window: typeof vscode.window = vscode.window
): Promise<vscode.WorkspaceFolder | undefined> {
  if (!workspace.workspaceFolders) {
    window.showErrorMessage("No workspace detected. Please open a project.");

    return;
  }

  if (workspace.workspaceFolders.length > 1) {
    try {
      return await window.showWorkspaceFolderPick({
        placeHolder: "Select your workspace folder",
      });
    } catch (error) {
      if (error instanceof Error) {
        window.showErrorMessage(
          "Failed to fetch gitignore types.",
          error.message
        );
      }

      console.error(error);
    }
  }

  return workspace.workspaceFolders[0];
}
