import * as vscode from "vscode";
import * as fs from "fs";

function detectProjectType(rootPath: string): string | null {
  if (fs.existsSync(`${rootPath}/package.json`)) {
    return "Node";
  }

  if (
    fs.existsSync(`${rootPath}/requirements.txt`) ||
    fs.existsSync(`${rootPath}/setup.py`)
  ) {
    return "Python";
  }

  if (fs.existsSync(`${rootPath}/pom.xml`)) {
    return "Java";
  }
  // ... add more matchers as needed
  return null; // if no type is detected
}

export default detectProjectType;
