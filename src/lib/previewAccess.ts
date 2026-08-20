export type PreviewMode = "customer" | "admin";

export const PREVIEW_CUSTOMER = {
  userId: "00000000-0000-0000-0000-000000000001",
  email: "preview@ntyapparel.com",
  displayName: "Preview Customer",
};

export const isPreviewBypassEnabled = () => import.meta.env.DEV;

export const getPreviewModeFromSearch = (search: string): PreviewMode | null => {
  if (!isPreviewBypassEnabled()) return null;

  const preview = new URLSearchParams(search).get("preview");

  if (preview === "customer" || preview === "admin") {
    return preview;
  }

  return null;
};