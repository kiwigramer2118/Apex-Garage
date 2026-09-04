import { Map, Car, PlusCircle, Tag, User } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const navItems: NavItem[] = [
  { href: "/", label: "Map", icon: Map },
  { href: "/garage", label: "Garage", icon: Car },
  { href: "/create", label: "Create", icon: PlusCircle },
  { href: "/classifieds", label: "Classifieds", icon: Tag },
  { href: "/profile", label: "Profile", icon: User },
];
