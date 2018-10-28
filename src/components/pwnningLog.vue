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
    background-color: rgba(180, 240, 255, 0.6);
  }
  .Web
  {
    background-color: rgba(208, 255, 170, 0.6);
  }
  .Misc
  {
    background-color: rgba(52, 164, 255, 0.6);
  }
  .Crypto
  {
    background-color: rgba(36, 255, 130, 0.6);
  }
  .Re
  {
    background-color: rgba(190, 255, 68, 0.6);
  }
  .pwnning-log
  {
    font-family: "Courier 10 Pitch";
    z-index: 1;
    // background-color: rgba(255, 255, 255, 0.6);
    margin: 2rem 2%;
    display: flex;
    justify-content: space-between;
    width: 92%;
    font-size: 1.5rem;
    text-align: center;
    padding: 1rem;
    white-space: nowrap;
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
