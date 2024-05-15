<script setup>
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Dialog from "primevue/dialog";
import Calendar from "primevue/calendar";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useConsultStore } from "../../store/consult";
import {
  formatDate,
  formatTime,
  formatToUrlEncoded,
} from "../../helpers/formatter";
import axiosClient from "../../utils/axiosClient";
import moment from 'moment-timezone';

const router = useRouter();

/** Fetch data from store. */
const storeConsult = useConsultStore();
let consultList = ref(storeConsult.getConsultations);

/** Toggle Add Consultation Dialog */
const isAddConsultationDialogOpen = ref(false);
const openAddConsultationDialog = () => {
  isAddConsultationDialogOpen.value = true;
};
const closeAddConsultationDialog = () => {
  isAddConsultationDialogOpen.value = false;
};

let philippinesTime = moment.tz("Asia/Manila").format(); // Initial value

function updatePhilippinesTime() {
  philippinesTime = moment.tz("Asia/Manila").format();
}

setInterval(updatePhilippinesTime, 1000); // Update every second

// Same for philippinesTimeOut
let philippinesTimeOut = moment.tz("Asia/Manila").format(); // Initial value

function updatePhilippinesTimeOut() {
  philippinesTimeOut = moment.tz("Asia/Manila").format();
}

setInterval(updatePhilippinesTimeOut, 1000); // Update every second


/** Save New Consultation */
const newConsultation = ref({});
const saveAddedConsultation = () => {
  if (
    !newConsultation.value.student_Lname ||
    !newConsultation.value.student_Fname ||
    !newConsultation.value.course ||
    !newConsultation.value.description ||
    !newConsultation.value.medicine ||
    !newConsultation.value.date
    // !newConsultation.value.timeIn
  ) {
    alert("Please fill in all fields before saving.");
    return;
  }

  // Set the current time in the Philippines for the timeIn field
  newConsultation.value.timeIn = philippinesTime.toString();

  storeConsult.addConsultation(newConsultation.value);
  alert("Successfully Added");
  closeAddConsultationDialog();
};

/** Toggle Edit Dialog and Fetch/Reset Data */
const consultationToUpdate = ref({});
const isEditConsultationDialogOpen = ref(false);
const openEditConsultationDialog = (val) => {
  consultationToUpdate.value = val.data;
  isEditConsultationDialogOpen.value = true;
};
const closeEditConsultationDialog = () => {
  isEditConsultationDialogOpen.value = false;
};

/** Update Edited Consultation */
const saveEditedConsultation = () => {
  if (
    !consultationToUpdate.value.student_Lname ||
    !consultationToUpdate.value.student_Fname ||
    !consultationToUpdate.value.course ||
    !consultationToUpdate.value.description ||
    !consultationToUpdate.value.medicine ||
    !consultationToUpdate.value.date
    // !consultationToUpdate.value.timeIn
  ) {
    alert("Please fill in all fields before saving.");
    return;
  }

  console.log('SAVE UPDATEEEEEEEEEE')
    // Set the current time in the Philippines for the timeIn field
  consultationToUpdate.value.timeIn = philippinesTime.toString();
  storeConsult.updateConsultation(consultationToUpdate.value);
  alert("Consultation successfully saved!");
  closeEditConsultationDialog();
};

/** Delete consultation*/
const deleteConsultation = (id) => {
  storeConsult.deleteConsultationById(id);
  alert("Consultation data successfully deleted!");
};

/** Toggle Checkout Dialog */
const isCheckoutConsultationDialogOpen = ref(false);
const openCheckoutConsultationDialog = (val) => {
  storeConsult.addConsultationForCheckout(val.data);
  saveCheckoutConsultation()
  // isCheckoutConsultationDialogOpen.value = true;
};
const closeCheckoutConsultationDialog = () => {
  storeConsult.resetConsultationForCheckout();
  isCheckoutConsultationDialogOpen.value = false;
};

/** Checkout Consultation */
const saveCheckoutConsultation = () => {
  // console.log('TIME IN NOW', philippinesTimeOut);
  // console.log('TIME OUT NOW', philippinesTimeOut);
  const checkoutConsultation = { ...storeConsult.getConsultationForCheckout };
  if (
    !checkoutConsultation.nurse_Id ||
    // !checkoutConsultation.student_Id ||
    !checkoutConsultation.student_Lname ||
    !checkoutConsultation.student_Fname ||
    !checkoutConsultation.course ||
    !checkoutConsultation.description ||
    !checkoutConsultation.medicine ||
    !checkoutConsultation.date ||
    !checkoutConsultation.timeIn
    // !checkoutConsultation.checkOut
  ) {
    alert("Please fill in all fields before checking out.");
    closeCheckoutConsultationDialog();
    return;
  }
  const payload = {
    // student_Id: checkoutConsultation.student_Id,
    student_Id: 2, 
    /* Hardcode ko po muna kase wala po dito ung pag extract ng student_ID, 
    baka po kase kapag may ginalawa po akong  iba masira kopo. I'll let you handle the consultation page napo */
    nurseID: checkoutConsultation.nurse_Id,
    illness: checkoutConsultation.description,
    medicine: checkoutConsultation.medicine,
    date: checkoutConsultation.date,
    time_In: checkoutConsultation.timeIn,
    check_Out: philippinesTimeOut.toString(),
  };

  console.log('SAVEEEEEEEE SHEESHH', payload);
  console.log('SAVEEEEEEEE SHEESHH TIME', philippinesTimeOut.toString())

  const formData = formatToUrlEncoded(payload);
  axiosClient
    .post("/consult/", formData)
    .then((res) => {
      console.log(res);
      closeCheckoutConsultationDialog();
      deleteConsultation(checkoutConsultation.id);
      router.push("/records");
    })
    .catch((error) => {
      console.error("Error adding consult:", error);
    });

};
</script>

<template>
  <div class="bgImg">
    <div class="container">
      <h1>List of Patients</h1>
      <div
        style="
          margin-bottom: 10px;
          width: 100%;
          display: flex;
          justify-content: end;
          align-items: end;
        "
      >
        <Button
          label="Add"
          icon="pi pi-plus"
          class="p-button-primary"
          @click="openAddConsultationDialog"
        />
      </div>
      <DataTable
        :value="consultList"
        paginator
        :rows="5"
        :rowsPerPageOptions="[5, 10, 20, 50]"
        tableStyle="width: 100%;border-radius:5px;"
      >
        <Column
          headerStyle="background-color: #FF6EC7; color:white"
          field="id"
          header="Consultation ID"
        ></Column>
        <Column
          headerStyle="background-color: #FF6EC7; color:white"
          field="nurse_Id"
          header="Nurse ID"
        ></Column>
        <Column
          headerStyle="background-color: #FF6EC7; color:white"
          field="student_Id"
          header="Student ID"
        ></Column>
        <Column
          headerStyle="background-color: #FF6EC7; color:white"
          field="student_Lname"
          header="Last Name"
        ></Column>
        <Column
          headerStyle="background-color: #FF6EC7; color:white"
          field="student_Fname"
          header="First Name"
        ></Column>
        <Column
          headerStyle="background-color: #FF6EC7; color:white"
          field="course"
          header="Course"
        ></Column>
        <Column
          headerStyle="background-color: #FF6EC7; color:white"
          field="description"
          header="Symptom"
        ></Column>
        <Column
          headerStyle="background-color: #FF6EC7; color:white"
          field="medicine"
          header="Medicine"
        ></Column>
        <Column
          headerStyle="background-color: #FF6EC7; color:white"
          field="date"
          header="Date"
        >
          <template #body="consultation">{{
            consultation.data.date ? formatDate(consultation.data.date) : ""
          }}</template>
        </Column>
        <Column
          headerStyle="background-color: #FF6EC7; color:white"
          field="timeIn"
          header="Time In"
        >
          <template #body="consultation">{{
            consultation.data.timeIn ? formatTime(consultation.data.timeIn) : ""
          }}</template>
        </Column>
        <Column
          headerStyle="background-color: #FF6EC7; color:white"
          field="checkOut"
          header="Check-Out"
        >
          <template #body="consultation">{{
            consultation.data.checkOut
              ? formatTime(consultation.data.checkOut)
              : ""
          }}</template>
        </Column>
        <Column
          headerStyle="background-color: #FF6EC7; color:white"
          header="Actions"
        >
          <template #body="consultation">
            <div style="display: flex; gap: 2px; flex-direction: column">
              <div style="display: flex; gap: 2px">
                <Button
                  label="Edit"
                  icon="pi pi-pencil"
                  class="p-button-info"
                  @click="openEditConsultationDialog(consultation)"
                />
                <Button
                  label="Delete"
                  icon="pi pi-trash"
                  class="p-button-danger"
                  @click="deleteConsultation(consultation.data.id)"
                />
              </div>
              <div style="display: flex; gap: 2px">
                <Button
                  label="Check-out"
                  severity="success"
                  icon="pi pi-check"
                  @click="openCheckoutConsultationDialog(consultation)"
                />
              </div>
            </div>
          </template>
        </Column>
      </DataTable>

      <!-- Edit Category Form-->
      <Dialog
        :pt="{
          mask: {
            style: 'backdrop-filter: blur(2px)',
          },
        }"
        style="padding: 0"
        v-if="isEditConsultationDialogOpen"
        visible
        @onHide="closeEditConsultationDialog"
        :closable="false"
      >
        <template #container="{ closeCallback }">
          <div
            style="background-color: #fd9bd8; padding: 10px; border-radius: 5px"
          >
            <h2 style="margin: 0; color: white">Edit Category</h2>
            <form
              style="
                display: flex;
                flex-direction: column;
                gap: 6px;
                flex-wrap: wrap;
              "
              @submit.prevent="saveEditedConsultation"
            >
              <div style="display: flex; gap: 8px">
                <div>
                  <div style="flex: 1; display: flex; flex-direction: column">
                    <label for="editedLname">Last Name:</label>
                    <InputText
                      id="editedLname"
                      v-model="consultationToUpdate.student_Lname"
                    />
                  </div>
                  <div style="flex: 1; display: flex; flex-direction: column">
                    <label for="editedFname">First Name:</label>
                    <InputText
                      id="editedFname"
                      v-model="consultationToUpdate.student_Fname"
                    />
                  </div>
                  <div style="flex: 1; display: flex; flex-direction: column">
                    <label for="editedCourse">Course:</label>
                    <InputText
                      id="editedCourse"
                      v-model="consultationToUpdate.course"
                    />
                  </div>
                  <div style="flex: 1; display: flex; flex-direction: column">
                    <label for="editedDescription">Symptom:</label>
                    <InputText
                      id="editedDescription"
                      v-model="consultationToUpdate.description"
                    />
                  </div>
                </div>
                <div>
                  <div style="flex: 1; display: flex; flex-direction: column">
                    <label for="editedMedicine">Medicine:</label>
                    <InputText
                      id="editedMedicine"
                      v-model="consultationToUpdate.medicine"
                    />
                  </div>
                  <div style="flex: 1; display: flex; flex-direction: column">
                    <label for="editedDate">Date:</label>
                    <Calendar
                      id="editedDate"
                      dateFormat="dd/mm/yy"
                      showIcon
                      v-model="consultationToUpdate.date"
                    />
                  </div>
                  <!--
                  <div style="flex: 1; display: flex; flex-direction: column">
                    <label for="editedTime">Time In:</label>
                    <Calendar
                      id="editedTime"
                      v-model="consultationToUpdate.timeIn"
                      hourFormat="12"
                      showIcon
                      iconDisplay="input"
                      timeOnly
                    ></Calendar>
                  </div> 
                  -->
                </div>
              </div>
              <div
                style="
                  width: 100%;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  gap: 8px;
                  margin-top: 10px;
                "
              >
                <Button
                  label="Cancel"
                  icon="pi pi-times"
                  class="p-button-secondary"
                  @click="closeEditConsultationDialog"
                />
                <Button
                  label="Save"
                  icon="pi pi-check"
                  class="p-button-success"
                  type="submit"
                />
              </div>
            </form>
          </div>
        </template>
      </Dialog>

      <!-- Add Category Form-->
      <Dialog
        :pt="{
          mask: {
            style: 'backdrop-filter: blur(2px)',
          },
        }"
        style="padding: 0"
        v-if="isAddConsultationDialogOpen"
        visible
        @onHide="closeAddConsultationDialog"
        :closable="false"
      >
        <template #container="{ closeCallback }">
          <div
            style="background-color: #fd9bd8; padding: 10px; border-radius: 5px"
          >
            <h2 style="margin: 0; color: white">Add Patient</h2>
            <form @submit.prevent="saveAddedConsultation">
              <div style="display: flex; gap: 8px">
                <div>
                  <div style="flex: 1; display: flex; flex-direction: column">
                    <label for="newLname">Last Name:</label>
                    <InputText
                      id="newLname"
                      v-model="newConsultation.student_Lname"
                    />
                  </div>
                  <div style="flex: 1; display: flex; flex-direction: column">
                    <label for="newFname">First Name:</label>
                    <InputText
                      id="newFname"
                      v-model="newConsultation.student_Fname"
                    />
                  </div>
                  <div style="flex: 1; display: flex; flex-direction: column">
                    <label for="newCourse">Course:</label>
                    <InputText
                      id="newCourse"
                      v-model="newConsultation.course"
                    />
                  </div>
                  <div style="flex: 1; display: flex; flex-direction: column">
                    <label for="newDescription">Symptom:</label>
                    <InputText
                      id="newDescription"
                      v-model="newConsultation.description"
                    />
                  </div>
                </div>
                <div>
                  <div style="flex: 1; display: flex; flex-direction: column">
                    <label for="newMedicine">Medicine:</label>
                    <InputText
                      id="newMedicine"
                      v-model="newConsultation.medicine"
                    />
                  </div>
                  <div style="flex: 1; display: flex; flex-direction: column">
                    <label for="newDate">Date:</label>
                    <Calendar
                      id="newDate"
                      dateFormat="dd/mm/yy"
                      v-model="newConsultation.date"
                      showIcon
                    />
                  </div>
                  <!--
                  <div style="flex: 1; display: flex; flex-direction: column"> 
                    <label for="newTimeIn">Time In:</label>
                    <Calendar
                      id="newTimeIn"
                      v-model="newConsultation.timeIn"
                      hourFormat="12"
                      showIcon
                      iconDisplay="input"
                      timeOnly
                    ></Calendar>
                  </div>
                  -->
                </div>
              </div>
              <div
                style="
                  margin: 10px;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  gap: 4px;
                "
              >
                <Button
                  label="Cancel"
                  icon="pi pi-times"
                  class="p-button-secondary"
                  @click="closeAddConsultationDialog"
                />
                <Button
                  label="Add"
                  icon="pi pi-plus"
                  class="p-button-primary"
                  type="submit"
                />
              </div>
            </form>
          </div>
        </template>
      </Dialog>

      <!-- Check-Out Category Form-->
      <Dialog
        :pt="{
          mask: {
            style: 'backdrop-filter: blur(2px)',
          },
        }"
        style="padding: 0"
        v-if="isCheckoutConsultationDialogOpen"
        visible
        @onHide="closeCheckoutConsultationDialog"
        :closable="false"
      >
        <template #container="{ closeCallback }">
          <div
            style="background-color: #fd9bd8; padding: 10px; border-radius: 5px"
          >
            <h2 style="margin: 0; color: white">Add Patient</h2>
            <form @submit.prevent="saveCheckoutConsultation">
              <div style="display: flex; gap: 8px">
                <div>
                  <div style="flex: 1; display: flex; flex-direction: column">
                    <label for="editedcheckOut">Check-out:</label>
                    <Calendar
                      id="editedcheckOut"
                      hourFormat="12"
                      showIcon
                      iconDisplay="input"
                      timeOnly
                    ></Calendar>
                  </div>
                </div>
              </div>
              <div
                style="
                  margin: 10px;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  gap: 4px;
                "
              >
                <Button
                  label="Cancel"
                  icon="pi pi-times"
                  class="p-button-secondary"
                  @click="closeCheckoutConsultationDialog"
                />
                <Button
                  label="Save"
                  icon="pi pi-check"
                  class="p-button-success"
                  type="submit"
                />
              </div>
            </form>
          </div>
        </template>
      </Dialog>
    </div>
  </div>
</template>

<style scoped>
.bgImg {
  display: flex;
  position: relative;
  justify-content: center;
  align-items: top;
  height: 100vh;
  background-image: url("../assets/UIC.jpg");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  padding-top: 20px;
}
.container {
  width: 80%;
  height: max-content;
  backdrop-filter: blur(3px);
  background-color: rgba(255, 255, 255, 0.5);
  padding: 10px 30px 20px 10px;
  border-radius: 5px;
}
</style>
