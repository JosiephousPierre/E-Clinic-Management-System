<template>
  <div class="bgImg">
    <div class="container">
      <h1>Medicines</h1>
      <div
        style="
          margin-bottom: 10px;
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
        "
      >
        <InputText
          style="margin-bottom: 15px; width: 300px"
          v-model="searchQuery"
          placeholder="Search"
        />
        <Button
          label="Add"
          icon="pi pi-plus"
          class="p-button-primary"
          @click="openAddMedicineDialog"
        />
      </div>
      <DataTable
        :value="filteredMedicines"
        paginator
        :rows="5"
        :rowsPerPageOptions="[5, 10, 20, 50]"
        stripedRows
        tableStyle="min-width: 80rem;"
      >
        <Column
          headerStyle="background-color: #FF6EC7; color:white"
          field="medicine_ID"
          header="Medicine ID"
          sortable
        ></Column>
        <Column
          headerStyle="background-color: #FF6EC7; color:white"
          field="nurseID"
          header="Nurse ID"
          sortable
        ></Column>
        <Column
          headerStyle="background-color: #FF6EC7; color:white"
          field="brandName"
          header="Brand Name"
          sortable
        ></Column>
        <Column
          headerStyle="background-color: #FF6EC7; color:white"
          field="drugName"
          header="Drug Name"
          sortable
        ></Column>
        <Column
          headerStyle="background-color: #FF6EC7; color:white"
          field="expiration"
          header="Expiration Date"
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
          <template #body="medicine">
            <div style="display: flex; gap: 2px; flex-direction: column">
              <div style="display: flex; gap: 2px">
                <Button
                  label="Edit"
                  icon="pi pi-pencil"
                  class="p-button-info"
                  @click="openEditMedicineDialog(medicine)"
                />
                <Button
                  label="Delete"
                  icon="pi pi-trash"
                  class="p-button-danger"
                  @click="deleteMedicine(medicine.data.medicine_ID)"
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
        v-if="isAddMedicineDialogOpen"
        visible
        @onHide="closeAddMedicineDialog"
        :closable="false"
      >
        <template #container="{ closeCallback }">
          <div
            style="background-color: #fd9bd8; padding: 10px; border-radius: 5px"
          >
            <h2 style="margin: 0; color: white">Add Medicine</h2>
            <form @submit.prevent="saveAddedMedicine">
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
                    <label for="drugName">Drug Name:</label>
                    <InputText id="drugName" v-model="newMedicine.drugName" />
                  </div>
                  <div
                    style="
                      flex: 1;
                      display: flex;
                      flex-direction: column;
                      margin-bottom: 10px;
                    "
                  >
                    <label for="brandName">Brand Name:</label>
                    <InputText id="brandName" v-model="newMedicine.brandName" />
                  </div>
                  <div
                    style="
                      flex: 1;
                      display: flex;
                      flex-direction: column;
                      margin-bottom: 10px;
                    "
                  >
                    <label for="expiration">Expiration:</label>
                    <Calendar
                      dateFormat="dd/mm/yy"
                      id="expiration"
                      v-model="newMedicine.expiration"
                      showIcon
                    />
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
                      v-model="newMedicine.quantity"
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
                  @click="closeAddMedicineDialog"
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

      <!-- Edit Dialog -->
      <Dialog
        :pt="{
          mask: {
            style: 'backdrop-filter: blur(2px)',
          },
        }"
        style="padding: 0"
        v-if="isEditMedicineDialogOpen"
        visible
        @onHide="closeEditMedicineDialog"
        :closable="false"
      >
        <template #container="{ closeCallback }">
          <div
            style="background-color: #fd9bd8; padding: 10px; border-radius: 5px"
          >
            <h2 style="margin: 0; color: white">Edit Medicine</h2>
            <form @submit.prevent="saveEditedMedicine">
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
                    <label for="drugName">Drug Name:</label>
                    <InputText
                      id="drugName"
                      v-model="editedMedicine.drugName"
                    />
                  </div>
                  <div
                    style="
                      flex: 1;
                      display: flex;
                      flex-direction: column;
                      margin-bottom: 10px;
                    "
                  >
                    <label for="brandName">Brand Name:</label>
                    <InputText
                      id="brandName"
                      v-model="editedMedicine.brandName"
                    />
                  </div>
                  <div
                    style="
                      flex: 1;
                      display: flex;
                      flex-direction: column;
                      margin-bottom: 10px;
                    "
                  >
                    <label for="expiration">Expiration:</label>
                    <Calendar
                      dateFormat="dd/mm/yy"
                      id="expiration"
                      v-model="editedMedicine.expiration"
                      showIcon
                    />
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
                      v-model="editedMedicine.quantity"
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
                  @click="closeEditMedicineDialog"
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

/** Fetch Medicines */
const medicines = ref([]);
const isLoading = ref(false);
const fetchMedicines = async () => {
  isLoading.value = true;
  axiosClient
    .get("/manage_med/")
    .then(({ data }) => {
      medicines.value = data;
    })
    .catch((error) => {
      console.error("Error fetching medicines:", error);
    })
    .finally(() => {
      isLoading.value = false;
    });
};
onMounted(fetchMedicines);

const searchQuery = ref("");
const filteredMedicines = computed(() => {
  return medicines.value.filter((medicine) => {
    const fullName =
      medicine.brandName.toLowerCase() + " " + medicine.drugName.toLowerCase();
    return fullName.includes(searchQuery.value.toLowerCase());
  });
});

/** Add Medicine */
const isAddMedicineDialogOpen = ref(false);
const newMedicine = ref({});
const openAddMedicineDialog = () => {
  isAddMedicineDialogOpen.value = true;
};
const closeAddMedicineDialog = () => {
  isAddMedicineDialogOpen.value = false;
};
const saveAddedMedicine = () => {
  const payload = { ...newMedicine.value };
  if (
    !payload.drugName ||
    !payload.brandName ||
    !payload.expiration ||
    !payload.quantity
  ) {
    alert("Please fill in all fields before saving.");
    return;
  }
  payload.nurseID = 1; //Hardcoded
  payload.expiration = formatDateToUTC(payload.expiration);
  const formData = formatToUrlEncoded(payload);

  axiosClient
    .post("/manage_med/", formData)
    .then((res) => {
      alert("Medicine was successfully added.");
      closeAddMedicineDialog();
      router.go();
    })
    .catch((error) => {
      console.error("Error adding medicine:", error);
    });
};

/** Edit Medicine */
const isEditMedicineDialogOpen = ref(false);
const editedMedicine = ref({});
const openEditMedicineDialog = (val) => {
  editedMedicine.value = val.data;
  isEditMedicineDialogOpen.value = true;
};
const closeEditMedicineDialog = () => {
  isEditMedicineDialogOpen.value = false;
};
const saveEditedMedicine = () => {
  const payload = { ...editedMedicine.value };
  if (
    !payload.drugName ||
    !payload.brandName ||
    !payload.expiration ||
    !payload.quantity
  ) {
    alert("Please fill in all fields before saving.");
    return;
  }
  payload.nurseID = 1; //Hardcoded
  payload.expiration = formatDateToUTC(payload.expiration);
  const formData = formatToUrlEncoded(payload);

  axiosClient
    .put(`/manage_med/${payload.medicine_ID}`, formData)
    .then((res) => {
      alert("Medicine was successfully edited.");
      closeAddMedicineDialog();
      router.go();
    })
    .catch((error) => {
      console.error("Error editing medicine:", error);
    });
};

/** Delete Medicine */
const deleteMedicine = (medicine_ID) => {
  if (!confirm("Are you sure you want to delete this?")) return;

  axiosClient
    .delete(`/manage_med/${medicine_ID}`)
    .then((res) => {
      alert("Medicine was successfully deleted.");
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
</style>
