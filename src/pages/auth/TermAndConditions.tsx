import { useEffect } from 'react'

export const TermsAndConditions = () => {
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://app.termly.io/embed-policy.min.js'
    script.async = true
    document.body.appendChild(script)
  }, [])

  return (
    <div data-id="6954587d-f5fb-4c69-81ce-7831091f07bf" data-type="iframe">
      <a href="https://app.termly.io/policy-viewer/policy.html?policyUUID=6954587d-f5fb-4c69-81ce-7831091f07bf">
        Terms and conditons
      </a>
    </div>
  )
}
