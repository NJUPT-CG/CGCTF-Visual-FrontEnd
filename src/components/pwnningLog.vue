<template>
  <div>
  <div class="pwnning-log" v-bind:class="attack_record.class">
    <span class="src-team">{{ attack_record.name }}</span>
    <span class="pwned"> SOLVED </span>
    <span class="challenge">{{ attack_record.challenge }}</span>
    <span class="time"> {{ attack_record.time }} </span>
    <span class="type"> {{attack_record.class}} </span>
    <span class="score"> +{{ attack_record.score }}pts </span>
  </div>
  </div>
</template>
<script>
export default {
  name: 'pwnningLog',
  props: {
    attack_record: {
      type: Object,
      required: true
    }
  }
}
</script>

<style>
  .Pwn
  {
    /*background-color: #262e48;*/
  }
  .Web
  {
    /*background-color: #3f4b6c;*/
  }
  .Misc
  {
    /*background-color: #3f4b6c;*/
  }
  .Crypto
  {
    /*background-color: #262e48;*/
  }
  .Re
  {
    /*background-color: #3f4b6c;*/
  }
  .pwnning-log
  {
    font-face: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    z-index: 1;
    /*background-color: rgba(255, 255, 255, 0.6);*/
    margin: 0.8rem 2%;
    display: flex;
    justify-content: space-between;
    width: 92%;
    font-size: 1.2rem;
    text-align: center;
    padding: 1rem;
    white-space: nowrap;
    /*-webkit-border-radius: 20px;*/
    /*-moz-border-radius: 20px;*/
    /*border-radius: 20px;*/
    color: white;
    border-bottom: 1px solid grey;
  }
  .src-team
  {
    order: 1;
    width: 20%;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .pwned
  {
    order: 2;
    width: 8%;
  }
  .challenge
  {
    order: 3;
    width: 18%;
  }
  .time
  {
    order: 4;
    width: 25%;
  }
  .type
  {
    order: 5;
    width: 6%;
  }
  .score
  {
    order: 6;
    width: 10%;
  }
</style>
