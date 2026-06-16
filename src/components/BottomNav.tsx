import type { ReactNode } from "react";

export type TabId = "start" | "logboek" | "instellingen";

type NavItem = {
  id: TabId;
  label: string;
  icon: ReactNode;
};

const items: NavItem[] = [
  { id: "start", label: "Start", icon: "S" },
  { id: "logboek", label: "Logboek", icon: "L" },
  { id: "instellingen", label: "Instellingen", icon: "I" }
];

type BottomNavProps = {
  activeTab: TabId;
  onChange: (tab: TabId) => void;
};

export function BottomNav({ activeTab, onChange }: BottomNavProps) {
  return (
    <nav className="bottom-nav" aria-label="Hoofdnavigatie">
      {items.map((item) => (
        <button
          className={activeTab === item.id ? "nav-button is-active" : "nav-button"}
          key={item.id}
          type="button"
          onClick={() => onChange(item.id)}
        >
          <span aria-hidden="true">{item.icon}</span>
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
