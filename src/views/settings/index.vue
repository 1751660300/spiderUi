<template>
  <div class="main_content">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <el-select v-model="form.sid" filterable placeholder="请选择" @change="sidChage">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
          <div>
            <el-button type="primary" @click="dialogFormVisible = true">
              <i class="el-icon-plus" />新增配置文件
            </el-button>
            <el-button type="primary" @click="setSettingItem">
              <i class="el-icon-plus" />新增配置项
            </el-button>
          </div>
        </div>
      </template>
      <el-input
        v-model="filterText"
        placeholder="输入关键字进行过滤"
      />
      <div class="custom-tree-container">
        <div class="block">
          <el-tree
            ref="tree"
            class="filter-tree"
            :data="nodeData"
            :props="defaultProps"
            :default-expanded-keys="default_key"
            node-key="id"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            :load="loadNode"
            lazy
            show-checkbox
          >
            <template #default="{ node, data }">
              <span class="custom-tree-node">
                <span>{{ node.label }}</span>
                <span style="color: #2ac06d;">{{ data.value }}</span>
                <span style="color: #8c939d; width: 50%; overflow: hidden; text-overflow: ellipsis;white-space: nowrap;">{{ data.desc }}</span>
                <span>
                  <i class="el-icon-s-operation" style="color: deepskyblue; margin-right: 5px" @click="append(data, 0)" />
                  <i class="el-icon-plus" style="color: greenyellow;margin-right: 5px" @click="append(data, 1)" />
                  <i class="el-icon-minus" style="color: red;margin-right: 5px" @click="remove(node, data)" />
                </span>
              </span>
            </template>
          </el-tree>
        </div>
      </div>
    </el-card>
    <!--新增配置文件-->
    <el-dialog title="新增配置文件" :visible.sync="dialogFormVisible">
      <el-form :model="fileForm">
        <el-form-item label="文件名称" :label-width="formLabelWidth">
          <el-input v-model="fileForm.name" autocomplete="off" />
        </el-form-item>
        <el-form-item type="textarea" label="描述" :label-width="formLabelWidth">
          <el-input v-model="fileForm.desc" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="mergeSetting">确 定</el-button>
      </div>
    </el-dialog>

    <!--新增顶级配置项 -->
    <el-dialog title="新增配置项" :visible.sync="dialogFormVisible1">
      <el-form :model="form">
        <el-form-item v-if="form.pname" label="父配置项" :label-width="formLabelWidth">
          <el-input v-model="form.pname" autocomplete="off" :disabled="true" />
        </el-form-item>
        <el-form-item label="配置项名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="值" :label-width="formLabelWidth">
          <el-input v-model="form.value" autocomplete="off" />
        </el-form-item>
        <el-form-item type="textarea" label="描述" :label-width="formLabelWidth">
          <el-input v-model="form.desc" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible1 = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { settingDetails, mergeSettingDetail, delSettingDetail } from '@/api/setting'
import { settings, editSetting } from '@/api/setting'
import { Message } from 'element-ui'

export default {
  components: {},
  data: function() {
    return {
      setting_list: [{ 'id': 0, 'label': '用户管理' }, { 'id': 1, 'label': '配置管理' }],
      filterText: '',
      nodeData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      form: {
        name: '',
        desc: '',
        pname: '',
        pid: '',
        sid: '',
        value: ''
      },
      fileForm: {
        name: '',
        desc: ''
      },
      formLabelWidth: '120px',
      dialogFormVisible: false,
      dialogFormVisible1: false,
      default_key: [],
      options: []
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    this.getSettings()
  },
  methods: {
    setSettingItem() {
      this.append({}, 1)
      this.form.pid = 0
    },
    sidChage(val) {
      this.default_key = []
      this.form.sid = val
      this.getSettingDetails()
    },
    async getSettings() {
      await settings({}).then(res => {
        this.options = res.content
        if (this.options.length > 0) {
          this.form.sid = this.options[0].id
        }
      })
    },
    mergeSetting() {
      editSetting(this.fileForm).then(res => {
        if (res.code === 20000) {
          this.dialogFormVisible = false
          this.getSettings()
          Message({ message: res.msg, type: 'success' })
        } else {
          Message({ message: res.msg, type: 'error' })
        }
      })
    },
    getSettingDetails() {
      if (this.form.sid === '') {
        setTimeout(this.getSettingDetails, 100)
        return
      }
      const params = {
        pid: 0,
        sid: this.form.sid
      }
      settingDetails(params).then(res => {
        res.content.forEach(s => {
          s.label = s.name
        })
        this.nodeData = res.content
      })
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    append(data, flag) {
      this.dialogFormVisible1 = true
      this.form.pname = flag === 0 ? '' : data.name
      this.form.pid = data.id
      this.form.sid = data.sid
      this.form.id = flag === 0 ? data.id : ''
      this.form.name = flag === 0 ? data.name : ''
      this.form.desc = flag === 0 ? data.desc : ''
      this.form.value = flag === 0 ? data.value : ''
    },
    submit() {
      mergeSettingDetail(this.form).then(res => {
        if (res.code === 20000) {
          this.getSettingDetails()
          Message({ message: res.msg, type: 'success' })
        } else {
          Message({ message: res.msg, type: 'error' })
        }
      })
      this.dialogFormVisible1 = false
    },
    remove(node, data) {
      const params = { ids: [data.id] }
      delSettingDetail(params).then(res => {
        if (res.code === 20000) {
          this.getSettingDetails()
          Message({ message: res.msg, type: 'success' })
        } else {
          Message({ message: res.msg, type: 'error' })
        }
      })
    },

    renderContent(h, { node, data, store }) {
      return h('span', {
        class: 'custom-tree-node'
      }, h('span', null, node.label), h('span', null, h('a', {
        onClick: () => this.append(data)
      }, 'Append '), h('a', {
        onClick: () => this.remove(node, data)
      }, 'Delete')))
    },
    loadNode(node, resolve) {
      if (node.level === 0) {
        // 获取level == 1 的数据
        this.getSettingDetails()
        return resolve(this.nodeData)
      }
      if (node.level > 1) {
        // 不是顶层node时调用，可以请求level=2的数据
        return resolve([])
      }

      setTimeout(() => {
        this.default_key.push(node.data.id)
        settingDetails({ pid: node.data.id, sid: node.data.sid }).then(res => {
          res.content.forEach(s => {
            s.label = s.name
          })
          resolve(res.content)
        })
      }, 500)
    }
  }
}
</script>

<style scoped>
.main_content {
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

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 16px;
  padding-right: 8px;
  margin-top: 3px;
}

.box-card {
  width: 100%;
}
</style>
