/**
 * Template for unilogin link.
 *
 */

export default (token) => `
<a href="/login/identityProviderCallback/unilogin/${token}?id=nemtestuser">UNI-login</a>
`;
