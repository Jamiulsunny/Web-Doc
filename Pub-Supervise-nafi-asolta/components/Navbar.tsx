import Link from "next/link";
import { getUser } from "@/lib/auth";
import { ROLE_COLOR, ROLE_LABEL, navLinks, primaryRole } from "@/lib/roles";
import LogoutButton from "./LogoutButton";
import NotificationBell from "./NotificationBell";
import NavLinks from "./NavLinks";
export default async function Navbar() {
  const u = await getUser();
  const roles = (u?.roles || []) as string[];
  const color = ROLE_COLOR[primaryRole(roles)];
  const initials = (u?.name || "").split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  return (
    <header className="nav" style={u ? { borderTop: `4px solid ${color}` } : undefined}>
      <Link href="/" className="brand"><img src="/logo.png" alt="PUB logo" /><span>PubSupervise<small>Pundra University of Science &amp; Technology</small></span></Link>
      {u && <NavLinks links={navLinks(roles)} color={color} />}
      <div className="navright">
        <Link className="navlink" href="/journal">Journal</Link>
        {u ? (<>
          <NotificationBell />
          <div className="userchip"><span className="avatar" style={{ background: color }}>{initials}</span>
            <div><b>{u.name}</b><div>{roles.map((r) => <span key={r} className="rolebadge" style={{ background: ROLE_COLOR[r] }}>{ROLE_LABEL[r]}</span>)}</div></div></div>
          <Link className="btn ghost sm" href="/account/password">Password</Link><LogoutButton />
        </>) : (<><Link className="btn ghost sm" href="/login">Log in</Link><Link className="btn sm" href="/register">Student sign up</Link></>)}
      </div>
    </header>
  );
}
