export const LogosPack = (logoType: string) => {
  switch (logoType) {
    case 'sidebar':
      return <img src="/assets/logos/walky-logo.png" className="h-10 w-auto" alt="Walky Logo" />
    case 'header':
      return (
        <img src="/assets/logos/walky-logo.png" alt="Walky Logo" className="h-10 w-auto md:h-16 lg:hidden xl:hidden" />
      )

    case 'login':
      return <img src="/assets/logos/walky-logo.png" alt="Walky Logo" className="sm:w-full xl:px-12" />

    case 'error':
      return <img src="/assets/logos/walky-logo.png" alt="Hemp-Temps Logo" className="mr-2 h-36 w-auto" />
  }
}
