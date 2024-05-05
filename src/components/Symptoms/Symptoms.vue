<template>
  <div class="bgImg">
    <div class="container">
      <h1>Symptoms</h1>
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
          @click="openAddSymptomDialog"
        />
      </div>
      <DataTable
        :value="filteredSymptoms"
        paginator
        :rows="5"
        :rowsPerPageOptions="[5, 10, 20, 50]"
        stripedRows
        tableStyle="min-width: 80rem;"
      >
        <Column
          headerStyle="background-color: #FF6EC7; color:white"
          field="illness_Id"
          header="Illness ID"
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
          field="illness"
          header="Illness"
          sortable
        ></Column>
        <Column
          headerStyle="background-color: #FF6EC7; color:white"
          header="Actions"
        >
          <template #body="symptom">
            <div style="display: flex; gap: 2px; flex-direction: column">
              <div style="display: flex; gap: 2px">
                <Button
                  label="Edit"
                  icon="pi pi-pencil"
                  class="p-button-info"
                  @click="openEditSymptomDialog(symptom)"
                />
                <Button
                  label="Delete"
                  icon="pi pi-trash"
                  class="p-button-danger"
                  @click="deleteSymptom(symptom.data.illness_Id)"
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
        v-if="isAddSymptomDialogOpen"
        visible
        @onHide="closeAddSymptomDialog"
        :closable="false"
      >
        <template #container="{ closeCallback }">
          <div
            style="background-color: #fd9bd8; padding: 10px; border-radius: 5px"
          >
            <h2 style="margin: 0; color: white">Add Symptom</h2>
            <form @submit.prevent="saveAddedSymptom">
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
                    <label for="illness">Illness:</label>
                    <InputText id="illness" v-model="newSymptom.illness" />
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
                  @click="closeAddSymptomDialog"
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
        v-if="isEditSymptomDialogOpen"
        visible
        @onHide="closeEditSymptomDialog"
        :closable="false"
      >
        <template #container="{ closeCallback }">
          <div
            style="background-color: #fd9bd8; padding: 10px; border-radius: 5px"
          >
            <h2 style="margin: 0; color: white">Edit Symptom</h2>
            <form @submit.prevent="saveEditedSymptom">
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
                    <label for="illness">Illness:</label>
                    <InputText id="illness" v-model="editedSymptom.illness" />
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
                  @click="closeEditSymptomDialog"
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
import Dialog from "primevue/dialog";
import { formatToUrlEncoded } from "../../helpers/formatter";
import { useRouter } from "vue-router";

const router = useRouter();

/** Fetch Symptoms */
const symptoms = ref([]);
const isLoading = ref(false);
const fetchSymptoms = async () => {
  isLoading.value = true;
  axiosClient
    .get("/manage_illness/")
    .then(({ data }) => {
      symptoms.value = data;
    })
    .catch((error) => {
      console.error("Error fetching symptoms:", error);
    })
    .finally(() => {
      isLoading.value = false;
    });
};
onMounted(fetchSymptoms);

const searchQuery = ref("");
const filteredSymptoms = computed(() => {
  return symptoms.value.filter((symptom) => {
    const illness = symptom.illness.toLowerCase();
    return illness.includes(searchQuery.value.toLowerCase());
  });
});

/** Add Symptom */
const isAddSymptomDialogOpen = ref(false);
const newSymptom = ref({});
const openAddSymptomDialog = () => {
  isAddSymptomDialogOpen.value = true;
};
const closeAddSymptomDialog = () => {
  isAddSymptomDialogOpen.value = false;
};
const saveAddedSymptom = () => {
  const payload = { ...newSymptom.value };
  if (!payload.illness) {
    alert("Please fill in all fields before saving.");
    return;
  }
  payload.nurseID = 1; //Hardcoded
  const formData = formatToUrlEncoded(payload);

  axiosClient
    .post("/manage_illness/", formData)
    .then((res) => {
      alert("Symptom was successfully added.");
      closeAddSymptomDialog();
      router.go();
    })
    .catch((error) => {
      console.error("Error adding symptom:", error);
    });
};

/** Edit Symptom */
const isEditSymptomDialogOpen = ref(false);
const editedSymptom = ref({});
const openEditSymptomDialog = (val) => {
  editedSymptom.value = val.data;
  isEditSymptomDialogOpen.value = true;
};
const closeEditSymptomDialog = () => {
  isEditSymptomDialogOpen.value = false;
};
const saveEditedSymptom = () => {
  const payload = { ...editedSymptom.value };
  if (!payload.illness) {
    alert("Please fill in all fields before saving.");
    return;
  }
  payload.nurseID = 1; //Hardcoded
  const formData = formatToUrlEncoded(payload);

  axiosClient
    .put(`/manage_illness/${payload.illness_Id}`, formData)
    .then((res) => {
      alert("Symptom was successfully edited.");
      closeAddSymptomDialog();
      router.go();
    })
    .catch((error) => {
      console.error("Error editing symptom:", error);
    });
};

/** Delete Symptom */
const deleteSymptom = (illness_Id) => {
  if (!confirm("Are you sure you want to delete this?")) return;

  axiosClient
    .delete(`/manage_illness/${illness_Id}`)
    .then((res) => {
      alert("Symptom was successfully deleted.");
      router.go();
    })
    .catch((error) => {
      console.error("Error deleting symptom:", error);
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
