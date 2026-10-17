import { Memovable, processQuery } from "memovable";

const memovable = Memovable({
  tokensPerOptimizationCall: 2048,
  modelHandler: async ({ query, context }) => {
    return `[LLM Response] Intent: ${query.intent} | Context Items Used: ${context.length}`;
  },
});

const existingContext = [
  {
    role: "user" as const,
    content: "We had an outage yesterday on server-01.",
  },
  { role: "assistant" as const, content: "I logged the incident details." },
  { role: "user" as const, content: "The database configuration was changed." },
];

async function run() {
  const userQuery = "Why did server-01 fail yesterday?";

  const processed = processQuery(userQuery);

  process.stdout.write("\n=== PROCESSED QUERY STRUCTURE ===\n");
  process.stdout.write(JSON.stringify(processed, null, 2) + "\n\n");

  process.stdout.write("=== OPTIMIZE RESULT ===\n");
  const result = await memovable.optimise(userQuery, existingContext);
  process.stdout.write(result + "\n\n");
}

run();
