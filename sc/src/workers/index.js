import * as RegeditTool from '../utils/regeditTool';
import ABCRule from './ABCRule';
import CMBRule from './CMBRule';
import BOTRule from './BOTRule';
import ICBCRule from './ICBCRule';
import PINGANRule from './PINGANRule';
import TZBRule from './TZBRule';
import CCBRule from './CCBRule';
import PSBCRule from './PSBCRule';
import SPDBRule from './SPDBRule';
import CMBCRule from './CMBCRule';
import CBBRule from './CBBRule';
// import HZCB from './HZCB';

function newInstance(data) {
  switch (data.bankCode) {
    case 'ABC':
      return new ABCRule(data);
    // case 'ARCU':
    //   rule = new ARCU(data);
    //   break;
    case 'BOT':
      return new BOTRule(data);
    case 'CBB':
      return new CBBRule(data);
    case 'CCB':
      return new CCBRule(data);
    case 'CMB':
      return new CMBRule(data);
    case 'CMBC':
      return new CMBCRule(data);
    // case 'CEB':
    //   rule = new CEB(data);
    //   break;
    // case 'CMB':
    //   rule = new CMB(data);
    //   break;
    // case 'HZCB':
    //   rule = new HZCB(data);
    //   break;
    case 'ICBC':
      return new ICBCRule(data);
    case 'PSBC':
      return new PSBCRule(data);
    case 'PINGAN':
      return new PINGANRule(data);
    case 'SPDB':
      return new SPDBRule(data);
    case 'TZB':
      return new TZBRule(data);
    default:
      throw new Error('No such bank rule');
  }
}

/**
 * @param {Object} data
 * @param {String} data.bankCode
 * @param {String} data.userName
 * @param {String} data.password
 * @param {String} data.proxy
 */
export default async function (data) {
  const NewInstance = newInstance(data);
  try {
    await RegeditTool.setIEEnviroment();
    const cookieAndSession = await NewInstance.launch();
    return cookieAndSession;
  } catch (error) {
    throw new Error(`Parse bank error. Bank name: ${data.bankCode}. Error: ${error}`);
  } finally {
    if (process.env.NODE_ENV === 'development') {
      if (NewInstance.driver.close) NewInstance.driver.close();
      RegeditTool.unsetProxy();
    } else {
      RegeditTool.setProxy(data.proxy);
    }
  }
}
