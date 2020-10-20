<template>
  <div class="container mt-3">
    <picker v-if="!selectedTime" />
    
    <div class="row" v-if="selectedTime && !bookingSuccess">
      <div class="col">
        <b-card>
          <b-card-title class="mb-4">
            Book your appointment now: {{ selectedTime }} <a href="" @click.prevent="resetSelectedTime">Change</a>
          </b-card-title>
          <b-card-text>
            <b-form @submit.prevent="onSubmit" v-if="!bookingSuccess">
              <b-form-group id="first_name" label="First Name:" label-for="first_name">
                <b-form-input
                  id="first_name"
                  v-model="form.first_name"
                  required
                  placeholder="Enter your first name"
                ></b-form-input>
              </b-form-group>

              <b-form-group id="last_name" label="Last Name:" label-for="last_name">
                <b-form-input
                  id="last_name"
                  v-model="form.last_name"
                  required
                  placeholder="Enter your last name"
                ></b-form-input>
              </b-form-group>

              <b-form-group id="cellphone" label="Cellphone Number:" label-for="cellphone">
                <b-form-input
                  id="cellphone"
                  v-model="form.cellphone"
                  required
                  placeholder="Enter your cellphone number"
                ></b-form-input>
              </b-form-group>

              <b-form-group
                id="email"
                label="Email Address:"
                label-for="email"
              >
                <b-form-input
                  id="email"
                  v-model="form.email"
                  type="email"
                  required
                  placeholder="Enter your email address"
                ></b-form-input>
              </b-form-group>

              <b-form-group id="treatment_id" label="Reason for Appointment:" label-for="treatment_id">
                <b-form-select
                  id="reason"
                  v-model="form.treatment_id"
                  :options="reasons"
                  required
                ></b-form-select>
              </b-form-group>

              <b-form-checkbox
                id="terms"
                v-model="form.terms"
                name="terms"
                value="true"
                unchecked-value="false"
              >
                Do you accept our Terms & Conditions and privacy policy?
              </b-form-checkbox>

              <b-button type="submit" variant="primary" class="mt-4">Request Appointment Now</b-button>

            </b-form>
          </b-card-text>
        </b-card>
      </div>
    </div>

    <div class="row" v-if="bookingSuccess"><h2>Thank you! Your booking was successful.</h2></div>
  </div>
</template>

<script>
import picker from "@/components/Picker";

export default {
  data: function() {
    return {
      form: {
        first_name: '',
        last_name: '',
        cellphone: '',
        email: '',
        treatment_id: '',
        terms: false
      },
      pharmacy_id: null,
      reasons: [],
      bookingSuccess: false
    }
  },
  components: {
    picker
  },
  mounted() {
    this.pharmacy_id = this.$route.params.id

    this.getReasons()
  },
  methods: {
    onSubmit: async function() {
      if (this.form.terms == false) {
        alert("You must accept the Terms & Conditions and privacy policy to continue")

        return false
      }

      var formData = {}

      formData.patient = this.form.first_name + ' ' + this.form.last_name
      formData.pharmacy_id = this.pharmacy_id
      formData.start = this.selectedTime
      formData.treatment_id = this.form.treatment_id
      formData.notes = "Website Booking Form"
      formData.email = this.form.email
      formData.cellphone = this.form.cellphone

      formData = JSON.stringify(formData)

      const { data } = await this.$axios.$post(
        "calendar",
        formData,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json;charset=UTF-8",
            "Access-Control-Allow-Origin": "*"
          }
        }
      );

      console.log(data)

      if (data.id) {
        this.bookingSuccess = true
      }
    },
    resetSelectedTime: function() {
      this.selectedTime = null;
    },
    getReasons: async function() {
      const { data } = await this.$axios.$post(
        "calendar/treatments",
        {
          pharmacy_id: this.pharmacy_id
        },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json;charset=UTF-8",
            "Access-Control-Allow-Origin": "*"
          }
        }
      );

      this.reasons = data.treatments;
    },
  },
  computed: {
    selectedTime: {
      get: function() {
        return this.$store.state.selectedTime
      },
      set: function(val) {
        this.$store.commit('setSelectedTime', val);
      }
    }
  },
};
</script>

<style>

</style>
