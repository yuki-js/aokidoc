import yargs from "yargs";
import { promises as fs } from "fs";
import { AokiDoc, MarkdownTarget } from "..";
import { RenderableASTTarget } from "../targets/RenderableASTTarget";

const cmd = yargs
  .scriptName("aokidoc")
  .usage("$0 -i <input> -o <output> -t <type>")
  .option("i", {
    alias: "input",
    describe: "Input markdoc file",
    type: "string",
    demandOption: true,
  })
  .option("o", {
    alias: "output",
    describe: "Output file (- for stdout)",
    type: "string",
    demandOption: true,
  })
  .option("t", {
    alias: "type",
    describe: "Output type",
    type: "string",
    demandOption: true,
  })
  .option("l", {
    alias: "language",
    describe: "Language",
    type: "string",
    default: "ja",
  })
  .option("L", {
    alias: "locale",
    describe: "Locale",
    type: "string",
    default: "ja-JP",
  })
  .option("s", {
    alias: "schema",
    describe: "Frontmatter JSON schema file",
    type: "string",
  })
  .help();

const argv = cmd.parseSync();
const environment = async () => {
  const {
    i: inFile,
    o: outFile,
    t: outType,
    l: language,
    L: locale,
    s: schemaFile,
  } = argv;

  let compileTarget;
  switch (outType) {
    case "md":
      compileTarget = new MarkdownTarget();
      break;
    case "ast":
      compileTarget = new RenderableASTTarget();
      break;
    default:
      throw new Error(`Unknown output type: ${outType}`);
  }

  let frontmatterSchema;
  if (schemaFile) {
    // load schema file
    const file = await fs.readFile(schemaFile);
    frontmatterSchema = JSON.parse(file.toString());
  }

  const aokidoc = new AokiDoc({
    language,
    locale,
    compileTarget,
    frontmatterSchema,
    variables: {},
  });

  // load input file
  const file = await fs.readFile(inFile);
  const md = file.toString();

  // compile
  const output = aokidoc.compile(md) as string;

  // write output
  if (outFile === "-") {
    // write to stdout
    process.stdout.write(output);
  } else {
    // write to file
    await fs.writeFile(outFile, output);
  }
};

environment();
