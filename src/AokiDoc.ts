import Markdoc, { Node, RenderableTreeNode } from "@markdoc/markdoc";
import Ajv from "ajv";
import yaml from "js-yaml";
import addFormats from "ajv-formats";
import { Preferences, defaultPreferences } from "./Preferences";
type MdStr = string;
type Frontmatter = object;

export class AokiDoc {
  private preferences: Preferences;
  constructor(preferences: Preferences) {
    this.preferences = { ...defaultPreferences, ...preferences };
  }

  private md?: MdStr;
  private frontmatter?: Frontmatter;
  private ast?: Node;
  private renderables?: RenderableTreeNode;

  private extractAst() {
    if (!this.md) {
      throw new Error("No markdown loaded");
    }
    if (this.frontmatter) {
      throw new Error("Frontmatter already extracted");
    }
    if (this.ast) {
      throw new Error("AST already extracted");
    }

    const ast = Markdoc.parse(this.md);
    let frontmatter: Frontmatter;

    if (ast.attributes.frontmatter) {
      try {
        frontmatter = yaml.load(ast.attributes.frontmatter) as Frontmatter;
      } catch (e) {
        frontmatter = {
          _error: "Failed to parse frontmatter",
        };
      }
    } else {
      frontmatter = {
        _error: "No frontmatter found",
      };
    }

    this.frontmatter = frontmatter;
    this.ast = ast;
  }
  private validateFrontmatter(): boolean {
    if (!this.preferences.frontmatterSchema) {
      return true;
    }
    if (!this.frontmatter) {
      throw new Error("No frontmatter found");
    }

    const ajv = addFormats(new Ajv(), [
      "date-time",
      "time",
      "date",
      "email",
      "hostname",
      "ipv4",
      "ipv6",
      "uri",
      "uri-reference",
      "uuid",
      "uri-template",
      "json-pointer",
      "relative-json-pointer",
      "regex",
    ])
      .addKeyword("kind")
      .addKeyword("modifier");

    const isValidWork = ajv.validate(
      this.preferences.frontmatterSchema,
      this.frontmatter
    );
    return isValidWork;
  }

  private makeRenderables() {
    if (!this.ast) {
      throw new Error("No AST found");
    }
    if (!this.frontmatter) {
      throw new Error("No frontmatter found");
    }
    if (!this.md) {
      throw new Error("No markdown found");
    }
    if (this.renderables) {
      throw new Error("Renderables already made");
    }

    this.extractAst();
    const isValid = this.validateFrontmatter();
    if (!isValid) {
      throw new Error("Frontmatter is invalid");
    }

    const config = {
      variables: {
        ...this.preferences.variables,
        frontmatter: this.frontmatter,
      },
    };

    const renderable = Markdoc.transform(this.ast, config);

    this.renderables = renderable;
  }

  public compile(md: MdStr): unknown {
    this.md = md;
    this.makeRenderables();

    return this.preferences.compileTarget.compile(this.renderables);
  }
}
