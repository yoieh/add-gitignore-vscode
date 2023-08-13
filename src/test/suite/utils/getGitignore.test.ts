import * as https from "https";
import * as sinon from 'sinon';
import { expect } from 'chai';
import { describe, it, beforeEach, afterEach } from "mocha";
import getGitignore from "../../../utils/getGitignore";

describe("utils/getGitignore", () => {
  let httpsGetStub: sinon.SinonStub;

  beforeEach(() => {
    httpsGetStub = sinon.stub(https, "get");
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should return content for a valid gitignore type", async () => {
    const mockData = "mocked content";
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

    const result = await getGitignore("Node", https);

    expect(result).to.equal(mockData);
  });
});
