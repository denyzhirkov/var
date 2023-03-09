import chalkin from "https://deno.land/x/chalkin/mod.ts";
import { Item } from "../storage/index.ts";
import { logoString } from "./assets.ts";

const log = console.log;

const LOGO = chalkin.bold.cyan(logoString());
const APP = chalkin.bold.cyan("var");

const K = (key: string) => chalkin.green(key);
const F = (flag: string) => chalkin.yellow(flag);
const V = (value: string) => chalkin.magenta(value);
const EXISTS = chalkin.bold.red("exists");
const COPIED = chalkin.bold.magenta("copied");
const DELETED = chalkin.bold.strikethrough.gray("deleted");

export const helpMessage = () => {
  log(
  `${LOGO}
  Usage: ${APP} ${K("key")} [${V("value")} | ${F("flag")}]

  ${K("key")}      Key to store
  ${V("value")}    Value to store
  ${F("flag")}     Modifier to use
  
  Flags:
  ${F("-v, --version")}     Show var version
  ${F("-h, --help")}        Show this help message
  ${F("-c, --copy")}        Copy value to clipboard
  ${F("-p, --paste")}       Paste value from clipboard
  ${F("-d, --delete")}      Delete value
  ${F("-l, --list")}        List all keys with length
  ${F("-r, --rewrite")}     Rewrite value
  ${F("-db, --database")}   Database path
  ${F("!")}                 Smart flag

  Help:
  ${APP} ${F("-h")}  - Show this help message
  ${APP} ${F("-l")}  - Show list of all keys
  ${APP} ${F("-v")}  - Show var version
  ${APP} ${F("-db")} - Database path

  Reading:
  ${APP} ${K("key")}   - Read value of key
  ${APP} ${K("key")} ${F("-c")} - Read value of key and copy to clipboard

  Writing:
  ${APP} ${K("key")} ${V("value")}    - Write value to key
  ${APP} ${K("key")} ${F("-p")}       - Write value to key from clipboard
  ${APP} ${K("key")} ${V("value")} ${F("-r")} - Rewrite value to key

  Deleting:
  ${APP} ${K("key")} ${F("-d")} - Delete key
  ${APP} ${F("-d")} ${F("-d")}  - Clear all keys

  Smart:
  ${APP} ${F("!")}              - Write value from clipboard to a random key
  ${APP} ${K("key")} ${F("!")}          - Read to clipboard if key exists, else write from clipboard
  ${APP} ${K("key")} ${V("value")} ${F("!")}    - Rewrite value to key
  ${APP} ${K("key")} ${V("value")} ${F("-p")} ${F("!")} - Rewrite value to key from clipboard
  `);
};

export const errorMessage = (reason: string) => {
  log(chalkin.red(`Closing reason: ${reason}`));
};

export const resultMessage = (value: string) => {
  log(value);
};

export const notFoundMessage = (key: string) => {
  log(`${K(key)} not found`);
};

export const noItemsMessage = () => {
  log(`No items found`);
};

export const resultListMessage = (items: Item[]) => {
  log(
    items.map((item) => K(item.key)).join(", ")
  );
};

export const resultListLengthMessage = (items: Item[]) => {
  log(
    items.map((item) => `${K(item.key)}[${item.value.length}]`).join(", ")
  );
};

export const itemSavedMessage = (key: string) => {
  log(`${K(key)} saved`);
};

export const itemCopiedMessage = (key: string) => {
  log(`${K(key)} ${COPIED} to clipboard`);
};

export const itemDeletedMessage = (key: string) => {
  log(`${K(key)} ${DELETED}`);
};

export const deletedAllMessage = () => {
  log(`${K('All keys')} ${DELETED}`);
};

export const itemExistsMessage = (key: string) => {
  log(`${K(key)} ${EXISTS}`);
};

export const itemRewrittenMessage = (key: string) => {
  log(`${K(key)} rewritten`);
};

export const versionMessage = (version: string) => {
  log(`${APP} v${version}`);
};
