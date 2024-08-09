#!/usr/bin/env node

import { promises as fs } from "fs";
import path from "path";
import readline from "readline/promises";
import { execSync } from "child_process";

const ENVFILE_NAME = "environment.yml";

export async function getInput(rl, prompt, defaultValue) {
  const input = await rl.question(`${prompt} (${defaultValue}) `);
  return input.trim() || defaultValue;
}

export async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

export function parseArgs(args) {
  const options = {
    create: false,
    activate: false,
    envName: null,
    pythonVersion: null,
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case "--create":
        options.create = true;
        break;
      case "--activate":
        options.activate = true;
        break;
      default:
        if (!options.envName) {
          options.envName = args[i];
        } else if (!options.pythonVersion) {
          options.pythonVersion = args[i];
        }
    }
  }

  return options;
}

export async function createEnvironmentFile(condaEnvName, condaPythonVersion) {
  const fileContent = `name: ${condaEnvName}
channels:
  - defaults
dependencies:
  - python=${condaPythonVersion}
`;

  await fs.writeFile(ENVFILE_NAME, fileContent);
  return fileContent;
}

export function createCondaEnvironment(envFileName) {
  execSync(`conda env create -f ${envFileName}`, { stdio: "inherit" });
}

export async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  try {
    const options = parseArgs(process.argv.slice(2));

    let condaEnvName = options.envName || path.basename(process.cwd());
    let condaPythonVersion = options.pythonVersion || "3.10.14";

    condaEnvName = await getInput(rl, "Enter environment name:", condaEnvName);
    condaPythonVersion = await getInput(
      rl,
      "Enter environment version:",
      condaPythonVersion
    );

    console.log(
      `Environment: ${condaEnvName} with Python version: ${condaPythonVersion}`
    );

    if (await fileExists(ENVFILE_NAME)) {
      console.log(`${ENVFILE_NAME} already exists. Skipping file creation.`);
    } else {
      await createEnvironmentFile(condaEnvName, condaPythonVersion);
      console.log(`${ENVFILE_NAME} created successfully.`);
    }

    if (options.create) {
      try {
        console.log("Creating Conda environment...");
        createCondaEnvironment(ENVFILE_NAME);
        console.log("Conda environment created successfully.");
      } catch (error) {
        console.error("Failed to create Conda environment:", error.message);
      }
    }

    if (options.activate) {
      console.log(`To activate the environment, run the following command:`);
      console.log(`conda activate ${condaEnvName}`);
      console.log(
        `Note: This script cannot directly activate the environment due to Node.js process limitations.`
      );
    }
  } finally {
    rl.close();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}
