# var — CLI Key-Value Storage

![logo](var.rocks/header.png)

## Overview
**var** is a cross-platform CLI application for storing, searching, and managing key-value variables with clipboard support, self-update, and SQLite storage. Written in [Deno](https://deno.land).

---

## Features
- Fast saving and searching of variables by key
- Clipboard integration (copy/paste)
- Self-update with a single command
- Data stored in a local SQLite file (by default, next to the binary)
- Smart flags for quick actions
- Cross-platform: macOS, Linux, Windows

---

## Requirements
- **Deno**: >=2.0.0 ([install](https://deno.land/manual/getting_started/installation))
- **Supported OS**: macOS, Linux, Windows (requires xclip/pbcopy/pbpaste/powershell for clipboard)

---

## Dependencies
- [Deno](https://deno.land/) — JS/TS runtime
- [sqlite](https://deno.land/x/sqlite) — embedded database
- [chalkin](https://deno.land/x/chalkin) — colored terminal output

---

## Project Structure
```
var/
  src/
    index.ts           # Entry point, CLI logic
    libs/              # Helper libraries (clipboard, self-update, key-id)
    message/           # Messages and terminal output formatting
    storage/           # SQLite and storage abstraction
  var.rocks/           # Web resources (logo, html)
  build.sh, install.sh # Build and install scripts
  README.md, package.json
```

---

## How it works
- **CLI**: All commands and flags are handled in `src/index.ts`.
- **Storage**: Data is stored in SQLite via `src/storage/db.ts` and `storage.ts`.
- **Clipboard**: Cross-platform clipboard support using system utilities (`pbcopy`, `xclip`, `powershell`).
- **Self-update**: Automatically downloads and installs the latest version via curl/bash.
- **Smart flags**: Allow quick copy/paste actions without explicitly specifying keys.

---

## Installation
```sh
curl -fsSL https://var.rocks/install | bash
```

---

## Usage

Use `var` or `var -h` for help:
```sh
var -h
```

**Examples:**
- `var mykey myvalue` — save a value
- `var mykey` — get a value
- `var mykey -c` — copy value to clipboard
- `var mykey -d` — delete a key
- `var -l` — list all keys
- `var --self-update` — update var

---

## Flags
| short | long        | description                |
|-------|-------------|---------------------------|
| -v    | --version   | Show version              |
| -h    | --help      | Show help                 |
| -c    | --copy      | Copy value to clipboard   |
| -p    | --paste     | Paste value from clipboard|
| -d    | --delete    | Delete key                |
| -l    | --list      | List all keys             |
| -r    | --rewrite   | Rewrite value             |
| -db   | --database  | Database path             |
|       | --self-update | Self-update             |
| !     |             | Smart mode                |

---

## Troubleshooting
- **Clipboard errors**: Make sure `xclip` (Linux) or standard utilities (macOS/Windows) are installed.
- **Deno permissions**: The app requires permissions for file system and process execution. Run with `--allow-read --allow-write --allow-run`.
- **SQLite errors**: Check file permissions for the database file.

---

## Contributing
PRs and suggestions are welcome! Please open issues or submit pull requests.

---

## Author & License
- Author: [Denis Zhirkov](mailto:denyzhirkov@gmail.com)
- [GitHub](https://github.com/denyzhirkov/var)
- License: MIT (unless otherwise specified)

---

# Help & Examples

(Below is the original help and usage section)

**Usage**: **var** *key* [*value* | *flag*]

  **key** - Key to store
  **value** - Value to store
  **flag** - Modifier to use
  
  Flags:
  | short | long | description |
  |---|---|---|
  |-v| --version     |Show var version
  |-h| --help        |Show this help message
  |-c| --copy        |Copy value to clipboard
  |-p| --paste       |Paste value from clipboard
  |-d| --delete      |Delete value
  |-l| --list        |List all keys with length
  |-r| --rewrite     |Rewrite value
  |-db| --database   |Database path
  |!  |              | Smart flag

  `Help`:

  **var** *-h*    Show this help message

  **var** *-l*    Show list of all keys

  **var** *-v*    Show var version

  **var** *-db*   Database path

  `Update`:

  **var** *--self-update*    Update var

  `Reading`:

  **var** *key*     Read value of key

  **var** *key* *-c*   Read value of key and copy to clipboard

  `Writing`:

  **var** *key* *value*      Write value to key

  **var** *key* *-p*         Write value to key from clipboard

  **var** *key* *value* *-r*   Rewrite value to key

  `Deleting`:

  **var** *key* *-d*   Delete key

  **var** *-d* *-d*    Clear all keys

  `Smart`:

  **var** *!*                Write value from clipboard to a random key

  **var** *key* *!*            Read to clipboard if key exists, else write from clipboard

  **var** *key* *value* *!*      Rewrite value to key

  **var** *key *value* *-p* *!*   Rewrite value to key from clipboard

