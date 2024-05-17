<template>
  <div class="bgImg">
    <div class="container">
      <h1>Manage Patients</h1>
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
          @click="openAddManageDialog"
        />
        

      </div>

      <DataTable
        :value="filteredStudents"
        paginator
        :rows="5"
        :rowsPerPageOptions="[5, 10, 20, 50]"
        tableStyle="min-width: 50rem;"
      >
        <Column
          headerStyle="background-color: #FF6EC7; color:white"
          field="student_Id"
          header="Student ID"
          sortable
          w\expander
        ></Column>
        <Column
          headerStyle="background-color: #FF6EC7; color:white"
          field="student_Lname"
          header="Last Name"
          sortable
        ></Column>
        <Column
          headerStyle="background-color: #FF6EC7; color:white"
          field="student_Fname"
          header="First Name"
          sortable
        ></Column>
        <Column
          headerStyle="background-color: #FF6EC7; color:white"
          field="course"
          header="Course"
          sortable
        ></Column>
        <Column
          headerStyle="background-color: #FF6EC7; color:white"
          header="Actions"
        >
          <template #body="rowData">
            <Button
              label="Add"
              severity="success"
              icon="pi pi-check"
              :loading="loading"
              @click="checkStudent(rowData)"
            />
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
        v-if="isAddManageDialogOpen"
        visible
        @onHide="closeAddManageDialog"
        :closable="false"
      >
        <template #container="{ closeCallback }">
          <div
            style="background-color: #fd9bd8; padding: 10px; border-radius: 5px"
          >
            <h2 style="margin: 0; color: white">Add Student</h2>
            <form @submit.prevent="saveAddedManage">
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
                    <label for="drugName">Student First Name:</label>
                    <InputText id="drugName" v-model="newManage.student_Fname" />
                  </div>

                  <div
                    style="
                      flex: 1;
                      display: flex;
                      flex-direction: column;
                      margin-bottom: 10px;
                    "
                  > 
                    <label for="drugName">Student Last Name:</label>
                    <InputText id="drugName" v-model="newManage.student_Lname" />
                  </div>

                  <div
                    style="
                      flex: 1;
                      display: flex;
                      flex-direction: column;
                      margin-bottom: 10px;
                    "
                  > 
                    <label for="drugName">Course:</label>
                    <InputText id="drugName" v-model="newManage.course" />
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
                  @click="closeAddManageDialog"
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
      <div
        v-if="filteredStudents.length === 0"
        style="text-align: center; margin-top: 10px"
      >
        No records found
      </div>
    </div>
  </div>
</template>

<script setup>
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import { ref, computed, onMounted } from "vue";
import { formatToUrlEncoded } from "../../helpers/formatter";
import { useRouter } from "vue-router";
import axiosClient from "../../utils/axiosClient";
import { useConsultStore } from "../../store/consult";
import { isStudentInConsultationList } from "../../helpers/checker";

const router = useRouter();

const searchQuery = ref("");

/** For fetching students */
const students = ref([]);
const isLoading = ref(false);
const fetchStudents = async () => {
  isLoading.value = true;
  axiosClient
    .get("/manage/")
    .then(({ data }) => {
      students.value = data;
      console.log(students.value);
    })
    .catch((error) => {
      console.error("Error fetching students:", error);
    })
    .finally(() => {
      isLoading.value = false;
    });
};

/** Add Manage */
const isAddManageDialogOpen = ref(false);
const newManage = ref({});
const openAddManageDialog = () => {
  isAddManageDialogOpen.value = true;
};
const closeAddManageDialog = () => {
  isAddManageDialogOpen.value = false;
  alert("Adding Manage has been canceled.");
};
const saveAddedManage = () => {
  const payload = { ...newManage.value };
  if (
    !payload.student_Lname ||
    !payload.student_Fname ||
    !payload.course
  ) {
    alert("Please fill in all fields before saving.");
    return;
  }

  payload.nurseID = 2; // Hardcode
  const formData = formatToUrlEncoded(payload);

  axiosClient
    .post("/manage/", formData)
    .then((res) => {
      alert("Patient was successfully added.");
      closeAddManageDialog();
      router.go();
    })
    .catch((error) => {
      console.error("Error adding patient:", error.response.data.detail);

      // Will print the error message if the add consult med fails
      alert(error.response.data.detail);
    });
};

// For displaying students
const filteredStudents = computed(() => {
  return students.value.filter((student) => {
    const searchRegex = new RegExp(searchQuery.value, "i");
    const { student_Id, student_Fname, student_Lname, course } = student;
    return (
      searchRegex.test(student_Id.toString()) ||
      searchRegex.test(student_Lname) ||
      searchRegex.test(student_Fname) ||
      searchRegex.test(course)
    );
  });
});

onMounted(fetchStudents);

function getRawDataFromProxy(reactiveObject) {
  const rawData = {};
  const keys = Object.keys(reactiveObject);

  for (const key of keys) {
    rawData[key] = reactiveObject[key];
  }

  return rawData;
}

const storeConsult = useConsultStore();
function checkStudent(rowData) {
  const plainRowData = getRawDataFromProxy(rowData.data);
  const isAlreadyAdded = isStudentInConsultationList(
    storeConsult.getConsultations,
    plainRowData
  );

  if (!isAlreadyAdded) {
    storeConsult.addConsultation(plainRowData);
    router.push("/consultation");
    alert("Successfully Added");
  } else {
    alert("Already added");
  }
}
</script>

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
