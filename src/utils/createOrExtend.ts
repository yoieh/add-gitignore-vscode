import * as vscode from "vscode";

export default async function createOrExtend(): Promise<boolean> {
  try {
    // check if .gitignore exists
    const fileExists = await vscode.workspace.findFiles(".gitignore");

    if (fileExists.length > 0) {
      const overwriteAnswer = await vscode.window.showQuickPick(["Yes", "No"], {
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
