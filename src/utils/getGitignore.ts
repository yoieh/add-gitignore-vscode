import * as vscode from "vscode";
import * as https from "https";

async function fetchedGitignoreContent(selectedType: string): Promise<string> {
  return new Promise((resolve, reject) => {
    // fetch gitignore content from github
    const gitignoreUrl = `https://raw.githubusercontent.com/github/gitignore/master/${selectedType}.gitignore`;

    const options = {
      hostname: "raw.githubusercontent.com",
      path: `/github/gitignore/master/${selectedType}.gitignore`,
      method: "GET",
      headers: {
        "User-Agent": "VSCode-Gitignore-Extension",
      },
    };

    return https
      .get(options, (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          resolve(data);
        });
      })
      .on("error", (err) => {
        reject(err);
      });
  });
}

async function tryGetGitignoreContent(selectedType: string) {
  try {
    return await fetchedGitignoreContent(selectedType);
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

export default async function getGitignoreContent(selectedType: string) {
  return await tryGetGitignoreContent(selectedType);
}
