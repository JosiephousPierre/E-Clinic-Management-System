import { defineStore } from "pinia";

const defaultConsultationField = {
  id: "0",
  nurse_Id: "1",
  student_Id: "",
  student_Lname: "",
  student_Fname: "",
  course: "",
  description: "",
  medicine: "",
  date: "",
  timeIn: "",
  checkOut: "",
};

export const useConsultStore = defineStore("consults", {
  state: () => ({
    consultations: [],
    consultationForCheckout: {},
  }),
  getters: {
    getConsultations: (state) => state.consultations,
    getConsultationForCheckout: (state) => state.consultationForCheckout,
  },
  actions: {
    addConsultation(consultation) {
      const id =
        this.consultations.length > 0
          ? this.consultations[this.consultations.length - 1].id + 1
          : 1;
      this.consultations.push({
        ...defaultConsultationField,
        ...consultation,
        id,
      });
    },
    updateConsultation(consultation) {
      const { id } = consultation;
      const indexToEdit = this.consultations.findIndex((obj) => obj.id === id);
      if (indexToEdit !== -1) {
        this.consultations[indexToEdit] = { ...consultation };
        this.resetConsultationToUpdate;
      }
    },
    deleteConsultationById(id) {
      const indexToRemove = this.consultations.findIndex(
        (obj) => obj.id === id
      );
      if (indexToRemove !== -1) {
        this.consultations.splice(indexToRemove, 1);
      }
    },
    addConsultationForCheckout(consultation) {
      this.consultationForCheckout = { ...consultation };
    },
    resetConsultationForCheckout() {
      this.consultationForCheckout = {};
    },
  },
  persist: {
    storage: sessionStorage,
  },
});
