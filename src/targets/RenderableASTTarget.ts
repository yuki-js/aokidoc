import { RenderableTreeNodes } from "@markdoc/markdoc";
import { CompileTarget } from "./CompileTarget";

export class RenderableASTTarget extends CompileTarget {
  compile(renderables: RenderableTreeNodes): unknown {
    return JSON.stringify(renderables);
  }
}
