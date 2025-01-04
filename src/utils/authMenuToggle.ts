const menuToggle = () => {
  const sidebar = document.getElementById("sidebar") as HTMLElement;
  const sidebarBackdrop = document.getElementById(
    "sidebar-backdrop"
  ) as HTMLElement;

  sidebar.classList.toggle("-translate-x-full");
  sidebarBackdrop.classList.toggle("hidden");
};

export default menuToggle;
