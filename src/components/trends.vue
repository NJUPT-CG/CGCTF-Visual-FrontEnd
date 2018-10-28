<template>
<div id="trends">
  <div id="chart" style="height: 600px;"></div>
  <button id="change_njupt" v-on:click="changeClass('fresh')">NJUPT Teams</button>
  <button id="change_social" v-on:click="changeClass('old')">Social Teams</button>
  <button id="change_all" v-on:click="changeClass('all')">All</button>
  <br />
  <button id="change_10" v-on:click="changeTeamCount(10)">Top 10</button>
  <button id="change_20" v-on:click="changeTeamCount(20)">Top 20</button>
  <button id="change_10000" v-on:click="changeTeamCount(10000)">Top 10000</button>
  <table id="score_table" class="score_table">
    <thead>
    <tr>
      <td class="score_td rank_td">Rank</td>
      <td class="score_td">Team name</td>
      <td class="score_td score_num_td">Score</td>
      <td class="score_td cnt_td">Solved count</td>
      <td class="score_td submit_td" v-for="(item, key, index) in challenges" :key="index">
        {{item.title}}<br />
        {{item.score}} pts<br />
        {{item.solversCount}} solves<br />
      </td>
    </tr>
    </thead>
    <tbody>
    <tr v-for="(item, key, index) in team_logs" :key="index">
      <td class="score_td metadata rank_td">{{item.rank}}</td>
      <td class="score_td metadata">{{item.name}}</td>
      <td class="score_td metadata score_num_td">{{item.totalScore}}</td>
      <td class="score_td metadata cnt_td">{{item.solve_cnt}}</td>
      <td class="score_td submit_td" v-for="(x, key, index) in item.solve_log" :key="index">
        <div class="submit" v-bind:class="{score_solved : x.srank !== 0, score_firstblood: x.srank === 1}">
          <span style="display: block; font-size: 16px; color: #222;">{{x.srank == 0 ? '-' : x.srank}}</span>
          <span style="font-size: 10px;">{{x.time == 0 ? '' : x.time + 's'}}</span>
        </div>
      </td>
    </tr>
    </tbody>
  </table>
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
          text: 'NCTF 2018'
        },
        legend: {
          show: true,
          orient: 'vertical',
          left: '3%',
          top: '80px',
          width: '40px'
        },
        tooltip: {},
        grid: {
          left: '20%'
        },
        xAxis: {
          show: true,
          type: 'time'
        },
        yAxis: {
          show: true
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
  table
  {
    font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,sans-serif;
    margin: 5%;
    width: 90%;
    table-layout: fixed;
    font-size: 12px;
    border-collapse: inherit;
  }
  tr
  {
    height: 50px;
  }
  td
  {
    height: inherit;
  }
  .metadata
  {
    background-color: #cdf;
  }
  .score_td
  {
    width: 150px;
    border: 1px grey;
    word-break: break-all;
    word-wrap: break-word;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    padding: 0px 0px 0px 0px;
  }
  .score_solved
  {
    background-color: #60e760;
  }
  .score_firstblood
  {
    background-color: #1daa1d;
  }
  .submit
  {
    height: inherit;
    vertical-align: center;
  }
  .submit_td
  {
    width: 60px;
  }
  .score_num_td
  {
    width: 80px;
  }
  .cnt_td
  {
    width: 60px;
  }
  .rank_td
  {
    width: 40px;
  }
</style>
