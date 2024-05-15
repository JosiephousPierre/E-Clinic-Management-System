<template>
  <div class="bgImg">
    <div class="container">
      <h1>Consulted Medication</h1>
      <div
        style="
          margin-bottom: 10px;
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
        "
      >
        <!--
        <InputText
          style="margin-bottom: 15px; width: 300px"
          v-model="searchQuery"
          placeholder="Search"
        />
        -->

        <Button
          label="Add"
          icon="pi pi-plus"
          class="p-button-primary"
          @click="openAddConsultMedDialog"
        />
      </div>
      <DataTable
        :value="consulted_medications"
        paginator
        :rows="5"
        :rowsPerPageOptions="[5, 10, 20, 50]"
        stripedRows
        tableStyle="min-width: 80rem;"
      >
        <Column
          headerStyle="background-color: #FF6EC7; color:white"
          field="prescription_Id"
          header="Prescription ID"
          sortable
        ></Column>
        <Column
          headerStyle="background-color: #FF6EC7; color:white"
          field="Consultation_Id"
          header="Consultation ID"
          sortable
        ></Column>
        <!--
          <Column
            headerStyle="background-color: #FF6EC7; color:white"
            field="medicine_ID"
            header="Medicine ID"
            sortable
        ></Column>

        Eto po yung original code na ung ID lang po nung medicine ung nakikita
        -->
        <Column
          headerStyle="background-color: #FF6EC7; color:white"
          field="brandName"
          header="Brand Name"
          sortable
        ></Column>
        <Column
          headerStyle="background-color: #FF6EC7; color:white"
          field="quantity"
          header="Quantity"
          sortable
        ></Column>

        <Column
          headerStyle="background-color: #FF6EC7; color:white"
          header="Actions"
        >
          <template #body="consultmed">
            <div style="display: flex; gap: 2px; flex-direction: column">
              <div style="display: flex; gap: 2px">
                <Button
                  label="Edit"
                  icon="pi pi-pencil"
                  class="p-button-info"
                  @click="openEditConsultMedDialog(consultmed)"
                />
                <Button
                  label="Delete"
                  icon="pi pi-trash"
                  class="p-button-danger"
                  @click="deleteConsultMed(consultmed.data.prescription_Id)"
                />
              </div>
            </div>
          </template>
        </Column>
      </DataTable>

      <!-- Add Dialog -->
      <Dialog
        :pt="{
          mask: {
            style: 'backdrop-filter: blur(2px)',
          },
        }"
        style="padding: 0"
        v-if="isAddConsultMedDialogOpen"
        visible
        @onHide="closeAddConsultMedDialog"
        :closable="false"
      >
        <template #container="{ closeCallback }">
          <div
            style="background-color: #fd9bd8; padding: 10px; border-radius: 5px"
          >
            <h2 style="margin: 0; color: white">Add Consulted Medication</h2>
            <form @submit.prevent="saveAddedConsultMed">
              <div style="padding: 1rem">
                <div>
                  <div
                    style="
                      flex: 1;
                      display: flex;
                      flex-direction: column;
                      margin-bottom: 10px;
                    "
                  >
                    <label for="Consultation_Id">Consultation ID:</label>
                    <!--<InputText id="Consultation_Id" v-model="newConsultMed.Consultation_Id" />-->
                    <select v-model="newConsultMed.Consultation_Id" class="select-box"> 
                      <option disabled value="">Select Consult ID</option>
                      <option 
                        v-for="consultation in consult_list" 
                        :value="consultation.Consultation_Id" 
                        :key="consultation.Consultation_Id"
                      >{{ consultation.Consultation_Id }}</option>
                    </select>
                  </div>
                  <div
                    style="
                      flex: 1;
                      display: flex;
                      flex-direction: column;
                      margin-bottom: 10px;
                    "
                  >
                    <label for="medicine_ID">Medicine ID:</label>
                    <!--<InputText id="medicine_ID" v-model="newConsultMed.medicine_ID" />-->
                    <select v-model="newConsultMed.medicine_ID" class="select-box"> 
                      <option disabled value="">Select Medicine</option>
                      <option 
                        v-for="med in meds_list" 
                        :value="med.medicine_ID" 
                        :key="med.medicine_ID"
                      >{{ med.brandName }}</option>
                    </select>
                  </div>
                  <div
                    style="
                      flex: 1;
                      display: flex;
                      flex-direction: column;
                      margin-bottom: 10px;
                    "
                  >
                    <label for="quantity">Quantity:</label>
                    <InputText
                      id="quantity"
                      type="number"
                      v-model="newConsultMed.quantity"
                    />
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
                  @click="closeAddConsultMedDialog"
                />
                <Button
                  label="Save"
                  icon="pi pi-plus"
                  class="p-button-primary"
                  type="submit"
                />
              </div>
            </form>
          </div>
        </template>
      </Dialog>

      <!-- Edit Dialog -->
      <Dialog
        :pt="{
          mask: {
            style: 'backdrop-filter: blur(2px)',
          },
        }"
        style="padding: 0"
        v-if="isEditConsultMedDialogOpen"
        visible
        @onHide="closeEditConsultMedDialog"
        :closable="false"
      >
        <template #container="{ closeCallback }">
          <div
            style="background-color: #fd9bd8; padding: 10px; border-radius: 5px"
          >
            <h2 style="margin: 0; color: white">Edit Consulted Medication</h2>
            <form @submit.prevent="saveEditedConsultMed">
              <div style="padding: 1rem">
                <div>
                  <div
                    style="
                      flex: 1;
                      display: flex;
                      flex-direction: column;
                      margin-bottom: 10px;
                    "
                  >
                    <label for="Consultation_Id">Consultation ID:</label>
                    <!--
                      <InputText
                        id="Consultation_Id"
                        v-model="editedConsultMed.Consultation_Id"
                      />
                    -->
                    <select v-model="editedConsultMed.Consultation_Id" class="select-box"> 
                      <option disabled value="">Select Consult ID</option>
                      <option 
                        v-for="consultation in consult_list" 
                        :value="consultation.Consultation_Id" 
                        :key="consultation.Consultation_Id"
                      >{{ consultation.Consultation_Id }}</option>
                    </select>
                  </div>
                  <div
                    style="
                      flex: 1;
                      display: flex;
                      flex-direction: column;
                      margin-bottom: 10px;
                    "
                  >
                    <label for="medicine_ID">Medicine ID:</label>
                    <!--
                      <InputText
                        id="medicine_ID"
                        v-model="editedConsultMed.medicine_ID"
                      />       
                    -->
                    <select v-model="editedConsultMed.medicine_ID" class="select-box"> 
                      <option disabled value="">Select Medicine</option>
                      <option 
                        v-for="med in meds_list" 
                        :value="med.medicine_ID" 
                        :key="med.medicine_ID"
                      >{{ med.brandName }}</option>
                    </select>
                  </div>
                  <div
                    style="
                      flex: 1;
                      display: flex;
                      flex-direction: column;
                      margin-bottom: 10px;
                    "
                  >
                    <label for="quantity">Quantity:</label>
                    <InputText
                      id="quantity"
                      type="number"
                      v-model="editedConsultMed.quantity"
                    />
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
                  @click="closeEditConsultMedDialog"
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

<script setup>
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { computed, onMounted, ref } from "vue";
import axiosClient from "../../utils/axiosClient";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Calendar from "primevue/calendar";
import Dialog from "primevue/dialog";
import { formatDateToUTC, formatToUrlEncoded } from "../../helpers/formatter";
import { useRouter } from "vue-router";

const router = useRouter();

/** Fetch Consulted Medications */
const consulted_medications = ref([]);
const consult_list = ref([]);
const meds_list = ref([]);
const isLoading = ref(false);

const fetchConsultMeds = async () => {
  isLoading.value = true;
  try {
    const { data } = await axiosClient.get("/consulted_medication/");
    console.log('CONSULT MED DATA', data);
    for (const med of data) {
      try {
        console.log('Fetching medicine for ID:', med.medicine_ID);
        const response = await axiosClient.get(`/manage_med/${med.medicine_ID}`);
        console.log('Received response:', response.data);
        const brandName = response.data.brandName;
        consulted_medications.value.push({
          ...med,
          brandName: brandName,
        });
      } catch (error) {
        console.error(`Error fetching brandName for medicine ID ${med.medicine_ID}:`, error);
      }
    }
  } catch (error) {
    console.error("Error fetching consulted_medications:", error);
  } finally {
    isLoading.value = false;
  }
};

const fetchConsultList = async () => {
  isLoading.value = true;
  axiosClient
    .get("/consult/")
    .then(({ data }) => {
      consult_list.value = data;
      console.log('CONSULT__LIST', consult_list.value)
    })
    .catch((error) => {
      console.error("Error fetching consults:", error);
    })
    .finally(() => {
      isLoading.value = false;
    });
};

const fetchMedsList = async () => {
  isLoading.value = true;
  axiosClient
    .get("/manage_med/")
    .then(({ data }) => {
      meds_list.value = data;
      console.log('MEDS__LIST', meds_list.value)
    })
    .catch((error) => {
      console.error("Error fetching meds:", error);
    })
    .finally(() => {
      isLoading.value = false;
    });
};

onMounted(() => {
  fetchConsultMeds();
  fetchConsultList();
  fetchMedsList();
});


const searchQuery = ref("");
/*const filteredMedicines = computed(() => {
  return consulted_medications.value.filter((medicine) => {
    const fullName =
      medicine.brandName.toLowerCase() + " " + medicine.drugName.toLowerCase();
    return fullName.includes(searchQuery.value.toLowerCase());
  });
});*/

/** Add Consult Med */
const isAddConsultMedDialogOpen = ref(false);
const newConsultMed = ref({});
const openAddConsultMedDialog = () => {
  isAddConsultMedDialogOpen.value = true;
};
const closeAddConsultMedDialog = () => {
  isAddConsultMedDialogOpen.value = false;
  alert("Adding medicine has been canceled.");
};
const saveAddedConsultMed = () => {
  const payload = { ...newConsultMed.value };
  if (
    !payload.Consultation_Id ||
    !payload.medicine_ID ||
    !payload.quantity
  ) {
    alert("Please fill in all fields before saving.");
    return;
  }

  const formData = formatToUrlEncoded(payload);

  axiosClient
    .post("/consulted_medication/", formData)
    .then((res) => {
      alert("Consulted Medication was successfully added.");
      closeAddConsultMedDialog();
      router.go();
    })
    .catch((error) => {
      console.error("Error adding consult medication:", error.response.data.detail);

      // Will print the error message if the add consult med fails
      alert(error.response.data.detail);
    });
};

/** Edit Consult Med */
const isEditConsultMedDialogOpen = ref(false);
const editedConsultMed = ref({});
const openEditConsultMedDialog = (val) => {
  console.log('VALUEEEE EDIT', val.data)
  editedConsultMed.value = val.data;
  isEditConsultMedDialogOpen.value = true;
};
const closeEditConsultMedDialog = () => {
  isEditConsultMedDialogOpen.value = false;
  alert("Editing consulted medication has been canceled.")
};
const saveEditedConsultMed = () => {
  const payload = { ...editedConsultMed.value };
  console.log('PAYLOADDD', payload)
  if (
    !payload.Consultation_Id ||
    !payload.medicine_ID ||
    !payload.quantity
  ) {
    alert("Please fill in all fields before saving.");
    return;
  }

  const formData = formatToUrlEncoded(payload);

  axiosClient
    .put(`/consulted_medication/${payload.prescription_Id}`, formData)
    .then((res) => {
      alert("Consulted Medication was successfully edited.");
      closeAddConsultMedDialog();
      router.go();
    })
    .catch((error) => {
      console.error("Error editing medicine:", error);
    });
};

/** Delete Consult Med */
const deleteConsultMed = (prescription_Id) => {
  console.log('prescription_Id', prescription_Id)
  if (!confirm("Are you sure you want to delete this?")) return;

  axiosClient
    .delete(`/consulted_medication/${prescription_Id}`)
    .then((res) => {
      alert("Consulted Medication was successfully deleted.");
      router.go();
    })
    .catch((error) => {
      console.error("Error deleting medicine:", error);
    });
};
</script>

<style>
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
  width: 95%;
  height: max-content;
  backdrop-filter: blur(3px);
  background-color: rgba(255, 255, 255, 0.5);
  padding: 10px 30px 20px 10px;
  border-radius: 5px;
}

.select-box { 
  font-size: 16px; /* Adjust font size as needed */
  height: 38px;
  border: 1px solid #ccc; /* Add a border */
  border-radius: 4px; /* Add border radius for rounded corners */
  background-color: #fff; /* Set background color */
  color: #333; /* Set text color */
  width: 100%; /* Set width */
}
</style>
