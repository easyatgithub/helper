import { getDetailById, getBoBalance, getGroup } from "../../api/card";

const card = {
  state: {
    selected: {},
    selectedDetail: {},
    current: {
      id: "",
      accountCode: "",
      bankCode: "",
      balanceInSystem: 0,
      balanceInOnlineBank: 0,
      accountName: "",
      accountPassword: "",
      queryPassword: "",
      usbPassword: "",
      proxy: "",
      cookie: "",
      session: "",
    },
    currentDetail: {},
  },

  mutations: {
    SET_SELECTED_CARD: (state, account) => {
      state.selected.id = account.id;
      state.selected.accountCode = account.accountCode;
      state.selected.bankCode = account.bankCode;
    },
    UNSET_SELECTED_CARD: state => {
      state.selected = {};
    },
    SET_SELECTED_CARD_DETAIL: (state, { selectedCard, cardDetail, boBalance, group }) => {
      state.selectedDetail = {
        id: selectedCard.id,
        accountCode: selectedCard.accountCode,
        bankCode: selectedCard.bankCode,
        balanceInSystem: boBalance,
        balanceInOnlineBank: 0,
        channelGroup: group,
        accountName: cardDetail.loginUsername,
        accountPassword: cardDetail.loginPassword,
        usbPassword: cardDetail.uKey,
        queryPassword: cardDetail.queryPassword,
        proxy: cardDetail.proxy,
      };
    },
    UNSET_SELECTED_CARD_DETAIL: state => {
      state.selectedDetail = {};
    },
    SET_CURRENT_CARD: (state, card) => {
      state.current = { ...card };
    },
    SET_CURRENT_CARD_DETAIL: (state, cardDetail) => {
      state.currentDetail = { ...cardDetail };
    },
    SET_CURRENT_CARD_BO_BALANCE: (state, boBalance) => {
      state.currentDetail.balanceInSystem = boBalance;
    },
    UNSET_CURRENT_CARD: state => {
      state.current = {
        id: "",
        accountCode: "",
        bankCode: "",
        balanceInSystem: 0,
        balanceInOnlineBank: 0,
        accountName: "",
        accountPassword: "",
        queryPassword: "",
        usbPassword: "",
        proxy: "",
        cookie: "",
        session: "",
      };
    },
    UNSET_CURRENT_CARD_DETAIL: state => {
      state.currentDetail = {};
    },
  },

  actions: {
    async SetSelectedCardDetail({ commit, getters }) {
      try {
        const selectedCard = getters.card.selected;
        var result = await getDetailById(selectedCard.id);
        var [getBoBalanceResult, getGroupResult] = await Promise.all([
          getBoBalance(selectedCard.id),
          getGroup(selectedCard.id),
        ]);
        commit("SET_SELECTED_CARD_DETAIL", {
          selectedCard,
          cardDetail: result.data.value.virtualAcct,
          boBalance: getBoBalanceResult.data.value[0].availableBalance,
          group: getGroupResult.data.value[0].accountGroup.groupName,
        });
      } catch (error) {
        throw error;
      }
    },
    async GetCurrentCardBoBalance({ commit, getters }) {
      try {
        const currentCard = getters.card.current;
        var getBoBalanceResult = await getBoBalance(currentCard.id);
        commit("SET_CURRENT_CARD_BO_BALANCE", getBoBalanceResult.data.value[0].availableBalance);
      } catch (error) {
        throw new Error("Get current card bo balance fail");
      }
    },

    // Move selected card to current card
    async SetCurrentCard({ commit, getters }) {
      try {
        commit("SET_CURRENT_CARD", getters.card.selected);
        commit("SET_CURRENT_CARD_DETAIL", getters.card.selectedDetail);
        commit("UNSET_SELECTED_CARD");
        commit("UNSET_SELECTED_CARD_DETAIL");
      } catch (error) {
        throw error;
      }
    },
    async UnsetCurrentCard({ commit }) {
      commit("UNSET_CURRENT_CARD");
    },
    // This for unset everything
    async UnsetCard({ commit }) {
      commit("UNSET_CURRENT_CARD");
      commit("UNSET_CURRENT_CARD_DETAIL");
      commit("UNSET_SELECTED_CARD");
      commit("UNSET_SELECTED_CARD_DETAIL");
    },
  },
};

export default card;
