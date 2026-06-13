import prisma from "../src/lib/db";
import { KnowledgeType, KnowledgeStatus, BlockType } from "../src/generated/prisma/client";
import { v4 as uuidv4 } from "uuid";

const CATEGORIES = [
  { name: "Helix Internet", description: "Internet connection, routers, modems", color: "#F97316" },
  { name: "Helix TV", description: "TV terminals, remote controls, error codes", color: "#3B82F6" },
  { name: "Mobile Network", description: "5G, LTE, SIM cards, Fizz", color: "#10B981" },
  { name: "Home Phone", description: "Landline issues, voicemail", color: "#8B5CF6" },
  { name: "Billing & Accounts", description: "Invoices, Customer Space, E-Space", color: "#EF4444" },
];

const TAGS = [
  { name: "Wi-Fi 6", color: "#F97316" },
  { name: "5G", color: "#3B82F6" },
  { name: "LTE", color: "#10B981" },
  { name: "E-Sim", color: "#8B5CF6" },
  { name: "Outage", color: "#EF4444" },
  { name: "Installation", color: "#6B7280" },
  { name: "Fizz", color: "#14B8A6" },
  { name: "Helix Fi", color: "#F59E0B" },
  { name: "Router", color: "#6366F1" },
  { name: "Modem", color: "#EC4899" },
  { name: "Terminal", color: "#84CC16" },
  { name: "Invoice", color: "#14B8A6" },
  { name: "Error Code", color: "#F43F5E" },
  { name: "Customer Space", color: "#0EA5E9" },
  { name: "Porting", color: "#A855F7" },
];

// Generator Arrays
const LOCATIONS = ["Montreal", "Quebec City", "Laval", "Gatineau", "Longueuil", "Sherbrooke", "Trois-Rivieres", "Saguenay", "Levis", "Terrebonne"];
const TV_ERROR_CODES = ["XRE-03059", "RDK-03004", "RDK-03036", "XRE-00021", "XRE-10007", "APPS-04036"];
const INTERNET_ISSUES = ["Slow connection speeds", "Intermittent drops", "No connection", "Wi-Fi not reaching basement", "Flashing orange light", "Solid red light"];
const MOBILE_ISSUES = ["Cannot send SMS", "No 5G signal", "Calls dropping", "E-Sim activation failed", "Data not working", "Voicemail not setting up"];
const DEVICES = ["Helix Fi 2 Gateway", "Helix TV Terminal", "iPhone 15 Pro", "Samsung Galaxy S24", "Google Pixel 8", "Arris Modem"];

function getRandomItem(arr: any[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomSubset(arr: any[], count: number) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function generateEntry(authorId: string | null, categoryIds: string[], tagIds: string[], index: number) {
  const typeRoll = Math.random();
  let type: KnowledgeType = "INCIDENT";
  if (typeRoll > 0.7) type = "DOCUMENTATION";
  else if (typeRoll > 0.9) type = "NOTE";

  let categoryId = getRandomItem(categoryIds);
  let title = "";
  let summary = "";
  let blocks: any[] = [];
  const tags = getRandomSubset(tagIds, Math.floor(Math.random() * 3) + 1);

  // Determine scenario based on random assignment (we can use index to ensure variety)
  const scenario = index % 4;

  if (scenario === 0) {
    // Helix Internet Scenario
    const issue = getRandomItem(INTERNET_ISSUES);
    const location = getRandomItem(LOCATIONS);
    const device = getRandomItem(["Helix Fi 2 Gateway", "Helix Fi 1 Gateway", "Classic Modem"]);
    title = `Internet: ${issue} on ${device} in ${location}`;
    summary = `Customer reported ${issue.toLowerCase()} when using ${device}. Region affected: ${location}.`;
    
    blocks = [
      { type: "HEADING", order: 0, content: "Symptoms" },
      { type: "PARAGRAPH", order: 1, content: `User states that they have been experiencing ${issue.toLowerCase()} since this morning. The ${device} indicator lights confirm the issue.` },
      { type: "HEADING", order: 2, content: "Troubleshooting Steps" },
      { type: "STEP", order: 3, content: "Check the internal outage map for " + location + "." },
      { type: "STEP", order: 4, content: "Ask customer to unplug the " + device + " for 30 seconds." },
      { type: "STEP", order: 5, content: "Use the Helix Fi diagnostic tool to test signal strength to the node." },
      { type: "PARAGRAPH", order: 6, content: "If the issue persists, escalate to Level 2 network support." }
    ];
  } else if (scenario === 1) {
    // Helix TV Scenario
    const errorCode = getRandomItem(TV_ERROR_CODES);
    title = `Helix TV: Error ${errorCode} on boot`;
    summary = `Standard resolution steps for Helix TV Terminal displaying error ${errorCode}.`;
    
    blocks = [
      { type: "HEADING", order: 0, content: "Error Description" },
      { type: "PARAGRAPH", order: 1, content: `Error ${errorCode} typically indicates a communication failure between the Helix TV Terminal and the Helix Fi Gateway.` },
      { type: "HEADING", order: 2, content: "Resolution" },
      { type: "STEP", order: 3, content: "Verify that the Helix Fi Gateway is online and broadcasting Wi-Fi." },
      { type: "STEP", order: 4, content: "Restart the TV Terminal using the voice remote by saying 'Restart'." },
      { type: "STEP", order: 5, content: "If voice doesn't work, unplug the power cord from the TV Terminal for 10 seconds, then plug it back in." },
    ];
  } else if (scenario === 2) {
    // Mobile Scenario
    const issue = getRandomItem(MOBILE_ISSUES);
    const device = getRandomItem(["iPhone 15", "Samsung Galaxy S23", "Pixel 8"]);
    title = `Mobile: ${issue} on ${device}`;
    summary = `Troubleshooting steps for ${device} users experiencing: ${issue.toLowerCase()}.`;
    
    blocks = [
      { type: "HEADING", order: 0, content: "Issue Verification" },
      { type: "PARAGRAPH", order: 1, content: `Before troubleshooting ${issue.toLowerCase()} on a ${device}, verify that the customer's account is in good standing and the line is active.` },
      { type: "HEADING", order: 2, content: "Steps" },
      { type: "STEP", order: 3, content: "Go to Settings > Network and toggle Airplane Mode on and off." },
      { type: "STEP", order: 4, content: "Check if the SIM or E-Sim is properly provisioned in the billing portal." },
      { type: "STEP", order: 5, content: "Reset network settings on the " + device + "." },
    ];
  } else {
    // Billing / General Scenario
    title = `Billing: Customer Space login issues in ${getRandomItem(LOCATIONS)}`;
    summary = "User is unable to log into the Videotron Customer Space to view their invoice.";
    
    blocks = [
      { type: "HEADING", order: 0, content: "Context" },
      { type: "PARAGRAPH", order: 1, content: "Customer receives 'Invalid Credentials' error when trying to access the portal." },
      { type: "HEADING", order: 2, content: "Action Plan" },
      { type: "STEP", order: 3, content: "Send a password reset link to the email on file." },
      { type: "STEP", order: 4, content: "If the email is no longer accessible, verify identity using the 4-digit PIN." },
      { type: "STEP", order: 5, content: "Update the contact email and trigger a manual sync in the CRM." },
    ];
  }

  // Add random variance to title to ensure uniqueness
  title = `${title} (#${uuidv4().substring(0, 6)})`;

  return {
    title,
    slug: uuidv4(),
    summary,
    type,
    status: "PUBLISHED" as KnowledgeStatus,
    categoryId,
    authorId,
    blocks,
    tags
  };
}

async function main() {
  console.log("Starting Videotron Knowledge Base Seed...");

  // 1. Get an author
  const user = await prisma.user.findFirst();
  const authorId = user ? user.id : null;
  if (!authorId) {
    console.warn("No users found in database. Entries will be created without an author.");
  } else {
    console.log(`Using author: ${user?.email || authorId}`);
  }

  // 2. Initialize Categories
  console.log("Creating Categories...");
  const categoryIds: string[] = [];
  for (const cat of CATEGORIES) {
    const created = await prisma.category.upsert({
      where: { name: cat.name },
      update: {},
      create: {
        name: cat.name,
        description: cat.description,
        color: cat.color,
      }
    });
    categoryIds.push(created.id);
  }

  // 3. Initialize Tags
  console.log("Creating Tags...");
  const tagIds: string[] = [];
  for (const tag of TAGS) {
    const created = await prisma.tag.upsert({
      where: { name: tag.name },
      update: {},
      create: {
        name: tag.name,
        color: tag.color,
      }
    });
    tagIds.push(created.id);
  }

  // 4. Generate 500 entries
  console.log("Generating and inserting 500 entries (this may take a minute)...");
  
  let successCount = 0;
  for (let i = 0; i < 500; i++) {
    const entryData = generateEntry(authorId, categoryIds, tagIds, i);
    
    try {
      await prisma.knowledge.create({
        data: {
          title: entryData.title,
          slug: entryData.slug,
          summary: entryData.summary,
          type: entryData.type,
          status: entryData.status,
          categoryId: entryData.categoryId,
          authorId: entryData.authorId,
          blocks: {
            create: entryData.blocks.map(b => ({
              type: b.type,
              order: b.order,
              content: b.content
            }))
          },
          tags: {
            create: entryData.tags.map(tagId => ({
              tag: { connect: { id: tagId } }
            }))
          }
        }
      });
      successCount++;
      if (successCount % 50 === 0) {
        console.log(`Inserted ${successCount}/500 entries...`);
      }
    } catch (e) {
      console.error(`Failed to insert entry ${i}:`, e);
    }
  }

  console.log(`\n✅ Seeding complete! Successfully inserted ${successCount} Videotron entries.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
