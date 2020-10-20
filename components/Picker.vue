<template>
  <b-overlay :show="showLoader" rounded="sm">
    <b-card>
      <b-card-title>
        <label class="mb-2"
          >Select a date to continue</label
        >
        <b-form-datepicker
          :min="min"
          v-model="activeDate"
          class="mb-4"
        ></b-form-datepicker>
      </b-card-title>

      <div class="row" v-if="!selectedTime">
        <div
          class="col-md-2"
          v-bind:key="index"
          v-for="(slot, index) in timeSlots"
        >
          <a
            :class="slot.available ? 'available' : 'unavailable'"
            class="select_date"
            @click.prevent="selectTimeSlot(slot.start, $event)"
            href=""
          >
            <b-alert :variant="slot.available ? 'success' : 'warning'" show>{{
              slot.start.slice(0, -3)
            }}</b-alert>
          </a>
        </div>
        <div class="col">
          <b-alert v-if="timeSlots.length == 0" variant="warning" show>No time slots available for {{ activeDate }}. Please select a different date.</b-alert>
        </div>
      </div>
    </b-card>
  </b-overlay>
</template>

<script>
import axios from "axios";

export default {
  name: "picker",
  data: function() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const minDate = new Date(today);

    minDate.setMonth(minDate.getMonth());
    minDate.setDate(minDate.getDate() + 1);

    return {
      min: minDate,
      showLoader: false,
      timeSlots: [],
      activeDate: new Date(new Date().getFullYear(),new Date().getMonth() , new Date().getDate()+1).toISOString().substr(0, 10),
      selectedTime: null,
      treatments: null,
      pharmacy_id: null
    };
  },
  methods: {
    getTimeSlots: async function() {
      this.showLoader = true;
      const { data } = await this.$axios.$post(
        "calendar/slots",
        {
          date: this.activeDate,
          pharmacy_id: parseInt(this.pharmacy_id)
        },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json;charset=UTF-8",
            "Access-Control-Allow-Origin": "*"
          }
        }
      );

      this.timeSlots = data.slots;
      this.showLoader = false;
    },
    selectTimeSlot: function(time) {
      var r = confirm("You've selected time slot "+time+", would you like to continue? Click cancel to select a different time slot.");

      if (r) {
        this.selectedTime = time;

        this.$store.commit('setSelectedTime', time);
      }
    },
  },
  mounted() {
    this.pharmacy_id = this.$route.params.id

    this.getTimeSlots();
  },
  watch: {
    activeDate: function(val) {
      this.selectedTime = null;
      this.getTimeSlots();
    }
  }
};
</script>

<style>
a.unavailable {
  cursor: not-allowed;
}

a.select_date:hover {
  text-decoration: none;
}

.title {
  font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
