import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { promises as fs } from "fs";
import {
  getInput,
  fileExists,
  parseArgs,
  createEnvironmentFile,
  createCondaEnvironment,
} from "./index.mjs";

describe("conda-init", () => {
  describe("getInput", () => {
    it("should return user input when provided", async () => {
      const mockRL = {
        question: async () => "user-input",
      };
      const result = await getInput(mockRL, "prompt", "default");
      assert.equal(result, "user-input");
    });

    it("should return default value when user input is empty", async () => {
      const mockRL = {
        question: async () => "",
      };
      const result = await getInput(mockRL, "prompt", "default");
      assert.equal(result, "default");
    });
  });

  describe("fileExists", () => {
    it("should return true for existing files", async () => {
      // Create a temporary file
      await fs.writeFile("temp.txt", "test");
      const result = await fileExists("temp.txt");
      assert.equal(result, true);
      // Clean up
      await fs.unlink("temp.txt");
    });

    it("should return false for non-existing files", async () => {
      const result = await fileExists("non-existent.txt");
      assert.equal(result, false);
    });
  });

  describe("parseArgs", () => {
    it("should parse arguments correctly", () => {
      const args = ["env-name", "3.9.0", "--create", "--activate"];
      const result = parseArgs(args);
      assert.deepEqual(result, {
        create: true,
        activate: true,
        envName: "env-name",
        pythonVersion: "3.9.0",
      });
    });

    it("should handle missing optional arguments", () => {
      const args = ["env-name"];
      const result = parseArgs(args);
      assert.deepEqual(result, {
        create: false,
        activate: false,
        envName: "env-name",
        pythonVersion: null,
      });
    });
  });

  describe("createEnvironmentFile", () => {
    it("should create environment file with correct content", async () => {
      await createEnvironmentFile("test-env", "3.9.0");
      const content = await fs.readFile("environment.yml", "utf-8");
      assert.match(content, /name: test-env/);
      assert.match(content, /python=3.9.0/);
      // Clean up
      await fs.unlink("environment.yml");
    });
  });

  describe("createCondaEnvironment", () => {
    it("should throw an error if conda is not installed", () => {
      assert.throws(() => createCondaEnvironment("non-existent.yml"), {
        name: "Error",
        message: /Command failed/,
      });
    });
  });
});
