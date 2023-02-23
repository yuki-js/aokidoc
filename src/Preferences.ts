import { JSONSchemaType } from "ajv";
import { CompileTarget } from "./targets/CompileTarget";

export interface Preferences {
  language?: string;
  locale?: string;
  // we use any because we don't know what the frontmatter schema is at the time
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  frontmatterSchema?: JSONSchemaType<any>;
  compileTarget: CompileTarget;
  // use any to only suggest the root type is Record, no matter what the inside is
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  variables?: Record<string, any>;
}
export const defaultPreferences: Partial<Preferences> = {
  language: "ja",
  locale: "ja-JP",
  variables: {},
};
