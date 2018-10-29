<template>
<div id="trends">
  <div class="chart-container">
  <div id="chart" style="height: 600px;"></div>
    <div class="bt-container">
      <button id="change_njupt" class="bt one" v-on:click="changeClass('fresh')">NJUPT Teams</button>
      <button id="change_social" class="bt one" v-on:click="changeClass('old')">Social Teams</button>
      <button id="change_all" class="bt one" v-on:click="changeClass('all')">All</button>
    </div>
    <div class="bt-container">
      <button id="change_10" class="bt one" v-on:click="changeTeamCount(10)">Top 10</button>
      <button id="change_20" class="bt one" v-on:click="changeTeamCount(20)">Top 20</button>
      <button id="change_10000" class="bt one" v-on:click="changeTeamCount(10000)">Top 10000</button>
    </div>
  </div>
  <div class="container">
  <table id="score_table" class="score_table">
    <thead>
    <tr>
      <td class=" rank_td thead_td">Rank</td>
      <td class="name_td thead_td">Team name</td>
      <td class="score_num_td thead_td">Score</td>
      <td class="cnt_td thead_td">Solved count</td>
      <td class="submit_td thead_td" v-for="(item, key, index) in challenges" :key="index">
        {{item.title}}<br />
        {{item.score}} pts<br />
        {{item.solversCount}} solves<br />
      </td>
    </tr>
    </thead>
    <tbody>
    <tr v-for="(item, key, index) in team_logs" :key="index">
      <td class="score_td metadata rank_td">{{item.rank}}</td>
      <td class="score_td metadata name_td">{{item.name}}</td>
      <td class="score_td metadata score_num_td">{{item.totalScore}}</td>
      <td class="score_td metadata cnt_td">{{item.solve_cnt}}</td>
      <td class="score_td submit_td" v-for="(x, key, index) in item.solve_log" :key="index">
        <div class="submit" v-bind:class="{score_solved : x.srank !== 0, score_firstblood: x.srank === 1}">
          <div style="font-size: 16px;">{{x.srank == 0 ? '' : x.srank}}</div>
          <div>{{x.time == 0 ? '' : x.time + 's' }}</div>
        </div>
      </td>
    </tr>
    </tbody>
  </table>
  </div>
</div>
</template>

<script>
export default {
  name: 'trends',
  components: {},
  data: () => ({
    challenges: [],
    team_logs: []
  }),
  methods: {
    async getTopTeams (className, teamCount) {
      var teamsData = []
      var apiAddr = 'https://nctf.x1c.club/scoreboard?api=' + teamCount.toString() + '&class=' + className
      await this.$ajax.get(apiAddr).then(res => {
        // console.log(res.data)
        for (var i in res.data) {
          // console.log(item)
          var obj = {}
          obj.id = res.data[i].id
          obj.name = res.data[i].name
          obj.totalScore = res.data[i].totalScore
          obj.rank = res.data[i].rank
          teamsData.push(obj)
        }
        // console.log(teamsData)
      }).catch(error => {
        console.log(error)
      })
      this.team_logs = teamsData
      // console.log(this.team_logs)
      return teamsData
    },
    async loadTeamLog (teamId) {
      var submitData = []
      var dataForTable
      var apiAddr = 'https://nctf.x1c.club/teamdetail/' + teamId + '?api=1'
      await this.$ajax.get(apiAddr).then(res => {
        var currentScore = 0
        dataForTable = new Array(this.challenges.length)
        for (var x in this.challenges) {
          var id = this.challenges[x].id
          var o = res.data.find(function (element) {
            return element.pivot.challengeid === this
          }, id)
          if (o !== undefined) {
            dataForTable[x] = {
              srank: o.srank,
              time: (new Date(o.pivot.created_at) - new Date(document.startTime)) / 1000
            }
          } else {
            dataForTable[x] = {
              srank: 0,
              time: 0
            }
          }
        }
        // console.log(res.data)
        for (var i in res.data.reverse()) {
          var obj = []
          // obj.date = res.data[i].pivot.created_at
          currentScore += res.data[i].score
          if (res.data[i].srank <= 3) {
            currentScore += 60 / res.data[i].srank
          }
          obj = [res.data[i].pivot.created_at, currentScore]
          submitData.push(obj)
        }
        // console.log(submitData)
      }).catch(error => {
        console.log(error)
      })
      return {
        dataForCharts: submitData,
        dataForTable: dataForTable
      }
    },
    async buildChart (data) {
      var options = {
        title: {
          text: 'NCTF 2018',
          left: '20px',
          top: '20px',
          textStyle: {
            color: 'white'
          }
        },
        legend: {
          show: true,
          orient: 'vertical',
          left: '3%',
          top: '80px',
          width: '40px',
          textStyle: {
            color: 'white'
          }
        },
        tooltip: {},
        grid: {
          left: '20%'
        },
        xAxis: {
          show: true,
          type: 'time',
          axisLine: {
            lineStyle: {
              color: 'white'
            }
          },
          axisLabel: {
            color: 'white'
          }
        },
        yAxis: {
          show: true,
          axisLine: {
            lineStyle: {
              color: 'white'
            }
          },
          axisLabel: {
            color: 'white'
          }
        },
        series: []
      }
      // document.chart.setOption(options)
      options.series = data
      document.chart.clear()
      // console.log(data)
      document.chart.setOption(options)
    },
    async loadData (className, teamCount) {
      await this.getChallenges()
      var teamList = await this.getTopTeams(className, teamCount)
      // console.log(teamList)
      if (teamList) {
        var chartData = []
        for (var i in teamList) {
          // console.log(teamList[i])
          var obj = {}
          obj.name = teamList[i].name.substr(0, 20)
          obj.type = 'line'
          obj.symbolSize = 7
          obj.lineStyle = {}
          obj.lineStyle.width = 3
          obj.connectNulls = true
          var o = await this.loadTeamLog(teamList[i].id)
          obj.data = o.dataForCharts
          this.team_logs[i].solve_log = o.dataForTable
          this.team_logs[i].solve_cnt = (function () {
            var cnt = 0
            for (i in o.dataForTable) {
              if (o.dataForTable[i].srank !== 0) {
                cnt++
              }
            }
            return cnt
          }())
          obj.data.unshift([document.startTime, 0])
          if (obj.data) {
            chartData.push(obj)
          } else {
            console.log('Error while loading chart data')
            return null
          }
          // console.log(chartData)
        }
      } else {
        console.log('Error while loading team data')
        return null
      }
      // console.log(chartData)
      document.chart = this.$chart.init(document.getElementById('chart'))
      this.buildChart(chartData)
    },
    async changeClass (className) {
      document.className = className
      await this.loadData(className, document.teamCount)
      this.$forceUpdate()
    },
    async changeTeamCount (teamCount) {
      document.teamCount = teamCount
      await this.loadData(document.className, teamCount)
      this.$forceUpdate()
    },
    async getChallenges () {
      var classes = ['Web', 'Re', 'Pwn', 'Crypto', 'Misc']
      var challenges = []
      for (var i in classes) {
        var obj = await this.getChallengesByClassName(classes[i])
        challenges = challenges.concat(obj)
        // console.log(obj)
      }
      console.log(challenges)
      this.challenges = challenges
    },
    async getChallengesByClassName (className) {
      var result = []
      await this.$ajax.get('https://nctf.x1c.club/api/challenges?class=' + className).then(res => {
        result = res.data
        // console.log(result)
      }).catch(error => {
        console.log(error)
      })
      // console.log(result)
      return result
    }
  },
  async mounted () {
    document.className = 'all'
    document.teamCount = 20
    document.startTime = '2018-10-15 21:41:00'
    await this.loadData('all', 20)
    this.$forceUpdate()
    console.log(this.team_logs)
  }
}
</script>

<style>
  :root {
    --color-dark:  #161616;
    --color-ocean:  #416dea;
    --color-grass: #3dd28d;
    --color-snow: #FFFFFF;
    --color-salmon: #F32C52;
    --color-sun: #feee7d;
    --color-alge: #7999a9;
    --color-flower: #353866;
    --color-smoke: #e4e4e4;

    --font-face: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  }
  body {
    background: linear-gradient(to right, #7856c4, #0a0496);
  }
  table
  {
    border-radius: 20px;
    border-collapse: collapse;
    overflow: hidden;
    box-shadow: 0 0 20px rgba(0,0,0,0.1);
    font-family: sans-serif;
    margin: 5%;
    width: 90%;
    table-layout: fixed;
    font-size: 14px;
    color: #fff;
    /*background: linear-gradient(to right, #c47fc3, #4b05c4);*/
  }
  thead
  {
    background-color: #c7c7bb;
    color: #fff;
    font-weight: bold;
    font-size: 14px;
  }
  tr
  {
    /*border-top: 1px solid white;*/
    border-bottom: 1px solid white;
    height: 50px;
  }
  .thead_td
  {
    background-color: #2a363b;
  }
  td
  {
    height: inherit;
  }
  .metadata
  {
    background-color: #262e48;
  }
  .score_td
  {
    background-color: #262e48;
    word-break: break-all;
    word-wrap: break-word;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    padding: 0px 0px 0px 0px;
  }
  .score_solved
  {
    background-color: #3f4b6c;
  }
  .score_firstblood
  {
    background-color: #424262;
  }
  .submit
  {
    display:flex;
    justify-content:center;
    align-items:center;
    flex-direction: column;
    font-size: 10px;
    height: inherit;
    vertical-align: middle;
  }
  .submit_td
  {
    width: 60px;
  }
  .score_num_td
  {
    width: 60px;
  }
  .cnt_td
  {
    width: 40px;
  }
  .rank_td
  {
    width: 40px;
  }
  .name_td
  {
    width: 100px;
  }
  .chart-container
  {
    width: 90%;
    margin-left: 5%;
    margin-right: 5%;
    background-color: #262e48;
    border-radius: 20px;
  }
  .bt-container{
    display: flex;
    justify-content: space-around;
    padding: 30px 0;
  }
  .bt{
    display: block;
    padding: 0 20px;
    height: 50px;
    width: 200px;
    line-height: 50px;
    border-radius: 4px;
    color: #FFF;
    border: 0;
    outline: 0;
    text-align: center;
    transition: .2s ease-out;
    cursor: pointer;
    overflow: hidden;
    position: relative;
    text-transform: uppercase;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    box-shadow: 0 2px 2px 0
    rgba(0,0,0,0.14),0 1px 5px 0                 rgba(0,0,0,0.12),0 3px 1px -2px               rgba(0,0,0,0.2);
  }

  .bt:hover{
    box-shadow: 0 3px 3px 0 rgba(0,0,0,0.14),0 1px 7px 0 rgba(0,0,0,0.12),0 3px 1px -1px rgba(0,0,0,0.2);
  }

  .bt:before {
    content: "";
    position: absolute;
    display: inline-block;
    vertical-align: middle;
    z-index: 1;
    will-change: opacity, transform;
    background-color: rgba(236, 240, 241, .3);
    top: 50%;
    left: 50%;
    border-radius: 100%;
    width: 0;
    padding-top: 0;
    transform: translate(-50%, -50%);
    -webkit-transform: translate(-50%, -50%);
    -moz-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    -o-transform: translate(-50%, -50%);
  }

  .bt:active:before {
    width: 120%;
    padding-top: 120%;
    transition: width .2s ease-out, padding-top .2s ease-out;
  }

  .one{
    background-color: #777777;
  }
  .one:hover{
    background-color: lighten(#2e3355,2);
  }

</style>
