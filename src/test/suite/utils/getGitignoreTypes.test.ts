import * as https from "https";
import * as sinon from "sinon";
import * as vscode from "vscode";
import { expect } from "chai";
import { describe, it, beforeEach, afterEach } from "mocha";
import getGitignoreTypes from "../../../utils/getGitignoreTypes";

describe("utils/getGitignoreTypes", () => {
  let httpsGetStub: sinon.SinonStub;
  let showErrorMessageStub: sinon.SinonStub;

  beforeEach(() => {
    httpsGetStub = sinon.stub(https, "get");
    showErrorMessageStub = sinon.stub(vscode.window, "showErrorMessage");
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should return gitignore types for a valid response", async () => {
    const mockData = JSON.stringify([
      { name: "Node.gitignore" },
      { name: "Python.gitignore" },
      { name: "README.md" },
    ]);
    const mockResponse = {
      on: (event: string, callback: (chunk?: any) => void) => {
        if (event === "data") {
          callback(mockData);
        }
        if (event === "end") {
          callback();
        }
      },
    };

    httpsGetStub.yields(mockResponse as any);

    const result = await getGitignoreTypes([], https, vscode.window);

    expect(result).to.eql(["Node", "Python"]);
  });

  it("should return cached gitignore types if available", async () => {
    const cachedTypes = ["CachedType1", "CachedType2"];
    const result = await getGitignoreTypes(cachedTypes, https, vscode.window);

    expect(result).to.eql(cachedTypes);
    expect(httpsGetStub.called).to.be.false;
  });

  it("should show error message if request fails", async () => {
    const mockError = new Error("Request failed");

    // Make the https.get call trigger the error event
    httpsGetStub.callsFake((options, callback) => {
      const fakeRequest = {
        on: (event: string, eventCallback: (error?: any) => void) => {
          if (event === "error") {
            eventCallback(mockError);
          }
        },
        end: () => {}, // stubbing end method as it might be called internally
      };
      return fakeRequest as any;
    });

    // Execute the function
    const result = await getGitignoreTypes([], https, vscode.window);

    // Verify that showErrorMessage was called with the expected error message
    expect(
      showErrorMessageStub.calledOnceWith(
        "Failed to fetch gitignore types.",
        mockError.message
      )
    ).to.be.true;

    // Optionally, verify that the result is an empty array or whatever you expect in an error scenario
    expect(result).to.eql([]);
  });
});
