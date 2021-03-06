<template>
  <div>
    <div class="limit-width">
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
        <Form-item label="标题" prop="title">
          <Input v-model="formValidate.title" placeholder="请输入标题"></Input>
        </Form-item>
        <Form-item label="分类" prop="category_id">
          <Categories :alias="alias" v-model="formValidate.category_id" @on-change="handleCategoryChange"></Categories>
        </Form-item>
        <Form-item label="图片 1" prop="picture1">
          <Uploader
            ref="uploader1"
            :has-default-file="!!id"
            v-model="formValidate.picture1"
            @change="handleUploader1Change"
          />
          （尺寸：1150x647）
        </Form-item>
        <Form-item label="图片 2" prop="picture2">
          <Uploader
            ref="uploader2"
            :has-default-file="!!id"
            v-model="formValidate.picture2"
            @change="handleUploader2Change"
          />
          （尺寸：1150x647）
        </Form-item>
        <Form-item label="价格" prop="price">
          <InputNumber :min="0" :max="100000" v-model="formValidate.price"></InputNumber>
          元
        </Form-item>
        <Form-item label="库存" prop="stock">
          <InputNumber :min="0" :max="100000" v-model="formValidate.stock"></InputNumber>
          件
        </Form-item>
        <Form-item label="库存告警临界值" prop="stock_threshold">
          <InputNumber :min="0" :max="100000" v-model="formValidate.stock_threshold"></InputNumber>
          件
        </Form-item>
        <Form-item label="采购地点" prop="purchase_address">
          <Input v-model="formValidate.purchase_address" placeholder="请输入采购地点"></Input>
        </Form-item>
        <Form-item label="商家电话" prop="seller_telephone">
          <Input v-model="formValidate.seller_telephone" placeholder="请输入商家电话"></Input>
        </Form-item>
        <Form-item label="厂家信息" prop="manufacturer_info">
          <Input type="textarea" :rows="3" v-model="formValidate.manufacturer_info" placeholder="请输入厂家信息"></Input>
        </Form-item>
        <Form-item label="详情" prop="content">
          <Editor ref="editor" v-model="formValidate.content" @change="handleEditorChange"></Editor>
          <Input v-model="formValidate.content" style="display: none;"></Input>
        </Form-item>
        <Form-item label="备注" prop="remark">
          <Input type="textarea" :rows="3" v-model="formValidate.remark" placeholder="请输入备注"></Input>
        </Form-item>
        <Form-item class="save">
          <Button type="primary" @click="handleSave" class="margin-right-sm">保存</Button>
          <Button type="ghost" @click="$router.push(`${routePrefix}/products/index`)">返回</Button>
        </Form-item>
      </Form>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import consts from '@/utils/consts'
  import helpers from '@/utils/helpers/base'
  import Editor from '@/components/Editor'
  import Uploader from '@/components/Uploader'
  import Categories from '@/components/Categories'
  const module = 'products'

  export default {
    name: 'form',
    async created () {
      this.routePrefix = helpers.getRoutePrefix(this.$route.params)
      this.alias = this.$route.params.alias
      this.id = this.$route.params.id

      await this.getCategoryItems()

      this.id && this.getDetails(this.id)
    },
    components: {
      Editor,
      Uploader,
      Categories
    },
    data () {
      return {
        consts,
        routePrefix: '',
        alias: '',
        id: '',
        formValidate: {
          title: '',
          category_id: 0,
          picture1: '',
          picture2: '',
          price: 0,
          stock: 0,
          purchase_address: '',
          seller_telephone: '',
          manufacturer_info: '',
          content: ''
        },
        ruleValidate: {
          title: [
            {
              required: true,
              message: '标题不能为空'
            },
            {
              max: 100,
              message: '标题不能多于 100 个字'
            }
          ],
          category_id: [
            {
              required: true,
              message: '请选择分类'
            }
          ],
          content: [
            {
              required: true,
              message: '详情不能为空'
            },
            {
              max: 10000,
              message: '详情长度过长'
            }
          ]
        }
      }
    },
    methods: {
      getDetails (id) {
        return this.$store.dispatch(`${module}/getDetail`, { id })
      },
      getCategoryItems () {
        return this.$store.dispatch('categories/getList', {
          query: {
            where: { alias: this.alias }
          }
        })
      },
      handleEditorChange (html) {
        this.formValidate.content = html
      },
      handleUploader1Change (file) {
        this.formValidate.picture1 = file ? file.id : ''
      },
      handleUploader2Change (file) {
        this.formValidate.picture2 = file ? file.id : ''
      },
      handleSave () {
        this.$refs.formValidate.validate(async valid => {
          if (valid) {
            const { id, formValidate, alias } = this
            const action = id ? 'put' : 'post'

            await this.$store.dispatch(`${module}/${action}`, {
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
        this.$refs.editor.html('')
        this.$refs.uploader1.remove()
        this.$refs.uploader2.remove()
      },
      handleCategoryChange (val) {
        this.formValidate.category_id = val
      }
    },
    computed: mapState({
      list: state => state[module].list,
      categories: state => state['categories'].list
    }),
    watch: {
      'list': {
        handler (newVal) {
          const { id, ...others } = newVal

          this.formValidate = others
          this.$refs.editor.html(others.content)
        }
      }
    }
  }
</script>
