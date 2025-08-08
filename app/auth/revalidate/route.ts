import { revalidateEverything } from "@/db/warmCache";

export async function GET() {
  revalidateEverything();
  return new Response("ok");
}
