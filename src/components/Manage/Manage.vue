<template>
  <div class="bgImg">
    <div class="container">
      <h1>Manage Patients</h1>
      <InputText
        style="margin-bottom: 15px; width: 300px"
        v-model="searchQuery"
        placeholder="Search"
      />
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
import InputText from "primevue/inputtext";
import { ref, computed, onMounted } from "vue";
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
