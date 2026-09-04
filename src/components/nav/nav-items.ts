import { Map, Car, PlusCircle, Tag, User } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const navItems: NavItem[] = [
  { href: "/", label: "Mapa", icon: Map },
  { href: "/garage", label: "Garage", icon: Car },
  { href: "/create", label: "Crear", icon: PlusCircle },
  { href: "/classifieds", label: "Clasificados", icon: Tag },
  { href: "/profile", label: "Perfil", icon: User },
];
