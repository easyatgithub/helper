/**
 * Get workflow of sign in
 */
export function signInWorkflowEnum(isManualSignIn) {
  return isManualSignIn
    ? [
        { status: "pending", message: "", name: PublicWorkflow.SET_IE_ENVIROMENT },
        { status: "pending", message: "", name: PublicWorkflow.SET_PROXY },
        { status: "pending", message: "", name: PublicWorkflow.LAUNCH_SELENIUM },
        { status: "pending", message: "", name: PublicWorkflow.CHECK_IF_LOGIN_SUCCESS },
      ]
    : [
        { status: "pending", message: "", name: PublicWorkflow.SET_IE_ENVIROMENT },
        { status: "pending", message: "", name: PublicWorkflow.SET_PROXY },
        { status: "pending", message: "", name: PublicWorkflow.LAUNCH_SELENIUM },
        { status: "pending", message: "", name: PublicWorkflow.LOGIN_TO_BANK },
        { status: "pending", message: "", name: PublicWorkflow.CHECK_IF_LOGIN_SUCCESS },
      ];
}
/**
 * Get workflow
 * @param {String} bankCode
 */
export function workflowEnum(bankCode) {
  if (!bankCode) return PublicWorkflow;
  else if (bankCode.indexOf("ABC") !== -1) return ABCWorkflow;
  else if (bankCode.indexOf("BCM") !== -1) return BCMWorkflow;
  else if (bankCode.indexOf("BOB") !== -1) return BOBWorkflow;
  else if (bankCode.indexOf("BOC") !== -1) return BOCWorkflow;
  else if (bankCode.indexOf("CCB") !== -1) return CCBWorkflow;
  else if (bankCode.indexOf("CITIC") !== -1) return CITICWorkflow;
  else if (bankCode.indexOf("CMBC") !== -1) return CMBCWorkflow;
  else if (bankCode.indexOf("HRBB") !== -1) return HRBBWorkflow;
  else if (bankCode.indexOf("ICBC") !== -1) return ICBCWorkflow;
  else if (bankCode.indexOf("JZB") !== -1) return JZBWorkflow;
  else if (bankCode.indexOf("PINGAN") !== -1) return PINGANWorkflow;
  else if (bankCode.indexOf("PSBC") !== -1) return PSBCWorkflow;
  else throw new Error("No such workflow");
}

export const workflowStatusEnum = {
  PENDING: "pending",
  RUNNING: "running",
  SUCCESS: "success",
  FAIL: "fail",
};
Object.freeze(workflowStatusEnum);

const PublicWorkflow = {
  SET_IE_ENVIROMENT: "Set IE enviroment",
  SET_PROXY: "Set proxy",
  LAUNCH_SELENIUM: "Launch IE",
  CLOSE_SELENIUM: "Close IE",
  LOGIN_TO_BANK: "Login to bank website",
  SEND_USB_KEY: "Send usb key",
  CHECK_IF_LOGIN_SUCCESS: "Check if login success",
  GET_COOKIE: "Get cookie",
  GET_BALANCE: "Get balance",
  GO_TRANSFER_PAGE: "Go to transfer page",
  FILL_TRANSFER_INFORMATION: "Fill transfer information",
  FILL_NOTE: "Fill note",
  CONFIRM_TRANSACTION: "Confirm transaction",
  CHECK_IF_SUCCESS: "Check if transfer success",
};
Object.freeze(PublicWorkflow);

const ABCWorkflow = [
  //{ status: "pending", message: "", name: PublicWorkflow.GET_BALANCE },
  { status: "pending", message: "", name: PublicWorkflow.GO_TRANSFER_PAGE },
  {
    status: "pending",
    message: "",
    name: PublicWorkflow.FILL_TRANSFER_INFORMATION,
  },
  // { status: "pending", message: "", name: PublicWorkflow.FILL_NOTE },
  //{ status: "pending", message: "", name: PublicWorkflow.CONFIRM_TRANSACTION },
  //{ status: "pending", message: "", name: PublicWorkflow.CHECK_IF_SUCCESS },
];
Object.freeze(ABCWorkflow);

const BCMWorkflow = [
  { status: "pending", message: "", name: PublicWorkflow.GO_TRANSFER_PAGE },
  { status: "pending", message: "", name: PublicWorkflow.FILL_TRANSFER_INFORMATION },
];
Object.freeze(BCMWorkflow);

const BOCWorkflow = [
  // { status: "pending", message: "", name: PublicWorkflow.SET_IE_ENVIROMENT },
  // { status: "pending", message: "", name: PublicWorkflow.SET_PROXY },
  // { status: "pending", message: "", name: PublicWorkflow.LAUNCH_SELENIUM },
  // { status: "pending", message: "", name: PublicWorkflow.CHECK_IF_LOGIN_SUCCESS },
  { status: "pending", message: "", name: PublicWorkflow.GO_TRANSFER_PAGE },
  {
    status: "pending",
    message: "",
    name: PublicWorkflow.FILL_TRANSFER_INFORMATION,
  },
];
Object.freeze(BOCWorkflow);

const CCBWorkflow = [
  // { status: "pending", message: "", name: PublicWorkflow.GET_BALANCE },
  { status: "pending", message: "", name: PublicWorkflow.GO_TRANSFER_PAGE },
  {
    status: "pending",
    message: "",
    name: PublicWorkflow.FILL_TRANSFER_INFORMATION,
  },
  // { status: "pending", message: "", name: PublicWorkflow.FILL_NOTE },
  // { status: "pending", message: "", name: PublicWorkflow.CHECK_IF_SUCCESS }
];
Object.freeze(CCBWorkflow);

const CITICWorkflow = [
  { status: "pending", message: "", name: PublicWorkflow.GO_TRANSFER_PAGE },
  { status: "pending", message: "", name: PublicWorkflow.FILL_TRANSFER_INFORMATION },
];
Object.freeze(CITICWorkflow);

const CMBCWorkflow = [
  // { status: "pending", message: "", name: PublicWorkflow.SET_IE_ENVIROMENT },
  // { status: "pending", message: "", name: PublicWorkflow.SET_PROXY },
  // { status: "pending", message: "", name: PublicWorkflow.LAUNCH_SELENIUM },
  // { status: "pending", message: "", name: PublicWorkflow.CHECK_IF_LOGIN_SUCCESS },
  { status: "pending", message: "", name: PublicWorkflow.GO_TRANSFER_PAGE },
  {
    status: "pending",
    message: "",
    name: PublicWorkflow.FILL_TRANSFER_INFORMATION,
  },
];
Object.freeze(CMBCWorkflow);

const ICBCWorkflow = [
  { status: "pending", message: "", name: PublicWorkflow.GO_TRANSFER_PAGE },
  {
    status: "pending",
    message: "",
    name: PublicWorkflow.FILL_TRANSFER_INFORMATION,
  },
  // { status: "pending", message: "", name: PublicWorkflow.FILL_NOTE },
  // { status: "pending", message: "", name: PublicWorkflow.CHECK_IF_SUCCESS }
];
Object.freeze(ICBCWorkflow);

const JZBWorkflow = [
  // { status: "pending", message: "", name: PublicWorkflow.GET_BALANCE },
  { status: "pending", message: "", name: PublicWorkflow.GO_TRANSFER_PAGE },
  {
    status: "pending",
    message: "",
    name: PublicWorkflow.FILL_TRANSFER_INFORMATION,
  },
  // { status: "pending", message: "", name: PublicWorkflow.FILL_NOTE },
  { status: "pending", message: "", name: PublicWorkflow.CONFIRM_TRANSACTION },
  { status: "pending", message: "", name: PublicWorkflow.CHECK_IF_SUCCESS },
];
Object.freeze(JZBWorkflow);

const PSBCWorkflow = [
  { status: "pending", message: "", name: PublicWorkflow.GO_TRANSFER_PAGE },
  {
    status: "pending",
    message: "",
    name: PublicWorkflow.FILL_TRANSFER_INFORMATION,
  },
];
Object.freeze(PSBCWorkflow);

const PINGANWorkflow = [
  { status: "pending", message: "", name: PublicWorkflow.GO_TRANSFER_PAGE },
  {
    status: "pending",
    message: "",
    name: PublicWorkflow.FILL_TRANSFER_INFORMATION,
  },
];
Object.freeze(PINGANWorkflow);

const HRBBWorkflow = [
  { status: "pending", message: "", name: PublicWorkflow.GO_TRANSFER_PAGE },
  {
    status: "pending",
    message: "",
    name: PublicWorkflow.FILL_TRANSFER_INFORMATION,
  },
];
Object.freeze(HRBBWorkflow);
const BOBWorkflow = [
  { status: "pending", message: "", name: PublicWorkflow.GO_TRANSFER_PAGE },
  {
    status: "pending",
    message: "",
    name: PublicWorkflow.FILL_TRANSFER_INFORMATION,
  },
];
Object.freeze(BOBWorkflow);
