import { Menu } from "@/types/menu";


const menuData: Menu[] = [
  {
    id: 1,
    title: "About us",
    newTab: false,
    path: "/aboutus",
  }

];

export  {menuData};

const menuDataJobSeeker: Menu[] = [
  {
    id: 1,
    title: "For Job Seekers",
    newTab: false,
    path: "/",
  },
  {
    id: 2,
    title: "For Employers",
    newTab: false,
    path: "/employerhome",
  },
  {
    id: 2.1,
    title: "Browse Jobs",
    newTab: false,
    path: "/browsejobs",
  }

];

export default menuDataJobSeeker;
