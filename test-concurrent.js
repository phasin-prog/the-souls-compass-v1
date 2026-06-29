const { createClient } = require("@supabase/supabase-js");

const url = "https://lmxubdkjbcnsiqvfmwnb.supabase.co";
const anonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxteHViZGtqYmNuc2lxdmZtd25iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3NTQ0NzMsImV4cCI6MjA5NjMzMDQ3M30.LoAshwx4P9PPRO7uNIqFR3YjyM-WJ9qIIM-ldAYHtQo";

console.log("Initializing client...");
const sb = createClient(url, anonKey, { auth: { persistSession: false } });

async function runQuery(id) {
  const start = Date.now();
  try {
    const { data, error } = await sb.from("entries").select("*").eq("status", "published");
    console.log(`Query ${id} completed in ${Date.now() - start}ms: success=${!error}`);
  } catch (err) {
    console.error(`Query ${id} failed in ${Date.now() - start}ms:`, err.message || err);
  }
}

async function main() {
  const promises = [];
  for (let i = 0; i < 30; i++) {
    promises.push(runQuery(i));
  }
  await Promise.all(promises);
  console.log("All concurrent queries finished!");
}

main();
