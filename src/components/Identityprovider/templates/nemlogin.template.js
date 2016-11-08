/**
 * Template for nemlogin link.
 *
 */

export default (version, token) => `
<a href="${version}/login/identityProviderCallback/nemlogin/${token}?eduPersonTargetedID=WAYF-DK-16028a572f83fd83cb0728aab8a6cc0685933a04">NEM-login</a>
`;
