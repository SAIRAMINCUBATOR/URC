// ===== SHARED SUPABASE CONFIG =====
// The anon key is safe to expose publicly - access is enforced by Row-Level Security (RLS)
const SUPABASE_URL = "https://ywlpwdruvnaajhmassaz.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl3bHB3ZHJ1dm5hYWpobWFzc2F6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM2NTQ2ODMsImV4cCI6MjA5OTIzMDY4M30.XOiCTftxOfY3uzNRTwKAdOkDyoGx11slLG6eQ_n0efc";

const portalClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Redirects to login if not authenticated. Returns the session if authenticated.
async function requireAuth() {
  const { data: { session } } = await portalClient.auth.getSession();
  if (!session) {
    window.location.href = "login.html";
    return null;
  }
  return session;
}

async function signOut() {
  await portalClient.auth.signOut();
  window.location.href = "login.html";
}

function showToast(message, isError = false) {
  let toast = document.getElementById("portal-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "portal-toast";
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.className = "toast" + (isError ? " error" : "") + " show";
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove("show"), 3500);
}
