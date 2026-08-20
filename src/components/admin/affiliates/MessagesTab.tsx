import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Mail, MailOpen } from "lucide-react";
import { textStyle } from "./types";

type Msg = {
  id: string;
  from_name: string;
  from_email: string;
  subject: string | null;
  body: string;
  read: boolean;
  created_at: string;
};

export function MessagesTab() {
  const [rows, setRows] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("affiliate_messages")
      .select("*")
      .order("created_at", { ascending: false });
    setRows((data as Msg[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const toggleRead = async (m: Msg) => {
    await supabase.from("affiliate_messages").update({ read: !m.read }).eq("id", m.id);
    load();
  };

  return (
    <div style={textStyle}>
      {loading ? (
        <p className="text-sm text-[hsl(215,16%,47%)]">Loading…</p>
      ) : rows.length === 0 ? (
        <div className="bg-white rounded-lg border border-[hsl(214,32%,91%)] p-12 text-center">
          <p className="text-sm text-[hsl(215,16%,47%)]">Inbox is empty.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {rows.map((m) => (
            <div
              key={m.id}
              className={`bg-white rounded-lg border p-4 ${
                m.read ? "border-[hsl(214,32%,91%)]" : "border-[hsl(211,100%,50%)]"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={`text-sm ${m.read ? "font-normal" : "font-semibold"} text-[hsl(222,47%,11%)]`}>
                      {m.from_name}
                    </p>
                    <span className="text-xs text-[hsl(215,16%,47%)]">&lt;{m.from_email}&gt;</span>
                  </div>
                  {m.subject && (
                    <p className="text-sm font-medium text-[hsl(222,47%,11%)] mt-0.5">{m.subject}</p>
                  )}
                  <p className="text-sm text-[hsl(215,16%,47%)] mt-2 whitespace-pre-wrap">{m.body}</p>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className="text-xs text-[hsl(215,16%,47%)]">
                    {new Date(m.created_at).toLocaleDateString()}
                  </span>
                  <button onClick={() => toggleRead(m)} className="text-[hsl(211,100%,50%)] hover:opacity-70">
                    {m.read ? <Mail className="w-4 h-4" /> : <MailOpen className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
