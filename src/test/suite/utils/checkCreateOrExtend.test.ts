import * as vscode from "vscode";
import * as sinon from "sinon";
import { expect } from "chai";
import { describe, it, beforeEach, afterEach } from "mocha";
import checkCreateOrExtend from "../../../utils/checkCreateOrExtend";

describe("utils/createOrExtend", () => {
  let findFilesStub: sinon.SinonStub;
  let showQuickPickStub: sinon.SinonStub;

  const mockWorkspaceFolder = {
    uri: vscode.Uri.file("/path/to/workspace"),
    name: "workspace",
    index: 0,
  } as vscode.WorkspaceFolder;

  beforeEach(() => {
    findFilesStub = sinon.stub();
    showQuickPickStub = sinon.stub();
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should return true if .gitignore exists and user chooses to overwrite", async () => {
    findFilesStub.resolves([{ fsPath: "/path/to/gitignore" }]);
    showQuickPickStub.resolves("Yes");

    const result = await checkCreateOrExtend(
      mockWorkspaceFolder,
      findFilesStub,
      showQuickPickStub
    );

    expect(result).to.be.true;
  });

  it("should return false if .gitignore exists and user chooses not to overwrite", async () => {
    findFilesStub.resolves([{ fsPath: "/path/to/gitignore" }]);
    showQuickPickStub.resolves("No");

    const result = await checkCreateOrExtend(
      mockWorkspaceFolder,
      findFilesStub,
      showQuickPickStub
    );

    expect(result).to.be.false;
  });
});
