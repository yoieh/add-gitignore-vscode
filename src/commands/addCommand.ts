import * as vscode from "vscode";
import getGitignoreTypes from "../utils/getGitignoreTypes";
import selectWorkspace from "../utils/selectWorkspace";
import createOrExtend from "../utils/createOrExtend";
import getGitignoreContent from "../utils/getGitignore";

function addCommand(
  cachedProjectTypes: string[]
): (...args: unknown[]) => void {
  return async () => {
    const selectedWorkspaceFolder = await selectWorkspace();

    if (!selectedWorkspaceFolder) {
      return;
    }

    cachedProjectTypes = await getGitignoreTypes(cachedProjectTypes);

    const selectedType = await vscode.window.showQuickPick(cachedProjectTypes, {
      placeHolder: "Select your project type",
    });

    if (selectedType) {
      vscode.window.showInformationMessage(`You selected ${selectedType}`);

      const gitignoreContent = await getGitignoreContent(selectedType);

      if (!gitignoreContent) {
        vscode.window.showErrorMessage(
          "Failed to fetch gitignore content. Please try again."
        );

        return;
      }

      // if selectedWorkspaceFolder has a .gitignore file we need to ask the user if they want to overwrite it
      const overwrite = await createOrExtend();

      // if overwrite is true, overwrite the .gitignore file
      if (overwrite) {
        createFile(selectedWorkspaceFolder.uri, gitignoreContent);
      } else {
        extendFile(selectedWorkspaceFolder.uri, gitignoreContent);
      }
    }
  };
}

export default addCommand;

async function createFile(uri: vscode.Uri, content: string) {
  // create .gitignore file
  vscode.workspace.fs.writeFile(
    vscode.Uri.joinPath(uri, ".gitignore"),
    Buffer.from(content)
  );
}

async function extendFile(uri: vscode.Uri, content: string) {
  // append to .gitignore file
  const existingGitignore = await vscode.workspace.fs.readFile(
    vscode.Uri.joinPath(uri, ".gitignore")
  );

  vscode.workspace.fs.writeFile(
    vscode.Uri.joinPath(uri, ".gitignore"),
    Buffer.from(`${existingGitignore}\n${content}`)
  );
}
