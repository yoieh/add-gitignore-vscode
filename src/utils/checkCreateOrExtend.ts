import * as vscode from "vscode";

export default async function checkCreateOrExtend(
  workspaceFolder: vscode.WorkspaceFolder,
  findFilesFunc: typeof vscode.workspace.findFiles = vscode.workspace.findFiles,
  showQuickPickFunc: typeof vscode.window.showQuickPick = vscode.window
    .showQuickPick
): Promise<boolean> {
  try {
    // try to find .gitignore file in workspace
    const fileExists = await findFilesFunc(
      new vscode.RelativePattern(workspaceFolder, ".gitignore")
    );

    if (fileExists.length > 0) {
      const overwriteAnswer = await showQuickPickFunc(["Yes", "No"], {
        placeHolder: "Do you want to overwrite your existing .gitignore?",
      });

      if (overwriteAnswer === "No") {
        return false;
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      vscode.window.showErrorMessage(
        "Failed to fetch gitignore types.",
        error.message
      );
    }

    console.error(error);
  }

  return true;
}
