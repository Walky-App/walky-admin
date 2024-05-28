import { Helmet } from 'react-helmet'

export const TermsAndConditions = () => {
  return (
    <div>
      <Helmet>
        <script type="text/javascript" src="https://app.termly.io/embed-policy.min.js" />
      </Helmet>
      {/* @ts-ignore */}
      <div data-id="6954587d-f5fb-4c69-81ce-7831091f07bf" data-type="iframe" name="termly-embed" />
    </div>
  )
}
