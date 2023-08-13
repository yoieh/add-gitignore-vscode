import * as vscode from "vscode";
import * as https from "https";

async function fetchGitignoreTypes(
  httpsModule: typeof https = https
): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "api.github.com",
      path: "/repos/github/gitignore/contents",
      method: "GET",
      headers: {
        "User-Agent": "VSCode-Gitignore-Extension",
      },
    };

    httpsModule
      .get(options, (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          const files = JSON.parse(data);
          const gitignoreFiles = files
            .filter((file: any) => file.name.endsWith(".gitignore"))
            .map((file: any) => file.name.replace(".gitignore", ""));
          resolve(gitignoreFiles);
        });
      })
      .on("error", (err) => {
        reject(err);
      });
  });
}

async function tryGetGitignoreTypes(
  cachedProjectTypes: string[],
  httpsModule: typeof https = https,
  window: typeof vscode.window = vscode.window
): Promise<string[]> {
  if (cachedProjectTypes.length === 0) {
    try {
      cachedProjectTypes = await fetchGitignoreTypes(httpsModule);
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

  return cachedProjectTypes;
}

export default async function getGitignoreTypes(
  cachedProjectTypes: string[],
  httpsModule: typeof https = https,
  window: typeof vscode.window = vscode.window
): Promise<string[]> {
  return await tryGetGitignoreTypes(cachedProjectTypes, httpsModule, window);
}
