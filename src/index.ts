import { VERSION } from './version.ts'
import {
  helpMessage, itemCopiedMessage, itemDeletedMessage,
  itemExistsMessage, itemRewrittenMessage, itemSavedMessage,
  noItemsMessage, notFoundMessage, resultListLengthMessage,
  resultMessage, versionMessage, deletedAllMessage, errorMessage
} from "./message/index.ts";
import { Db } from "./storage/db.ts";
import { Storage } from "./storage/index.ts";
import { generateKey } from "./libs/key-id.ts";
import { copy, paste } from './libs/clipboard.ts';

globalThis.addEventListener('unhandledrejection', (e: PromiseRejectionEvent) => {
  errorMessage(e.reason);
  Deno.exit(1);
});
globalThis.addEventListener('error', (e: ErrorEvent) => {
  errorMessage(e.message);
  Deno.exit(1);
});

const execDir = Deno.execPath()
  .split('/').slice(0, -1).join('/');
const dbPath = `${execDir}/var.sqlite`;
const storage = new Storage(new Db(dbPath));

const flags = {
  get hasKey() {
    return Deno.args.length > 0 && Deno.args[0].startsWith('-') === false;
  },
  get hasValue() {
    return Deno.args.length > 1 && Deno.args[1].startsWith('-') === false;
  },
  get hasFlags() {
    return Deno.args.some((arg) => arg.startsWith('-'));
  },
  get isVersion() {
    return Deno.args.includes('--version') || Deno.args.includes('-v');
  },
  get isHelp() {
    return Deno.args.includes('--help') || Deno.args.includes('-h');
  },
  get isCopy() {
    return Deno.args.includes('--copy') || Deno.args.includes('-c');
  },
  get isPaste() {
    return Deno.args.includes('--paste') || Deno.args.includes('-p');
  },
  get isDelete() {
    return Deno.args.includes('--delete') || Deno.args.includes('-d');
  },
  get isDoubleDelete() {
    return Deno.args.length == 2 && Deno.args.every((arg) => arg === '-d');
  },
  get isList() {
    return Deno.args.includes('--list') || Deno.args.includes('-l');
  },
  get isRewrite() {
    return Deno.args.includes('--rewrite') || Deno.args.includes('-r');
  },
  get isSmart() {
    return Deno.args.includes('!');
  },
  get isDb() {
    return Deno.args.length === 1 &&
      (Deno.args.includes('--database') || Deno.args.includes('-db'));
  }
};


if (Deno.args.length === 0) {
  helpMessage();
  Deno.exit(0);
}

/*
  var ! => Write from clipboard to a random key
  var -db/--database => Open database
  var -l/--list => List-length all
  var -v/--version => Version 
  var key => Read
*/
if (Deno.args.length === 1) {
  // Help
  if (flags.isHelp) {
    helpMessage();
    Deno.exit(0);
  }

  // Db path
  if (flags.isDb) {
    resultMessage(dbPath);
    Deno.exit(0);
  }

  // Version
  if (flags.isVersion) {
    versionMessage(VERSION);
    Deno.exit(0);
  }

  // List all
  if (flags.isList) {
    const items = storage.findAll();
    if (items.length === 0) {
      noItemsMessage();
    } else {
      resultListLengthMessage(items);
    }
    Deno.exit(0);
  }

  // Write from clipboard to a random key
  if (flags.isSmart) {
    const pValue = await paste();
    const key = generateKey();
    storage.saveKey(key, pValue);
    itemSavedMessage(key);
    Deno.exit(0);
  }

  // Read
  if (flags.hasKey) {
    const item = storage.findByKey(Deno.args[0]);
    if (item === null) {
      notFoundMessage(Deno.args[0]);
    } else {
      resultMessage(item.value);
    }
  } else {
    helpMessage();
  }
  Deno.exit(0);
}

/*
  var key -p/--paste => Write from clipboard
  var key ! => Read to clipboard / Write from clipboard
  var key -d/--delete => Delete
  var key value => Save
*/
if (Deno.args.length === 2) {
  if (flags.hasKey) {
    // Save from clipboard
    if (flags.isPaste) {
      const pValue = await paste();
      storage.saveKey(Deno.args[0], pValue);
      itemSavedMessage(Deno.args[0]);
      Deno.exit(0);
    }

    // Read to clipboard / Write from clipboard
    if (flags.isSmart) {
      const item = storage.findByKey(Deno.args[0]);
      if (item === null) {
        const pValue = await paste();
        storage.saveKey(Deno.args[0], pValue);
        itemSavedMessage(Deno.args[0]);
      } else {
        await copy(item.value);
        itemCopiedMessage(Deno.args[0]);
      }
      Deno.exit(0);
    }

    // Delete key
    if (flags.isDelete) {
      const item = storage.findByKey(Deno.args[0]);
      if (item === null) {
        notFoundMessage(Deno.args[0]);
      } else {
        storage.deleteByKey(Deno.args[0]);
        itemDeletedMessage(Deno.args[0]);
      }
      Deno.exit(0);
    }

    // Save
    if (flags.hasValue) {
      if (storage.findByKey(Deno.args[0]) !== null) {
        itemExistsMessage(Deno.args[0]);
      } else {
        storage.saveKey(Deno.args[0], Deno.args[1]);
        itemSavedMessage(Deno.args[0]);
      }
      Deno.exit(0);
    }
  } else {
    // Delete all
    if (flags.isDoubleDelete) {
      storage.deleteAll();
      deletedAllMessage();
      Deno.exit(0);
    }

    helpMessage();
  }
  Deno.exit(0);
}


/*
  var key value -r/--rewrite => Rewrite
  var key value ! => Rewrite
  var key -p/--paste ! => Write from clipboard with rewrite
  var key -p/--paste -r => Write from clipboard with rewrite
*/
if (Deno.args.length === 3) {
  if (flags.hasKey) {
    // Rewrite
    if (flags.hasValue && (flags.isSmart || flags.isRewrite)) {
      storage.replaceKey(Deno.args[0], Deno.args[1]);
      itemRewrittenMessage(Deno.args[0]);
      Deno.exit(0);
    }

    // Save from clipboard
    if (flags.isPaste && (flags.isSmart || flags.isRewrite)) {
      const pValue = await paste();
      storage.replaceKey(Deno.args[0], pValue);
      itemRewrittenMessage(Deno.args[0]);
      Deno.exit(0);
    }
  } else {
    helpMessage();
  }
  Deno.exit(0);
}
Deno.exit(0);