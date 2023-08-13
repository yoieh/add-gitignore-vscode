import * as sinon from "sinon";
import * as vscode from "vscode";
import { expect } from "chai";
import { describe, it, beforeEach, afterEach } from "mocha";
import selectWorkspace from "../../../utils/selectWorkspace";

describe("utils/selectWorkspace", () => {
  let showErrorMessageStub: sinon.SinonStub;
  let showWorkspaceFolderPickStub: sinon.SinonStub;

  beforeEach(() => {
    showErrorMessageStub = sinon.stub(vscode.window, "showErrorMessage");
    showWorkspaceFolderPickStub = sinon.stub(
      vscode.window,
      "showWorkspaceFolderPick"
    );
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should show error message if no workspace is detected", async () => {
    const result = await selectWorkspace(
      {
        workspaceFolders: undefined,
      } as typeof vscode.workspace,
      vscode.window
    );
    expect(result).to.be.undefined;
    expect(showErrorMessageStub.calledOnce).to.be.true;
  });

  it("should return current workspace if only one is detected", async () => {
    const workspaceFolder = {} as vscode.WorkspaceFolder;
    const result = await selectWorkspace(
      {
        workspaceFolders: [workspaceFolder],
      } as unknown as typeof vscode.workspace,
      vscode.window
    );
    expect(result).to.equal(workspaceFolder);
    expect(showErrorMessageStub.notCalled).to.be.true;
  });

  it("should return selected workspace if more than one is detected", async () => {
    const workspaceFolder1 = {
      uri: {
        fsPath: "test1",
      },
    } as vscode.WorkspaceFolder;

    const workspaceFolder2 = {
      uri: {
        fsPath: "test2",
      },
    } as vscode.WorkspaceFolder;

    // Mocking user selection of workspaceFolder2
    showWorkspaceFolderPickStub.resolves(workspaceFolder2);

    const result = await selectWorkspace(
      {
        workspaceFolders: [workspaceFolder1, workspaceFolder2],
      } as unknown as typeof vscode.workspace,
      vscode.window
    );

    // Check if the returned result matches the expected workspace folder
    expect(result).to.eql(workspaceFolder2);

    // Verify that the showWorkspaceFolderPick method was called once
    expect(showWorkspaceFolderPickStub.calledOnce).to.be.true;
  });
});
