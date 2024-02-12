export default function NewPasswordForm() {
 

  return (
    <main className="">
        <img
          src="https://images.unsplash.com/photo-1545972154-9bb223aac798?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=3050&q=80&exp=8&con=-15&sat=-75"
          alt=""
          className="absolute inset-0 -z-10 h-full w-full object-cover object-top"
        />
        <div className="flex justify-center">
          <img src="/assets/logos/logo-horizontal-cropped.png" alt="hemp temps logo" height={100} className="w-200" />
        </div>
        <div className="mx-auto max-w-7xl px-6 py-32 text-center sm:py-40 lg:px-8">
          <p className="text-base font-semibold leading-8 text-white">Success</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-5xl">Your password was reset</h1>
          <p className="mt-4 text-base text-white/70 sm:mt-6">Keep your password secure 🔒</p>
          <div className="mt-10 flex justify-center">
            <a href="/login" className="text-sm font-semibold leading-7 text-white">
              <span aria-hidden="true">&larr;</span> Back to login
            </a>
          </div>
        </div>
      </main>
  )
}
