import { processQuery, ProcessedQuery } from "./queryProcessor.js";

export * from "./queryProcessor.js";

export interface ContextItem {
  role: "system" | "user" | "assistant";
  content: string;
  metadata?: Record<string, unknown>;
}

export interface MemovableConfig {
  tokensPerOptimizationCall?: number;
  maxContextTokens?: number;
  modelHandler?: (payload: {
    query: ProcessedQuery;
    context: ContextItem[];
  }) => Promise<string>;
}

export interface OptimiseResult {
  response: string;
  context: ContextItem[];
  query: ProcessedQuery;
}

export class MemovableEngine {
  private config: MemovableConfig;

  constructor(config: MemovableConfig = {}) {
    this.config = config;
  }

  public async optimise(
    userQuery: string,
    existingContext: ContextItem[] = [],
  ): Promise<OptimiseResult> {
    const processed = processQuery(userQuery);
    const filteredContext = this.filterContext(processed, existingContext);

    let responseText = "";
    if (this.config.modelHandler) {
      responseText = await this.config.modelHandler({
        query: processed,
        context: filteredContext,
      });
    }

    return {
      response: responseText,
      context: filteredContext,
      query: processed,
    };
  }

  private filterContext(
    processed: ProcessedQuery,
    context: ContextItem[],
  ): ContextItem[] {
    if (!processed.requiresPreviousContext && processed.keywords.length > 0) {
      return context.filter((item) => {
        const text = item.content.toLowerCase();
        return processed.keywords.some((kw) => text.includes(kw));
      });
    }
    return context;
  }
}

export function Memovable(config: MemovableConfig = {}): MemovableEngine {
  return new MemovableEngine(config);
}
