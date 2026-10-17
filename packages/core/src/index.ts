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

export class MemovableEngine {
  private config: MemovableConfig;

  constructor(config: MemovableConfig = {}) {
    this.config = config;
  }

  public async optimise(
    userQuery: string,
    existingContext: ContextItem[] = [],
  ): Promise<string> {
    const processed = processQuery(userQuery);

    const filteredContext = this.filterContext(processed, existingContext);

    if (this.config.modelHandler) {
      return await this.config.modelHandler({
        query: processed,
        context: filteredContext,
      });
    }

    return JSON.stringify({
      processedQuery: processed,
      optimizedContext: filteredContext,
    });
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
