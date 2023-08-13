import * as sinon from "sinon";
import * as vscode from "vscode";
import { expect } from "chai";
import { describe, it, beforeEach, afterEach } from "mocha";
import addCommand from "../../../commands/addCommand";

import * as getGitignoreTypes from "../../../utils/getGitignoreTypes";
import * as selectWorkspace from "../../../utils/selectWorkspace";
import * as checkCreateOrExtend from "../../../utils/checkCreateOrExtend";
import * as getGitignore from "../../../utils/getGitignore";
import * as createFile from "../../../utils/createFile";
import * as extendFile from "../../../utils/extendFile";

describe("commands/addCommand", () => {
  let getGitignoreTypesStub: sinon.SinonStub;
  let selectWorkspaceStub: sinon.SinonStub;
  let checkCreateOrExtendStub: sinon.SinonStub;
  let getGitignoreStub: sinon.SinonStub;
  let createFileStub: sinon.SinonStub;
  let extendFileStub: sinon.SinonStub;

  // ... other stubs
  let showQuickPickStub: sinon.SinonStub;

  beforeEach(() => {
    // Stub the methods directly
    getGitignoreTypesStub = sinon.stub(getGitignoreTypes, "default");
    selectWorkspaceStub = sinon.stub(selectWorkspace, "default");
    checkCreateOrExtendStub = sinon.stub(checkCreateOrExtend, "default");
    getGitignoreStub = sinon.stub(getGitignore, "default");
    createFileStub = sinon.stub(createFile, "default");
    extendFileStub = sinon.stub(extendFile, "default");

    // Stub the methods indirectly
    showQuickPickStub = sinon.stub(vscode.window, "showQuickPick");
    // ... other stub initializations
  });

  afterEach(() => {
    // Restore the stubs after each test
    sinon.restore();
  });

  it("should handle a basic flow", async () => {
    // Stub the return values
    getGitignoreTypesStub.resolves(["a", "b"]);
    selectWorkspaceStub.resolves({ uri: vscode.Uri.file("some/path") });
    checkCreateOrExtendStub.resolves(true);
    getGitignoreStub.resolves("some content");
    createFileStub.resolves();

    // Stub the user input
    showQuickPickStub.resolves("a");

    // Run the command
    await addCommand([])();

    // Assert the stubs were called as expected
    expect(getGitignoreTypesStub.calledOnce).to.be.true;
    expect(selectWorkspaceStub.calledOnce).to.be.true;
    expect(checkCreateOrExtendStub.calledOnce).to.be.true;
    expect(getGitignoreStub.calledOnce).to.be.true;
    expect(createFileStub.calledOnce).to.be.true;
  });

  it("should handle a basic flow with extend", async () => {
    // Stub the return values
    getGitignoreTypesStub.resolves(["a", "b"]);
    selectWorkspaceStub.resolves({ uri: vscode.Uri.file("some/path") });
    checkCreateOrExtendStub.resolves(false);
    getGitignoreStub.resolves("some content");
    extendFileStub.resolves();

    // Stub the user input
    showQuickPickStub.resolves("a");

    // Run the command
    await addCommand([])();

    // Assert the stubs were called as expected
    expect(getGitignoreTypesStub.calledOnce).to.be.true;
    expect(selectWorkspaceStub.calledOnce).to.be.true;
    expect(checkCreateOrExtendStub.calledOnce).to.be.true;
    expect(getGitignoreStub.calledOnce).to.be.true;
    expect(extendFileStub.calledOnce).to.be.true;
  });
});
