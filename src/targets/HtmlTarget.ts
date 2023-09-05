import {
  RenderableTreeNodes,
  renderers as preparedRenderBackends,
} from "@markdoc/markdoc";
import { CompileTarget } from "./CompileTarget";

export class HtmlTarget extends CompileTarget {
  compile(renderables: RenderableTreeNodes): unknown {
    return preparedRenderBackends.html(renderables);
  }
}
