# conda-init

A CLI tool to initialize Conda environments.

## Installation

You can use this package without installing it by using `npx`:

```
npx conda-init
```

Or you can install it globally:

```
npm install -g conda-init
```

## Usage

Run the command:

```
conda-init [env_name] [python_version] [--create]
```

- `env_name` (optional): The name of the Conda environment. If not provided, it will use the current directory name.
- `python_version` (optional): The Python version to use. Default is 3.10.14.
- `--create` (optional): Automatically create the Conda environment after generating the environment.yml file.

If you don't provide the environment name or Python version, the script will prompt you for input.

## Examples

1. Generate an `environment.yml` file with default settings:

   ```
   npx conda-init
   ```

2. Generate an `environment.yml` file with a specific name and Python version:

   ```
   npx conda-init myenv 3.9.7
   ```

3. Generate an `environment.yml` file and create the Conda environment:

   ```
   npx conda-init myenv 3.9.7 --create
   ```

4. Generate an `environment.yml` file with default settings and create the Conda environment:
   ```
   npx conda-init --create
   ```

## What it does

1. If not provided, prompts for environment name and Python version.
2. Generates an `environment.yml` file in the current directory.
3. If the `--create` flag is used, creates a Conda environment based on the generated file.
4. Provides the command to activate the newly created environment.

## Requirements

- Node.js >= 14.8.0
- Conda (must be installed and available in your PATH)

## License

MIT
