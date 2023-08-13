import * as sinon from "sinon";
import * as vscode from "vscode";
import { expect } from "chai";
import { describe, it, beforeEach, afterEach } from "mocha";
import extendFile from "../../../utils/extendFile";

describe("utils/extendFile", () => {
  let readFileStub: sinon.SinonStub;
  let writeFileStub: sinon.SinonStub;

  beforeEach(() => {
    readFileStub = sinon.stub();
    writeFileStub = sinon.stub();
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should append content to existing .gitignore", async () => {
    const fakeUri = vscode.Uri.file("/fake/path");
    const existingContent = Buffer.from("existing content");
    const newContent = "new content";

    readFileStub.resolves(existingContent);

    await extendFile(fakeUri, newContent, readFileStub, writeFileStub);

    expect(
      readFileStub.calledOnceWith(vscode.Uri.joinPath(fakeUri, ".gitignore"))
    ).to.be.true;
    expect(
      writeFileStub.calledOnceWith(
        vscode.Uri.joinPath(fakeUri, ".gitignore"),
        Buffer.from(`${existingContent}\n${newContent}`)
      )
    ).to.be.true;
  });
});
