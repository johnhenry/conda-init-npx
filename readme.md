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
conda-init [env_name] [python_version] [--create] [--activate]
```

- `env_name` (optional): The name of the Conda environment. If not provided, it will use the current directory name.
- `python_version` (optional): The Python version to use. Default is 3.10.14.
- `--create` (optional): Automatically create the Conda environment.
- `--activate` (optional): Provide instructions to activate the environment.

If you don't provide the environment name or Python version, the script will prompt you for input.

## Examples

1. Create a new environment with default settings:

   ```
   npx conda-init --create
   ```

2. Create a new environment with a specific name and Python version:

   ```
   npx conda-init myenv 3.9.7 --create
   ```

3. Generate an `environment.yml` file without creating the environment:
   ```
   npx conda-init
   ```

## Requirements

- Node.js >= 14.8.0
- Conda (must be installed and available in your PATH)

## License

MIT
