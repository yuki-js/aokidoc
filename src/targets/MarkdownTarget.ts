import { RenderableTreeNode, renderers } from "@markdoc/markdoc";
import { CompileTarget } from "./CompileTarget";

export class MarkdownTarget extends CompileTarget {
  compile(renderables: RenderableTreeNode): unknown {
    throw new Error("Method not implemented.");
  }
}
