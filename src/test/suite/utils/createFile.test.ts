import * as sinon from "sinon";
import * as vscode from "vscode";
import { expect } from "chai";
import { describe, it, beforeEach, afterEach } from "mocha";
import createFile from "../../../utils/createFile";

describe("utils/createFile", () => {
  let writeFileStub: sinon.SinonStub;

  beforeEach(() => {
    writeFileStub = sinon.stub();
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should create .gitignore with provided content", async () => {
    const fakeUri = vscode.Uri.file("/fake/path");
    const newContent = "new content";

    await createFile(fakeUri, newContent, writeFileStub);

    expect(
      writeFileStub.calledOnceWith(
        vscode.Uri.joinPath(fakeUri, ".gitignore"),
        Buffer.from(newContent)
      )
    ).to.be.true;
  });
});
