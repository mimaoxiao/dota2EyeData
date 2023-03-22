<template>
  <div class="container">
    <div class="row">
      <div>steamid</div>
      <el-input class="form" v-model="id" />
    </div>
    <div class="row">
      <div>token</div>
      <el-input class="form" v-model="token" />
    </div>
    <div class="row">
      <div>时间范围</div>
          <el-date-picker
          class="form"
      v-model="time"
      type="daterange"
      range-separator="至"
      start-placeholder="开始日期"
      :default-time="['00:00:00', '23:59:59']"
      end-placeholder="结束日期">
    </el-date-picker>
    </div>
    <el-button class="button" @click="search" :disabled="!id || !token || !time.length" type="primary">开始查询</el-button>
    <div ref="log" class="log">
      <div v-for="(item, index) in log" :key="index">{{ item }}</div>
    </div>
    <el-table class="table" :data="result">
      <el-table-column label="比赛id" prop="id"></el-table-column>
      <el-table-column label="比赛时间">
        <template slot-scope="scope">
          {{ moment.unix(scope.row.endDateTime).format('YYYY-MM-DD HH:mm') }}
        </template>
      </el-table-column>
      <el-table-column label="真眼使用" prop="sentryUse"></el-table-column>
      <el-table-column label="成功反眼" prop="observerSuccess"></el-table-column>
      <el-table-column label="反眼成功率">
        <template slot-scope="scope">
          {{ (Number(scope.row.observerBreak) * 100).toFixed(3) }}%
        </template>
      </el-table-column>
      <el-table-column label="假眼使用" prop="observerUse"></el-table-column>
      <el-table-column label="假眼被反" prop="observerDie"></el-table-column>
      <el-table-column label="假眼存活率">
        <template slot-scope="scope">
          {{ (Number(scope.row.observerPower) * 100).toFixed(3) }}%
        </template>
      </el-table-column>
    </el-table>
    <div class="row">
      <div class="result">
        <div>平均反眼成功率</div>
        <div>{{ (avgCatch * 100).toFixed(3) }}%</div>
      </div>
      <div class="result">
      <div>平均假眼存活率</div>
      <div>{{ (avgAlive * 100).toFixed(3) }}%</div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import _ from 'lodash';
import getData from './util/main';

export default {
  name: 'App',
  data() {
    return {
      id: '',
      token: '',
      time: '',
      log: [],
      result: [],
      avgCatch: '',
      avgAlive: '',
      moment,
    }
  },
  mounted() {},
  methods: {
    search() {
      getData({
        id: this.id,
        token: this.token,
        start: Math.floor(this.time[0] / 1000),
        end: Math.floor(this.time[1] / 1000),
      }, this.insertLog).then((res) => {
        this.result = res.result;
        this.avgCatch = res.avgCatch;
        this.avgAlive = res.avgAlive;
      });
    },
    scrollLog: _.debounce(function() {
      this.$refs.log.scrollTop = this.$refs.log.scrollHeight;
    }, 100),
    insertLog(...i) {
      this.log.push(i.join(' '));
      this.scrollLog();
    }
  }
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: stretch;
  padding: 24px;
}
.row {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}
.form {
  flex-grow: 1;
  margin-left: 16px;
}
.button {
  text-align: center;
}
.log {
  margin: 16px;
  word-break: break-all;
  max-height: 400px;
  overflow-y: auto;
}
.table {
  height: 600px;
  overflow-y: auto;
  margin-bottom: 24px;
}
.result {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-weight: 700;
  font-size: 24px;
}
</style>
