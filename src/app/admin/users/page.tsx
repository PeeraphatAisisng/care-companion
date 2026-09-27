import { requireRole } from "@/lib/auth";
import { adminUpdateUser } from "@/app/actions/admin";
import { Avatar } from "@/components/Avatar";
import type { Profile } from "@/lib/types";

export default async function AdminUsersPage() {
  const { supabase } = await requireRole("admin");
  const { data: users } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="page-wrap py-10">
      <h1 className="text-4xl font-bold">จัดการผู้ใช้</h1>
      <div className="mt-6 grid gap-4">
        {(users as Profile[] | null)?.map((user) => (
          <form key={user.id} action={adminUpdateUser} className="card grid gap-3 p-5 md:grid-cols-[1fr_180px_160px_auto] md:items-center">
            <input type="hidden" name="id" value={user.id} />
            <div className="flex items-center gap-3">
              <Avatar name={user.full_name} src={user.avatar_url} />
              <div>
                <p className="font-bold">{user.full_name}</p>
                <p className="text-sm text-muted">{user.phone || "ไม่มีเบอร์โทร"}</p>
              </div>
            </div>
            <select name="role" className="select" defaultValue={user.role ?? "customer"}>
              <option value="customer">Customer</option>
              <option value="companion">Companion</option>
              <option value="admin">Admin</option>
            </select>
            <select name="is_active" className="select" defaultValue={String(user.is_active)}>
              <option value="true">ใช้งานได้</option>
              <option value="false">ระงับบัญชี</option>
            </select>
            <button className="btn btn-primary">บันทึก</button>
          </form>
        ))}
      </div>
    </div>
  );
}
