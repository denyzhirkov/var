```
                   
                   
  __   ____ _ _ __ 
  \ \ / / _` | '__|
   \ V / (_| | |   
    \_/ \__,_|_|   
                   
                   

```

### CLI key-value storage application written on [Deno](https://deno.land)
##
***


Install
```
curl -fsSL https://var.rocks/install | bash
```

Use "var" or "var -h" for help
```
var -h
```

***

**Usage**: **var** *key* [*value* | *flag*]

  **key** - Key to store
  **value** - Value to store
  **flag** - Modifier to use
  
  Flags:
  | short | long | descripton |
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

