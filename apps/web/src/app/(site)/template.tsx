/** Re-mounts on every navigation so each page fades in smoothly (opacity only, so fixed elements are unaffected). */
export default function SiteTemplate({ children }: { children: React.ReactNode }) {
  return <div className="animate-fade-in">{children}</div>;
}
