/**
 * Parameter types for actions
 */
export type ParameterType =
  | "string"
  | "number"
  | "boolean"
  | "object"
  | "array";

/**
 * Action parameter definition
 */
export interface ActionParameter {
  /** Parameter type */
  type: ParameterType;
  /** Description of the parameter */
  description?: string;
  /** Whether the parameter is required */
  required?: boolean;
  /** Default value */
  default?: unknown;
  /** Enum values for string type */
  enum?: string[];
  /** Properties for object type */
  properties?: Record<string, ActionParameter>;
  /** Items schema for array type */
  items?: ActionParameter;
}

/**
 * Action definition
 */
export interface ActionDefinition<TParams = Record<string, unknown>> {
  /** Unique name for the action */
  name: string;
  /** Description of what the action does */
  description: string;
  /** Parameter definitions */
  parameters?: Record<string, ActionParameter>;
  /** Handler function */
  handler: (params: TParams) => unknown | Promise<unknown>;
  /** Optional render function for UI */
  render?: (props: ActionRenderProps<TParams>) => unknown;
}

/**
 * Props passed to action render function
 */
export interface ActionRenderProps<TParams = Record<string, unknown>> {
  /** Current status */
  status: "pending" | "executing" | "completed" | "error";
  /** Arguments passed to the action */
  args: TParams;
  /** Result if completed */
  result?: unknown;
  /** Error if failed */
  error?: string;
}

/**
 * Convert action definition to OpenAI tool format
 */
export function actionToTool(action: ActionDefinition): object {
  const properties: Record<string, object> = {};
  const required: string[] = [];

  if (action.parameters) {
    for (const [name, param] of Object.entries(action.parameters)) {
      properties[name] = parameterToJsonSchema(param);
      if (param.required) {
        required.push(name);
      }
    }
  }

  return {
    type: "function",
    function: {
      name: action.name,
      description: action.description,
      parameters: {
        type: "object",
        properties,
        required: required.length > 0 ? required : undefined,
      },
    },
  };
}

/**
 * Convert parameter to JSON Schema format
 */
function parameterToJsonSchema(param: ActionParameter): object {
  const schema: Record<string, unknown> = {
    type: param.type,
  };

  if (param.description) {
    schema.description = param.description;
  }

  if (param.enum) {
    schema.enum = param.enum;
  }

  if (param.default !== undefined) {
    schema.default = param.default;
  }

  if (param.properties) {
    schema.properties = {};
    for (const [name, prop] of Object.entries(param.properties)) {
      (schema.properties as Record<string, object>)[name] =
        parameterToJsonSchema(prop);
    }
  }

  if (param.items) {
    schema.items = parameterToJsonSchema(param.items);
  }

  return schema;
}
