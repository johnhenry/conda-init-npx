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
    remove: false,
    file: false,
    envName: null,
    pythonVersion: null,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith("-")) {
      if (arg === "--create" || arg === "-c") options.create = true;
      if (arg === "--remove" || arg === "-r") options.remove = true;
      if (arg === "--file" || arg === "-f") options.file = true;
      if (arg.startsWith("-") && !arg.startsWith("--")) {
        // Handle combined short flags
        if (arg.includes("c")) options.create = true;
        if (arg.includes("r")) options.remove = true;
        if (arg.includes("f")) options.file = true;
      }
    } else if (!options.envName) {
      options.envName = arg;
    } else if (!options.pythonVersion) {
      options.pythonVersion = arg;
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

export function removeCondaEnvironment(envName) {
  execSync(`conda env remove -n ${envName}`, { stdio: "inherit" });
}

export async function removeEnvironmentFile() {
  if (await fileExists(ENVFILE_NAME)) {
    await fs.unlink(ENVFILE_NAME);
    console.log(`${ENVFILE_NAME} has been removed.`);
  } else {
    console.log(`${ENVFILE_NAME} does not exist.`);
  }
}

// Main execution
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

try {
  const options = parseArgs(process.argv.slice(2));

  let condaEnvName = options.envName || path.basename(process.cwd());
  let condaPythonVersion = options.pythonVersion || "3.10.14";

  if (options.remove) {
    try {
      console.log(`Removing Conda environment: ${condaEnvName}`);
      removeCondaEnvironment(condaEnvName);
      console.log("Conda environment removed successfully.");

      if (options.file) {
        await removeEnvironmentFile();
      }
    } catch (error) {
      console.error("Failed to remove Conda environment:", error.message);
    }
  } else {
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
        console.log(
          `To activate the environment, run: conda activate ${condaEnvName}`
        );
      } catch (error) {
        console.error("Failed to create Conda environment:", error.message);
      }
    }
  }
} catch (error) {
  console.error("An error occurred:", error);
} finally {
  rl.close();
}
