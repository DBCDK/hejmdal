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
          'For at logge ind, skal du godkende, at dine oplysninger bliver videregivet til __SERVICE_CLIENT_NAME__. Du skal kun godkende én gang.',
          'Oplysningerne overføres krypteret, så de ikke kan opfanges af andre.',
          'Hvis du afviser, vil oplysningerne ikke blive overført til __SERVICE_CLIENT_NAME__, og du ikke blive logget ind. ' +
          'Dine oplysninger vil heller ikke blive gemt andre steder. ' +
          'Næste gang du vil logge ind til __SERVICE_CLIENT_NAME__, vil du derfor igen blive bedt om at godkende.'
        ]
      }
    ]
  },
  consentReject: {
    title: 'Godkendelse afvist',
    sections: [
      {
        texts: [
          'Når du afviser, at dine oplysninger overføres til __SERVICE_CLIENT_NAME__, vil oplysningerne ikke blive overført eller gemt andre steder. Du er derfor ikke logget ind',
          'Du kan ikke logge ind uden at godkende, at dine oplysninger bliver overført. ' +
          '__SERVICE_CLIENT_NAME__ bruger oplysningerne til at sikre, at det en den rigtige bruger, der logger ind.',
          'Næste gang du vil logge ind til __SERVICE_CLIENT_NAME__, vil du igen blive bedt om at godkende.',
          'Du vil igen blive bedt om at godkende, næste gang du vil logge ind til __SERVICE_CLIENT_NAME__.'
        ]
      }
    ]
  },
  cookies: {
    title: 'Cookies, formål og relevans',
    sections: [
      {
        texts: ['Vi benytter cookies til at gemme information om dine logins.']
      },
      {
        header: 'Valgte biblioteker',
        texts: ['Vi gemmer information om, hvilke biblioteker, der har været brugt ved login på denne computer, telefon, tablet osv. ' +
        'Det gør vi for at kunne tilbyde dig en liste over tidligere benyttede biblioteker, når du efterfølgende logger ind. ' +
        'Dermed kan vi give dig mulighed for et hurtigere login.']
      },
      {
        header: 'Login',
        texts: ['Vi gemmer information om, at du er logget ind og hvilket bibliotek, du er logget ind ved, således at du ikke skal logge ind mere end én gang. ' +
        'Denne information fjernes, når du enten logger ud eller lukker browseren.']
      },
      {
        header: 'Slå cookies fra i browseren ',
        texts: ['Bibliotekslogin virker ikke uden cookies. Du kan have ændret indstillingerne i din browser, så du ikke accepterer cookies. ' +
        'I så fald vil du få en fejlside, når du forsøger at benytte Bibliotekslogin.']
      },
      {
        texts: ['Alle browsere tillader, at du sletter dine cookies. Hvis du gør det, mens du er logget ind, kan du derfor også opleve fejl på siden.']
      },
      {
        header: 'Cookies hos andre hjemmesider',
        texts: ['Bibliotekslogin benytter ikke andre tjenester, der anvender cookies hos brugeren.']
      },
      {
        header: 'Kontakt',
        texts: ['Har du spørgsmål vedrørende vores anvendelse af cookies og den måde som hjemmesiden forvaltes på, er du velkommen til at kontakte os.']
      }
    ]
  },
  login_borchk: {
    title: 'Hjælp til login',
    sections: [
      {
        header: 'Bibliotek',
        texts: [
          'Feltet Bibliotek er ofte valgt på forhånd, så du ikke kan ændre det. ' +
          'Hvis ikke, skal du finde dit bibliotek ved at søge på bibliotekets navn eller den kommune, biblioteket ligger i. Eller ved at vælge et bibliotek fra listen',
          'Vælg et bibliotek, hvor du er registreret som låner.'
        ]
      },
      {
        header: 'Cpr og lånernummer',
        texts: [
          'Du skal være oprettet som bruger på biblioteket for at kunne logge ind',
          'Du kan skrive dit cpr-nummer eller dit lånernummer i feltet. Dit lånernummer står på det lånerkort, du har fået udleveret på biblioteket, da du blev oprettet.',
          'Hvis du ikke er oprettet som låner, kan du blive det på bibliotekets hjemmeside:',
          '__CREATE_LIBRARY_USER__'
        ]
      },
      {
        header: 'Pinkode',
        texts: [
          'Pinkoden er den 4- eller 5-cifrede kode, som du bruger, når du låner på biblioteket.',
          'Hvis du ikke kan huske din kode, kan du henvende dig på biblioteket.',
          '__FORGOT_CODE_CONTACT_LIBRARY__'
        ]
      }
    ]
  },
  login_nemlogin: {
    title: 'Hjælp til login med NemID',
    sections: [
      {
        header: 'Nem ID',
        texts: [
          'Vælg NemID, hvis du vil logge ind ved hjælp af NemID med brug af dit nøglekort',
          'Du vil blive viderestilet til NemID. Når du er logget ind der, bliver du stillet tilbage til Bibliotekslogin.'
        ]
      }
    ]
  },
  login_unilogin: {
    title: 'Hjælp til login med UNI•Login',
    sections: [
      {
        header: 'UNI•Login',
        texts: [
          'Vælg UNI•Login, hvis du vil logge ind ved hjælp af dit UNI•Login.',
          'Du vil blive viderestilet til UNI•Login. ' +
          'Når du er logget ind der, bliver du stillet tilbage til Bibliotekslogin og vil være logget ind med både Bibliotekslogin og UNI•Login',
          'Du kan herefter bruge andre sider, der benytter Bibliotekslogin eller UNI•Login, uden at skulle logge ind igen.'
        ]
      }
    ]
  },
  login_wayf: {
    title: 'Hjælp til login med WAYF',
    sections: [
      {
        header: 'WAYF',
        texts: [
          'Vælg WAYF, hvis du vil logge ind ved hjælp af WAYF Single Sign-On.',
          'Du vil blive viderestilet til WAYF. ' +
          'Når du er logget ind der, bliver du stillet tilbage til Bibliotekslogin og vil være logget ind med både Bibliotekslogin og WAYF Single Sign-On.',
          'Du kan herefter bruge andre sider, der benytter Bibliotekslogin eller WAYF, uden at skulle logge ind igen.'
        ]
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
 * @returns {mixed}
 */
export function getText(helpNames, placeHolders = false, prefix = '') {
  let helpObj = false;
  Object.keys(helpTexts).forEach((key) => {
    if (helpNames.indexOf(key.replace(prefix, '')) !== -1) {
      if (helpObj) {
        helpObj.sections = helpObj.sections.concat(helpTexts[key].sections);
      }
      else {
        helpObj = Object.assign({}, helpTexts[key]);
      }
    }
  });

  if (placeHolders) {
    let helpstr = JSON.stringify(helpObj);
    if (placeHolders) {
      Object.keys(placeHolders).forEach((key) => {
        helpstr = helpstr.replace(new RegExp(key, 'g'), placeHolders[key]);
      });
    }
    helpObj = JSON.parse(helpstr);
  }
  return helpObj;
}

/**
 * Set replacers for helpTexts if agency is defines. Defaults to empty strings
 *
 * @param agency {object}
 * @returns {mixed}
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


