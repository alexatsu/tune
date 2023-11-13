import sass from "@/shared/sass/components/Menu.module.scss";

export function Menu() {
  return (
    <svg className={sass.menu} width="71" height="36" viewBox="0 0 71 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="0.5" y="0.5" width="70.5" height="35.5" rx="16" fill="#1D1F20"/>
    <line x1="20" y1="22" x2="52" y2="22" stroke="#515253" stroke-width="2"/>
    <line x1="20" y1="14" x2="52" y2="14" stroke="#515253" stroke-width="2"/>
    </svg>
    
  );
}
