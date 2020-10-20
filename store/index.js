export const state = () => ({
  selectedTime: null,
  pharmacyId: null,
  size: null
});

export const mutations = {
  setSelectedTime(state, time) {
    state.selectedTime = time
  }
};