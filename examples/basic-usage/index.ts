import { Memovable, ContextItem } from "memovable";

const memovable = Memovable({
  tokensPerOptimizationCall: 2048,
  modelHandler: async ({ query, context }) => {
    return `[LLM Output] Processed intent "${query.intent}" using ${context.length} context items.`;
  },
});

const existingContext: ContextItem[] = [
  { role: "user", content: "We had an outage yesterday on server-01." },
  { role: "assistant", content: "I logged the incident details." },
  { role: "user", content: "The database configuration was changed." },
] as const;

async function run() {
  const response = await memovable.optimise(
    "Why did server-01 fail yesterday?",
    existingContext,
  );
  const runtimeConsole = (
    globalThis as {
      console?: { log(value: unknown): void };
    }
  ).console;
  runtimeConsole?.log(response);
}

run();
