import * as vscode from "vscode";
import * as https from "https";

async function fetchGitignoreTypes(): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "api.github.com",
      path: "/repos/github/gitignore/contents",
      method: "GET",
      headers: {
        "User-Agent": "VSCode-Gitignore-Extension",
      },
    };

    https
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
  cachedProjectTypes: string[]
): Promise<string[]> {
  if (cachedProjectTypes.length === 0) {
    try {
      cachedProjectTypes = await fetchGitignoreTypes();
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

  return cachedProjectTypes;
}

export default async function getGitignoreTypes(
  cachedProjectTypes: string[]
): Promise<string[]> {
  return await tryGetGitignoreTypes(cachedProjectTypes);
}
