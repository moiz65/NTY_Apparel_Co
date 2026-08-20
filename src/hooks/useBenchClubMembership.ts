import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Returns whether the currently logged-in user is an approved Bench Club member.
 * Membership = a row exists in `bench_club_members` matching the user's id or email.
 */
export const useBenchClubMembership = () => {
  const [isMember, setIsMember] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const check = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        if (!cancelled) {
          setIsMember(false);
          setLoading(false);
        }
        return;
      }
      const email = (user.email ?? "").toLowerCase();
      const { data, error } = await supabase
        .from("bench_club_members")
        .select("id")
        .or(`user_id.eq.${user.id},email.eq.${email}`)
        .limit(1);
      if (!cancelled) {
        setIsMember(!error && !!data && data.length > 0);
        setLoading(false);
      }
    };

    check();
    const { data: sub } = supabase.auth.onAuthStateChange(() => check());
    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  return { isMember, loading };
};
