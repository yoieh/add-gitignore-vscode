import * as vscode from "vscode";
import * as https from "https";

async function fetchedGitignoreContent(
  selectedType: string,
  httpsModule: typeof https = https
): Promise<string> {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "raw.githubusercontent.com",
      path: `/github/gitignore/master/${selectedType}.gitignore`,
      method: "GET",
      headers: {
        "User-Agent": "VSCode-Gitignore-Extension",
      },
    };

    return httpsModule
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

async function tryGetGitignoreContent(
  selectedType: string,
  httpsModule: typeof https = https
) {
  try {
    return await fetchedGitignoreContent(selectedType, httpsModule);
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

export default async function getGitignore(
  selectedType: string,
  httpsModule: typeof https = https
) {
  return await tryGetGitignoreContent(selectedType, httpsModule);
}
