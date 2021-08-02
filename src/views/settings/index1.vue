<template>
  <div class="main_content">
    <el-tabs type="border-card">
      <el-tab-pane v-for="item in setting_list" :key="item.id" :label="item.label" style="height: 800px">
        <split-pane split="vertical">
          <template slot="paneL">
            <el-card class="box-card">
              <template #header>
                <div class="card-header">
                  <div />
                  <el-button type="primary">
                    <i class="el-icon-plus" />
                    新增
                  </el-button>
                </div>
              </template>
              <el-table
                :data="tableData"
                style="width: 100%"
              >
                <el-table-column
                  label="日期"
                  width="180"
                >
                  <template #default="scope">
                    <i class="el-icon-time" />
                    <span style="margin-left: 10px">{{ scope.row.date }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="姓名"
                  width="180"
                >
                  <template #default="scope">
                    <el-popover effect="light" trigger="hover" placement="top">
                      <template #default>
                        <p>姓名: {{ scope.row.name }}</p>
                        <p>住址: {{ scope.row.address }}</p>
                      </template>
                      <template #reference>
                        <div class="name-wrapper">
                          <el-tag size="medium">{{ scope.row.name }}</el-tag>
                        </div>
                      </template>
                    </el-popover>
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                  <template #default="scope">
                    <el-button
                      size="mini"
                      @click="handleEdit(scope.$index, scope.row)"
                    >编辑</el-button>
                    <el-button
                      size="mini"
                      type="danger"
                      @click="handleDelete(scope.$index, scope.row)"
                    >删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </template>
          <template slot="paneR">
            <tableCard :tabledata="tableData" />
          </template>
        </split-pane>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import splitPane from 'vue-splitpane'
import tableCard from './tableCard'
export default {
  components: { splitPane, tableCard },
  data: function() {
    return {
      setting_list: [{ 'id': 0, 'label': '用户管理' }, { 'id': 1, 'label': '配置管理' }],
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }]
    }
  },
  methods: {
    handleEdit(index, row) {
      console.log(index1, row)
    },
    handleDelete(index, row) {
      console.log(index1, row)
    }
  }
}
</script>

<style scoped>
  .main_content{
    margin-top: 2%;
    width: 96%;
    margin-left: 2%;
    height: 98%;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .box-card {
    width: 100%;
  }
</style>
