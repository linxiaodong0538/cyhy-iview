<template>
  <div>
    <div class="limit-width">
      <Form
        ref="formValidate"
        :model="formValidate"
        :rules="ruleValidate"
        :label-width="100">
        <Form-item
          label="车牌号"
          prop="num">
          <Input
            v-model="formValidate.num"
            placeholder="请输入车牌号" />
        </Form-item>
        <Form-item
          label="车主"
          prop="owner">
          <Input
            v-model="formValidate.owner"
            placeholder="请输入车主" />
        </Form-item>
        <Form-item
          label="图片"
          prop="picture">
          <Uploader
            ref="uploader"
            :has-default-file="!!id"
            v-model="formValidate.picture"
            @change="handleUploaderChange" />
          （尺寸：1150x647）
        </Form-item>
        <Form-item
          label="年检时间"
          prop="mot_time">
          <DatePicker
            :value="formValidate.mot_time"
            type="date"
            placeholder="请选择年检时间"
            style="width: 220px"
            @on-change="value => { handleDatePickerChange('mot_time', value) }" />
        </Form-item>
        <Form-item
          label="保险到期时间"
          prop="insurance_time">
          <DatePicker
            :value="formValidate.insurance_time"
            type="date"
            placeholder="请选择保险到期时间"
            style="width: 220px"
            @on-change="value => { handleDatePickerChange('insurance_time', value) }" />
        </Form-item>
        <Form-item
          label="购买日期"
          prop="buy_time">
          <DatePicker
            :value="formValidate.buy_time"
            type="date"
            placeholder="请选择购买日期"
            style="width: 220px"
            @on-change="value => { handleDatePickerChange('buy_time', value) }" />
        </Form-item>
        <Form-item
          label="备注"
          prop="remark">
          <Input
            type="textarea"
            :rows="3"
            v-model="formValidate.remark"
            placeholder="请输入备注" />
        </Form-item>
        <Form-item class="save">
          <Button
            type="primary"
            @click="handleSave"
            class="margin-right-sm">
            保存
          </Button>
          <Button
            type="ghost"
            @click="$router.push(`${routePrefix}/cars/index`)">
            返回
          </Button>
        </Form-item>
      </Form>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import consts from '@/utils/consts'
  import helpers from '@/utils/helpers/base'
  import Uploader from '@/components/Uploader'

  export default {
    async created () {
      this.routePrefix = helpers.getRoutePrefix(this.$route.params)

      this.alias = this.$route.params.alias
      this.id = this.$route.params.id

      this.id && this.getDetails(this.id)
    },
    components: {
      Uploader
    },
    data () {
      return {
        consts,
        routePrefix: '',
        alias: '',
        id: '',
        formValidate: {},
        ruleValidate: {
          num: [
            {
              required: true,
              message: '车牌号不能为空'
            },
            {
              max: 10,
              message: '车牌号不能多于 10 个字'
            }
          ],
          picture: [
            {
              required: true,
              message: '请上传图片'
            }
          ]
        }
      }
    },
    methods: {
      handleDatePickerChange (key, value) {
        this.formValidate[key] = value
      },
      getDetails (id) {
        return this.$store.dispatch('getCar', { id })
      },
      handleUploaderChange (file) {
        this.formValidate.picture = file ? file.id : ''
      },
      handleSave () {
        this.$refs.formValidate.validate(async valid => {
          if (valid) {
            const { id, formValidate, alias } = this
            const action = id ? 'putCar' : 'postCar'

            await this.$store.dispatch(action, {
              id,
              body: { ...formValidate, alias }
            })

            this.$Message.success((this.id ? '编辑' : '新增') + '成功！')
            !id && this.resetFields()
          }
        })
      },
      resetFields () {
        this.$refs.formValidate.resetFields()
        this.$refs.uploader.remove()
      }
    },
    computed: mapState([
      'cars'
    ]),
    watch: {
      'cars.car': {
        handler (newVal) {
          const { id, ...others } = newVal
          this.$set(this, 'formValidate', others)
        }
      }
    }
  }
</script>
