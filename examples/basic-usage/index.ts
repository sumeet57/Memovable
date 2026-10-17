import { Memovable, createGeminiHandler } from "memovable";

const geminiHandler = createGeminiHandler({
  apiKey: process.env.GEMINI_API_KEY ?? "",
  model: "gemini-3.5-flash",
});

const memovable = Memovable({
  tokensPerOptimizationCall: 2048,
  modelHandler: geminiHandler,
});

const existingContext = [
  {
    role: "user" as const,
    content:
      "Our Auth service crashed around 10:00 AM due to OOM kill on instance auth-prod-01.",
  },
  {
    role: "assistant" as const,
    content:
      "Understood. Auth service OOM incident logged for instance auth-prod-01 at 10:00 AM.",
  },
  {
    role: "user" as const,
    content: "We deployed v2.4.1 of the Payment gateway service at 10:15 AM.",
  },
  {
    role: "assistant" as const,
    content: "Payment gateway deployment v2.4.1 recorded.",
  },
  {
    role: "user" as const,
    content: "Who updated the IAM roles for the database cluster last night?",
  },

  {
    role: "assistant" as const,
    content:
      "DevOps engineer Alex updated the DB IAM policies at 11:30 PM yesterday.",
  },
  {
    role: "user" as const,
    content:
      "The Redis caching layer went down at 11:00 AM due to connection pool exhaustion.",
  },
  {
    role: "assistant" as const,
    content:
      "Logged Redis cache incident: connection pool exhaustion at 11:00 AM.",
  },
  {
    role: "user" as const,
    content:
      "We decided to roll back the Payment gateway service to v2.4.0 due to high error rates.",
  },
  {
    role: "assistant" as const,
    content: "Payment gateway rollback decision logged.",
  },
];

async function runScenario(queryText: string) {
  process.stdout.write(`\n========================================\n`);
  process.stdout.write(`USER QUERY: "${queryText}"\n`);
  process.stdout.write(`========================================\n`);

  const result = await memovable.optimise(queryText, existingContext);

  process.stdout.write("\n--- TOKEN METRICS ---\n");
  process.stdout.write(JSON.stringify(result.tokens, null, 2) + "\n");

  process.stdout.write("\n--- OPTIMIZED CONTEXT FILTERED ---\n");
  process.stdout.write(JSON.stringify(result.context, null, 2) + "\n");

  process.stdout.write("\n--- MODEL RESPONSE ---\n");
  process.stdout.write(result.response + "\n\n");
}

async function execute() {
  // Scenario 1: Incident & Root Cause Analysis
  //   await runScenario("Why did the Auth service crash earlier?");

  // Scenario 2: Identity & Permissions Query
  //   await runScenario("Who changed the database permissions yesterday?");

  // Scenario 3: Decision & Architectural Changes
  //   await runScenario("What decision was made regarding the payment gateway?");

  // Scenario 4: Performance & Infrastructure Outage
  await runScenario("What happened with the Redis cache instance?");
  // Scenario 5: Multi-topic Follow-up / Ambiguous Query
  //   await runScenario("Tell me about the deployments done today.");
}

execute();
