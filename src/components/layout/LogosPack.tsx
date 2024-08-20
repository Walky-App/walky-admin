export const LogosPack = (logoType: string) => {
  // const currentURL = window.location.href
  // const isHydropallet = currentURL.toLowerCase().includes('hydropallet')
  const isHydropallet = false

  switch (logoType) {
    case 'sidebar':
      return isHydropallet ? (
        <img src="/assets/logos/hydropallet-white-logo.png" className="h-8 w-auto" alt="Hydropallet Logo" />
      ) : (
        <img src="/assets/logos/Hemp-Temps-logo-horizontal-white.png" className="h-10 w-auto" alt="Hemp Temps Logo" />
      )
    case 'header':
      return isHydropallet ? (
        <img
          src="/assets/logos/hydropallet-black-logo.png"
          alt="Hydro Pallet Logo"
          className="h-7 w-auto md:h-12 lg:hidden xl:hidden"
        />
      ) : (
        <img
          src="/assets/logos/logo-horizontal-cropped.png"
          alt="Hemp Temps Logo"
          className="h-10 w-auto md:h-16 lg:hidden xl:hidden"
        />
      )
    case 'login':
      return isHydropallet ? (
        <img src="/assets/logos/hydropallet-black-logo.png" alt="Hydropallet Logo" className="sm:w-full xl:px-12" />
      ) : (
        <img src="/assets/logos/logo-horizontal-cropped.png" alt="Hemp Temps logo" className="sm:w-full xl:px-12" />
      )

    case 'error':
      return isHydropallet ? (
        <img src="/assets/logos/hydropallet-black-logo.png" alt="Hyrdopallet Logo" className="h-30 mr-2 w-auto" />
      ) : (
        <img src="/assets/logos/logo-horizontal-cropped.png" alt="Hemp-Temps Logo" className="mr-2 h-36 w-auto" />
      )
  }
}
