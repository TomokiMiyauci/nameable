import {
  hasSpecialCharacter,
  isBlacklistName,
  isEqualNormalizedName,
  isLowerCase,
  validateNpm,
} from "./validate.ts";
import { normalize } from "./format.ts";
import { assertEquals } from "../../dev_deps.ts";
import {
  INVALID_BLACKLIST,
  INVALID_LETTER_CASE,
  INVALID_SPACIAL_CHAR,
  INVALID_START_WITH_,
  INVALID_START_WITH_DOT,
} from "./constants/message.ts";
import {
  INVALID_LENGTH_0,
  INVALID_NOT_STRING,
  INVALID_TRIMABLE,
} from "../shared/mod.ts";

const emptyString = "";

Deno.test("isLowerCase", () => {
  const table: [string, boolean][] = [
    [emptyString, true],
    ["a", true],
    [
      "hoge",
      true,
    ],
    ["Hello", false],
    ["heLlo", false],
    ["hello Everyone", false],
  ];

  table.forEach(([val, expected]) => {
    assertEquals(
      isLowerCase(val),
      expected,
      `isLowerCase(${val}) -> ${expected}`,
    );
  });
});

Deno.test("hasSpecialCharacter", () => {
  const table: [string, boolean][] = [
    [emptyString, false],
    ["a", false],
    [
      "hoge",
      false,
    ],
    [
      "~",
      true,
    ],
    [
      "'",
      true,
    ],
    [
      "!",
      true,
    ],
    [
      "(",
      true,
    ],
    [
      ")",
      true,
    ],
    [
      "*",
      true,
    ],
    [
      "~'!()*",
      true,
    ],
    [
      "~'!()*xxxxxxx",
      true,
    ],
  ];

  table.forEach(([val, expected]) => {
    assertEquals(
      hasSpecialCharacter(val),
      expected,
      `hasSpecialCharacter(${val}) -> ${expected}`,
    );
  });
});

Deno.test("isBlacklistName", () => {
  const table: [string, boolean][] = [
    [emptyString, false],
    ["hello", false],
    ["node_modules", true],
    ["favicon.ico", true],
  ];

  table.forEach(([val, expected]) => {
    assertEquals(
      isBlacklistName(val),
      expected,
      `isBlacklistName(${val}) -> ${expected}`,
    );
  });
});

Deno.test("isEqualNormalizedName", () => {
  const table: [string, string, boolean][] = [
    ["", "", true],
    ["fonction", "fonction", true],
    ["name-able", "nameable", true],
    ["nameable", "nameable", true],
    ["name-able", "n-a-m-e-a-b-l-e", true],
    ["n.a.m-e..a-b-le", "na.m.e.a.ble", true],
    ["nameable", "nnamebale", false],
    ["n-a--m-e-a-b-l_e", "n-a-m_e._a.b.le", true],
  ];

  table.forEach(([name, packageName, expected]) => {
    assertEquals(
      isEqualNormalizedName(normalize(name))(packageName),
      expected,
      `isEqualNormalizedName(${name})(${packageName}) -> ${expected}`,
    );
  });
});

Deno.test("validateNpm", () => {
  const table: [unknown, string | undefined][] = [
    [undefined as unknown, INVALID_NOT_STRING],
    [emptyString, INVALID_LENGTH_0],
    ["A", INVALID_LETTER_CASE],
    [" hello", INVALID_TRIMABLE],
    ["~", INVALID_SPACIAL_CHAR],
    ["_hello", INVALID_START_WITH_],
    [".hello", INVALID_START_WITH_DOT],
    ["fonction", undefined],
    ["fonction~", INVALID_SPACIAL_CHAR],
    ["node_modules", `node_modules ${INVALID_BLACKLIST}`],
    ["favicon.ico", `favicon.ico ${INVALID_BLACKLIST}`],
  ];

  table.forEach(([val, expected]) => {
    assertEquals(
      validateNpm(val),
      expected,
      `validateNpm(${val}) -> ${expected}`,
    );
  });
});
