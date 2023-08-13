import * as vscode from "vscode";

export default async function checkCreateOrExtend(
  findFilesFunc: typeof vscode.workspace.findFiles = vscode.workspace.findFiles,
  showQuickPickFunc: typeof vscode.window.showQuickPick = vscode.window
    .showQuickPick
): Promise<boolean> {
  try {
    // check if .gitignore exists
    const fileExists = await findFilesFunc(".gitignore");

    if (fileExists.length > 0) {
      const overwriteAnswer = await showQuickPickFunc(["Yes", "No"], {
        placeHolder: "Do you want to overwrite your existing .gitignore?",
      });

      if (overwriteAnswer === "Yes") {
        return true;
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

  return false;
}
