<template>
  <div id="pwnning_wall">
    <div class="pwnning-title">
      PWNNING WALL
    </div>
    <div v-for="(item, key, index) in attack_records" :key="index">
      <pwnning-log :attack_record="item"></pwnning-log>
    </div>
  </div>
</template>
<script>
import PwnningLog from '@/components/pwnningLog'
export default {
  name: 'pwnningWall',
  components: {PwnningLog},
  data: () => ({
    attack_records: {
      '0':
        { 'name': 'Nu1L', 'challenge': 'Not Only Wireshark', 'time': '2018-10-09 11:57:27', 'score': '333' },
      '1':
        { 'name': 'Nu1L', 'challenge': 'Just PY', 'time': '2018-10-09 11:56:44', 'score': '400' }
    }
  }),
  methods: {
    async loadData () {
      this.$ajax.get('https://nctf.x1c.club/SubmitsBoard?api=1').then(res => {
        // console.log(res.data)
        // this.set(this.attack_records,, res.data);
        this.attack_records = res.data
        // this.$forceUpdate()
      })
    },
    dataSort: function (a, b) {
      return b.time.date - a.time.date
    }
  },
  async mounted () {
    // await this.$ajax.get('http://192.168.31.15/CCTF/CGCTF_competition_ver/CG-CTF/public/SubmitsBoard?api=1').then(function (res) {
    //  console.log(res.data[0])
    // })
    await this.loadData()
    setInterval(() => {
      this.loadData()
    }, 10000)
  }
}
</script>

<style>
  .pwnning-title
  {
    font-family: "Courier 10 Pitch";
    font-size: 3rem;
  }
  body
  {
    background-color: #334477;
    background-repeat: no-repeat;
    background-size: cover;
  }
</style>
