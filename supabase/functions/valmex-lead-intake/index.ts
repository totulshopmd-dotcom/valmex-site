import { createClient } from "npm:@supabase/supabase-js@2";

const allowedOrigins = new Set(["https://valmex.md", "https://www.valmex.md"]);
function envValue(name: string): string {
  const raw = Deno.env.get(name);
  if (!raw) throw new Error("Lipsește configurația " + name + ".");
  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed.default === "string" && parsed.default) return parsed.default;
  } catch { /* acceptă și valoarea simplă */ }
  return raw;
}
const cors = (origin: string | null) => ({
  "Access-Control-Allow-Origin": origin && allowedOrigins.has(origin) ? origin : "https://valmex.md",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Vary": "Origin"
});
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const admin = createClient(supabaseUrl, envValue("SUPABASE_SECRET_KEYS"), {
  auth: { persistSession: false, autoRefreshToken: false }
});
const sha256 = async (value: string) => {
  const bytes = new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)));
  return [...bytes].map(x => x.toString(16).padStart(2, "0")).join("");
};

Deno.serve(async (req) => {
  const origin = req.headers.get("origin");
  const headers = { ...cors(origin), "Content-Type": "application/json" };
  const reply = (status: number, data: Record<string, unknown>) =>
    new Response(JSON.stringify(data), { status, headers });

  if (req.method === "OPTIONS") return new Response("ok", { headers });
  if (req.method !== "POST") return reply(405, { error: "Metodă nepermisă." });
  if (origin && !allowedOrigins.has(origin)) return reply(403, { error: "Origine nepermisă." });

  try {
    const contentLength = Number(req.headers.get("content-length") || 0);
    if (contentLength > 12000) return reply(413, { error: "Cererea este prea mare." });
    const body = await req.json();
    const source = String(body.source || "other");
    const allowedSources = new Set(["website_form","roof_calculator","facade_calculator","amk_calculator","contact_form","other"]);
    if (!allowedSources.has(source)) return reply(400, { error: "Sursa solicitării nu este validă." });

    const name = String(body.name || "").trim().slice(0, 120);
    const phoneRaw = String(body.phone || "").trim();
    const phoneDigits = phoneRaw.replace(/\D/g, "");
    const phone = phoneDigits.startsWith("373") && phoneDigits.length === 11
      ? "+" + phoneDigits
      : phoneDigits.startsWith("0") && phoneDigits.length === 9
        ? "+373" + phoneDigits.slice(1)
        : phoneDigits.length === 8 ? "+373" + phoneDigits : "";
    const locality = String(body.locality || "").trim().slice(0, 120) || null;
    const service = String(body.service || "Solicitare VALMEX").trim().slice(0, 180);
    const pageUrl = String(body.page_url || "").slice(0, 500);
    const rawDetails = body.details && typeof body.details === "object" && !Array.isArray(body.details)
      ? body.details : {};
    const details = JSON.stringify(rawDetails).length <= 6000 ? rawDetails : { truncated: true };
    if (!name) return reply(400, { error: "Numele este obligatoriu." });
    if (!phone) return reply(400, { error: "Numărul de telefon nu este valid. Introdu un număr din Republica Moldova." });

    const ip = req.headers.get("cf-connecting-ip") ||
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
    const rateKey = await sha256("lead:" + ip);
    const { data: permitted, error: rateError } = await admin.rpc("consume_chat_rate_limit", {
      p_key_hash: rateKey,
      p_action: "lead_intake",
      p_window_seconds: 60,
      p_max_requests: 12
    });
    if (rateError) throw new Error("Verificarea limitei de solicitări a eșuat.");
    if (permitted !== true) return reply(429, { error: "Au fost trimise prea multe solicitări. Încearcă din nou peste câteva minute." });

    const { data, error } = await admin.from("lead_events").insert({
      source, visitor_name: name, phone, locality, service, page_url: pageUrl,
      details
    }).select("id,created_at").single();
    if (error) throw error;
    return reply(200, { success: true, lead_id: data.id, created_at: data.created_at });
  } catch (error) {
    console.error("VALMEX lead intake error:", error);
    return reply(500, { error: "Solicitarea nu a putut fi înregistrată. Încearcă din nou sau contactează VALMEX telefonic." });
  }
});
