import { RenderableTreeNodes } from "@markdoc/markdoc";

export abstract class CompileTarget {
  abstract compile(renderable: RenderableTreeNodes): unknown;
}
