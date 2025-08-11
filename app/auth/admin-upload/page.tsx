import { createClient } from "@/db/dbServer";
import AdminUpload from "./uploadPage";


const ADMIN_ID = process.env.ADMIN_ID;

export default async function Page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.id !== ADMIN_ID) {
    return <div className="text-red-500 w-full h-[85vh] flex items-center justify-center text-7xl animate-pulse">ACCESS DENIED</div>;
  }

  return <AdminUpload />;
}
