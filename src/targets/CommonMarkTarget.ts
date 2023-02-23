import { RenderableTreeNodes, Tag } from "@markdoc/markdoc";
import { CompileTarget } from "./CompileTarget";

export class CommonMarkTarget extends CompileTarget {
  compile(renderables: RenderableTreeNodes): unknown {
    return render(renderables);
  }
}

/**
 * Renders CommonMark
 * @param node RenderableTreeNode
 * @returns string
 */
function render(node: RenderableTreeNodes, parentTagName?: string): string {
  if (typeof node === "string" || typeof node === "number")
    return node.toString();

  if (Array.isArray(node))
    return node.map((child) => render(child, parentTagName)).join("");

  if (node === null || typeof node !== "object" || !Tag.isTag(node)) return "";

  const { name, attributes, children = [] } = node;

  if (!name) return render(children);

  let output = "";

  switch (name) {
    case "h1":
    case "h2":
    case "h3":
    case "h4":
    case "h5":
    case "h6":
      output += `${"#".repeat(parseInt(name[1]))} `;
      output += render(children);
      output += "\n";
      break;
    case "p":
      output += render(children);
      output += "\n";
      break;
    case "ul":
      output += render(children, name);
      break;
    case "ol":
      output += render(children, name);
      break;
    case "li":
      if (parentTagName === "ul") {
        output += "- ";
      } else if (parentTagName === "ol") {
        output += "1. ";
      }
      output += render(children);
      output += "\n";
      break;
    case "a":
      output += `[${render(children)}](${attributes.href})`;
      break;
    case "strong":
      output += `**${render(children)}**`;
      break;
    case "em":
      output += `*${render(children)}*`;
      break;
    case "code":
      output += `\`${render(children)}\``;
      break;
    case "pre":
      output += "```";
      output += "\n";
      output += render(children);
      output += "\n";
      output += "```";
      output += "\n";
      break;
    case "img":
      output += `![${attributes.alt}](${attributes.src})`;
      break;
    case "br":
      output += "\n";
      break;
    case "table":
      output += renderTable(children);
      break;

    default:
      output += render(children);
      break;
  }

  return output;
}

function renderTable(children: RenderableTreeNodes[]): string {
  let output = "";
  const tHead = children[0] as Tag<"thead">;
  const tBody = children.slice(1) as Tag<"tbody">[];

  const headerTr = tHead!.children[0] as Tag<"tr">;
  const headerCells = headerTr!.children as Tag<"th">[];

  // render header
  output += "|";
  for (const headerCell of headerCells) {
    output += ` ${render(headerCell.children)} |`;
  }
  output += "\n";
  // render header separator
  output += "|";
  for (const headerCell of headerCells) {
    output += ` ${"-".repeat((headerCell.children[0]! as string).length)} |`;
  }
  output += "\n";

  const bodyRows = tBody[0].children as Tag<"tr">[];
  for (const bodyRow of bodyRows) {
    const bodyCells = bodyRow.children as Tag<"td">[];
    output += "|";
    for (const bodyCell of bodyCells) {
      output += ` ${render(bodyCell.children)} |`;
    }
    output += "\n";
  }
  output += "\n";
  return output;
}
