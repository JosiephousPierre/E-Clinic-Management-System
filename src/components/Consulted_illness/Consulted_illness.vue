<template>
    <div class="bgImg">
      <div class="container">
        <h1>Consulted Illness</h1>
        <p>This is the Consulted Illness page of your application.</p>
        <!--
        <div class="search-container">
          <input type="text" v-model="searchQuery" placeholder="Search consultedillnesslist" />
        </div>
        -->
        <DataTable
          :value="consultedillnesslist"
          paginator
          :rows="5"
          :rowsPerPageOptions="[5, 10, 20, 50]" 
          stripedRows
          tableStyle="min-width: 80rem;"
        >
          <Column
              headerStyle="background-color: #FF6EC7; color:white"
              field="consIllness_Id"
              header="Consult Illness ID"
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
              field="illness_Id"
              header="Illness ID"
              sortable
            ></Column>
          -->
          <Column
            headerStyle="background-color: #FF6EC7; color:white"
            field="illness"
            header="Illness"
            sortable
          ></Column>
        </DataTable>
      </div>
    </div>
  </template>
  
  <script setup>
  import DataTable from "primevue/datatable";
  import Column from "primevue/column";
  import { ref, computed, onMounted } from "vue";
  import axiosClient from "../../utils/axiosClient";
  import { formatDate, formatTime } from "../../helpers/formatter";
  
  const searchQuery = ref("");
  
  /** For fetching consultedillnesslist */
  const consultedillnesslist = ref([]);
  const isLoading = ref(false);
  /*const fetchConsultIllness = async () => {
    isLoading.value = true;
    axiosClient
      .get("/consulted_illness/")
      .then(({ data }) => {
        consultedillnesslist.value = data;
        console.log(consultedillnesslist.value);
      })
      .catch((error) => {
        console.error("Error fetching consultedillnesslist:", error);
      })
      .finally(() => {
        isLoading.value = false;
      });
  };*/

  const fetchConsultIllness = async () => {
  isLoading.value = true;
  try {
    const { data } = await axiosClient.get("/consulted_illness/");
    console.log('CONSULT MED DATA', data);
    for (const ill of data) {
      try {
        console.log('Fetching medicine for ID:', ill.illness_Id);
        const response = await axiosClient.get(`/manage_illness/${ill.illness_Id}`);
        console.log('Received response:', response.data);
        const illness = response.data.illness;
        consultedillnesslist.value.push({
          ...ill,
          illness: illness,
        });
      } catch (error) {
        console.error(`Error fetching illness for illness ID ${ill.illness_Id}:`, error);
      }
    }
  } catch (error) {
    console.error("Error fetching consulted_medications:", error);
  } finally {
    isLoading.value = false;
  }
};
  onMounted(fetchConsultIllness);
  
  /*const filteredConsultedIllness = computed(() => {
    return consultedillnesslist.value.filter((record) => {
      const fullName =
        record.student_Fname.toLowerCase() +
        " " +
        record.student_Lname.toLowerCase();
      return fullName.includes(searchQuery.value.toLowerCase());
    });
  });*/
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
    width: 95%;
    height: max-content;
    backdrop-filter: blur(3px);
    background-color: rgba(255, 255, 255, 0.5);
    padding: 10px 30px 20px 10px;
    border-radius: 5px;
    margin-top: 20px;
  }
  .consultedillnesslist {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
  }
  
  h1 {
    font-size: 24px;
    margin-bottom: 10px;
  }
  
  p {
    font-size: 16px;
    margin-bottom: 20px;
  }
  
  .search-container {
    margin-bottom: 20px;
  }
  
  input[type="text"] {
    padding: 10px;
    width: 300px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  .p-datatable {
    margin-top: 20px;
  }
  </style>
  