import { RenderableTreeNode } from "@markdoc/markdoc";

export abstract class CompileTarget {
  abstract compile(renderable: RenderableTreeNode): unknown;
}
