/**
 * @file
 *
 * Contains help texts for modal windows in hejmdal
 */

/**
 *
 * @type {{login: {title: string, content: *[]}}}
 */
const helpTexts = {
  consent: {
    title: 'Hjælp til Godkendelse',
    sections: [
      {
        header: 'Godkendelse',
        texts: [
          'Du kan godkende at give dine oplysninger til __SERVICE_CLIENT_NAME__',
          'Hvis du afviser kan ...'
        ]
      }
    ]
  },
  consentReject: {
    title: 'Godkendelse afvist',
    sections: [
      {
        texts: [
          'Du har afvist at dine oplysninger til __SERVICE_CLIENT_NAME__',
          'Det kan ...'
        ]
      }
    ]
  },
  login_borchk: {
    title: 'Hjælp til login',
    sections: [
      {
        header: 'Valg af bibliotek',
        texts: ['Find dit bibliotek ved at søge på bibliotekets navn eller den kommune, biblioteket ligger i. Eller vælg bibliotek fra listen']
      },
      {
        header: 'Cpr og lånernummer',
        texts: [
          'Du skal være oprettet som bruger på biblioteket for at kunne logge ind',
          'Du kan bruge dit cpr-nummer eller dit lånernummer. Dit lånernummer står på det lånerkort, du har fået udleveret på biblioteket, da du blev oprettet.',
          '__CREATE_LIBRARY_USER__'
        ]
      },
      {
        header: 'Pinkode',
        texts: [
          'Pinkoden er den 4- eller 5-cifrede kode, som du bruger, når du skal låne eller reservere på biblioteket.',
          'Hvis du ikke kan huske din kode, kan du henvende dig på biblioteket.',
          '__FORGOT_CODE_CONTACT_LIBRARY__'
        ]
      }
    ]
  },
  login_nemlogin: {
    title: 'Hjælp til login',
    sections: [
      {
        header: 'Nem ID',
        texts: ['Hvis du vil logge ind med det Nem ID med brug af dit nøglekort']
      }
    ]
  },
  login_unilogin: {
    title: 'Hjælp til login',
    sections: [
      {
        header: 'UNI Login',
        texts: ['Hvis du vil logge ind med UNI login']
      }
    ]
  },
  login_wayf: {
    title: 'Hjælp til login',
    sections: [
      {
        header: 'WAYF',
        texts: ['Hvis du vil logge ind med WAYF']
      }
    ]
  },
  default: {
    title: 'Cannot find helptext ',
    sections: []
  }
};

/**
 * Creates the help text object from a list of keys (helpNames)
 *
 * Note that the help object is build using the sequence in helpTexts and not in helpNames
 *
 * @param helpNames {Array}
 * @param placeHolders {Array}
 * @param prefix {string}
 * @returns {boolean}
 */
export function getHelpText(helpNames, placeHolders = false, prefix = '') {
  let helpObj = false;
  Object.keys(helpTexts).forEach((key) => {
    if (helpNames.indexOf(key.replace(prefix, '')) !== -1) {
      if (helpObj) {
        helpObj.sections = helpObj.sections.concat(helpTexts[key].sections);
      } else {
        helpObj = Object.assign({}, helpTexts[key]);
      }
    }
  });

  if (placeHolders) {
    let helpstr = JSON.stringify(helpObj);
    if (placeHolders) {
      Object.keys(placeHolders).forEach((key) => {
        helpstr = helpstr.replace(key, placeHolders[key]);
      });
    }
    helpObj = JSON.parse(helpstr);
  }
  return helpObj;
}

/**
 * Set replacers for helpTexts if agency is defines. Defaults to empty strings
 *
 * @param agency
 * @returns {{__CREATE_LIBRARY_USER__: string, __FORGOT_CODE_CONTACT_LIBRARY__: string}}
 */
export function setLoginReplacersFromAgency(agency) {
  const loginHelpReplacers = {
    __CREATE_LIBRARY_USER__: '',
    __FORGOT_CODE_CONTACT_LIBRARY__: ''
  };
  if (agency) {
    if (agency.registrationFormUrl) {
      loginHelpReplacers.__CREATE_LIBRARY_USER__ =
        '<a href=\\"' + agency.registrationFormUrl + '\\">'
        + (agency.registrationFormUrlText ? agency.registrationFormUrlText : 'opret bruger på biblioteket')
        + '</a>';
    }
    if (agency.branchEmail) {
      loginHelpReplacers.__FORGOT_CODE_CONTACT_LIBRARY__ = '<a href=\\"mailto:' + escape(agency.branchEmail) + '\\">Kontakt biblioteket</a>';
    }
  }
  return loginHelpReplacers;
}


