import regedit from 'regedit';
regedit.setExternalVBSLocation('resources/regedit/vbs');


export function setProxy(proxy) {
  regedit.putValue(
    {
      'HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Internet Settings': {
        ProxyEnable: {
          value: 1,
          type: 'REG_DWORD',
        },
        ProxyOverride: {
          value: process.env.NODE_ENV === 'development' ? 'localhost' : '',
          type: 'REG_SZ',
        },
        ProxyServer: {
          value: proxy,
          type: 'REG_SZ',
        },
      },
    },
    (err) => {
      if (err) throw new Error(`trun on proxy failure - ${err.toString()}`);
    },
  );
}

export function unsetProxy() {
  regedit.putValue(
    {
      'HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Internet Settings': {
        ProxyEnable: {
          value: 0,
          type: 'REG_DWORD',
        },
      },
    },
    (err) => {
      if (err) throw new Error(`trun off proxy failure - ${err.toString()}`);
    },
  );
}

function setIESecurityZones() {
  return new Promise((resolve, reject) => {
    regedit.putValue(
      {
        'HKCU\\SOFTWARE\\Microsoft\\Internet Explorer\\BrowserEmulation': {
          IntranetCompatibilityMode: {
            value: 1,
            type: 'REG_DWORD',
          },
        },
        'HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\\Zones\\1': {
          2500: {
            value: 3,
            type: 'REG_DWORD',
          },
        },
        'HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\\Zones\\2': {
          2500: {
            value: 3,
            type: 'REG_DWORD',
          },
        },
        'HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\\Zones\\3': {
          2500: {
            value: 3,
            type: 'REG_DWORD',
          },
        },
        'HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\\Zones\\4': {
          2500: {
            value: 3,
            type: 'REG_DWORD',
          },
        },
      },
      (err) => {
        if (err) return reject(`set secutity zones failure - ${err.toString()}`);
        return resolve();
      },
    );
  });
}

function setIEFeature() {
  return new Promise((resolve, reject) => {
    regedit.createKey(
      'HKLM\\SOFTWARE\\Wow6432Node\\Microsoft\\Internet Explorer\\Main\\FeatureControl\\FEATURE_BFCACHE',
      (err) => {
        if (err) return reject(`create key 'FEATURE_BFCACHE' failure - ${err.toString()}`);

        return regedit.putValue(
          {
            'HKLM\\SOFTWARE\\Wow6432Node\\Microsoft\\Internet Explorer\\Main\\FeatureControl\\FEATURE_BFCACHE': {
              'iexplore.exe': {
                value: 0,
                type: 'REG_DWORD',
              },
            },
          },
          (putValueError) => {
            if (putValueError) return reject(`set 'FEATURE_BFCACHE' failure - ${putValueError.toString()}`);
            return resolve();
          },
        );
      },
    );
  });
}

export async function setIEEnviroment() {
  try {
    await setIEFeature();
    await setIESecurityZones();
  } catch (error) {
    throw error;
  }
}

