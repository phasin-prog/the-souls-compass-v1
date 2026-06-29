const { createClient } = require("@supabase/supabase-js");

const url = "https://lmxubdkjbcnsiqvfmwnb.supabase.co";
const anonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxteHViZGtqYmNuc2lxdmZtd25iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3NTQ0NzMsImV4cCI6MjA5NjMzMDQ3M30.LoAshwx4P9PPRO7uNIqFR3YjyM-WJ9qIIM-ldAYHtQo";

console.log("Initializing Supabase client...");
const sb = createClient(url, anonKey, { auth: { persistSession: false } });

console.log("Sending query to Supabase entries table...");
sb.from("entries")
  .select("*")
  .eq("status", "published")
  .then(({ data, error }) => {
    if (error) {
      console.error("Query Error:", error);
    } else {
      console.log("Query Success:", data);
    }
    process.exit(0);
  })
  .catch(err => {
    console.error("Fetch Exception:", err);
    process.exit(1);
  });
