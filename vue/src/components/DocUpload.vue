<template>
  <el-container v-loading="loading" class="post-article">
    <el-header class="header">
      <el-select v-model="article.cid" placeholder="Select type" style="width: 150px;">
        <el-option
          v-for="item in categories"
          :key="item.id"
          :label="item.cateName"
          :value="item.id">
        </el-option>
      </el-select>
      <el-input v-model="article.title" placeholder="Doc name..." style="width: 400px;margin-left: 10px"></el-input>
    </el-header>
    <el-main class="main">
          <div>
          <el-upload
            class="upload-demo"
            ref="uploadFile"
            :action="actionUrl"
            :before-upload="beforeFileUpload"
            :auto-upload="false"
            :on-success='onSuccess'
            :on-error="onError">
            <el-button size="small" type="primary">Select</el-button>
          </el-upload>
          </div>
          <el-button type="primary" @click="submitUpload">Upload</el-button>

    </el-main>
  </el-container>
</template>
<script>
  import {postRequest} from '../utils/api'
  import {putRequest} from '../utils/api'
  import {deleteRequest} from '../utils/api'
  import {getRequest} from '../utils/api'
  import {uploadFileRequest} from '../utils/api'
  // Local Registration
  import {mavonEditor} from 'mavon-editor'
  // 可以通过 mavonEditor.markdownIt 获取解析器markdown-it对象
  import 'mavon-editor/dist/css/index.css'
  import {isNotNullORBlank} from '../utils/utils'

  export default {
    mounted: function () {
      this.getCategories();
      var from = this.$route.query.from;
      this.from = from;
      var _this = this;
      if (from != null && from != '' && from != undefined) {
        var id = this.$route.query.id;
        this.id = id;
        this.loading = true;
        getRequest("/article/" + id).then(resp=> {
          _this.loading = false;
          if (resp.status == 200) {
            _this.article = resp.data;
            var tags = resp.data.tags;
            _this.article.dynamicTags = []
            for (var i = 0; i < tags.length; i++) {
              _this.article.dynamicTags.push(tags[i].tagName)
            }
          } else {
            _this.$message({type: 'error', message: 'Failed to load!'})
          }
        }, resp=> {
          _this.loading = false;
          _this.$message({type: 'error', message: 'Failed to load!'})
        })
      }
    },
    methods: {
      cancelEdit(){
        this.$router.go(-1)
      },
      saveBlog(state){
        if (!(isNotNullORBlank(this.article.title, this.article.mdContent, this.article.cid))) {
          this.$message({type: 'error', message: 'Data cannot be null!'});
          return;
        }
        var _this = this;
        _this.loading = true;
        postRequest("/article/", {
          id: _this.article.id,
          title: _this.article.title,
          mdContent: _this.article.mdContent,
          htmlContent: _this.$refs.md.d_render,
          cid: _this.article.cid,
          state: state,
          dynamicTags: _this.article.dynamicTags
        }).then(resp=> {
          _this.loading = false;
          if (resp.status == 200 && resp.data.status == 'success') {
            _this.article.id = resp.data.msg;
            _this.$message({type: 'success', message: state == 0 ? '保存成功!' : '发布成功!'});
//            if (_this.from != undefined) {
            window.bus.$emit('blogTableReload')
//            }
            if (state == 1) {
              _this.$router.replace({path: '/articleList'});
            }
          }
        }, resp=> {
          _this.loading = false;
          _this.$message({type: 'error', message: state == 0 ? '保存草稿失败!' : '博客发布失败!'});
        })
      },

      imgAdd(pos, $file){
        var _this = this;
        // 第一步.将图片上传到服务器.
        var formdata = new FormData();
        formdata.append('image', $file);
        uploadFileRequest("/article/uploadimg", formdata).then(resp=> {
          var json = resp.data;
          if (json.status == 'success') {
//            _this.$refs.md.$imgUpdateByUrl(pos, json.msg)
            _this.$refs.md.$imglst2Url([[pos, json.msg]])
          } else {
            _this.$message({type: json.status, message: json.msg});
          }
        });
      },
      imgDel(pos){

      },
      getCategories(){
        let _this = this;
        getRequest("/admin/category/all").then(resp=> {
          _this.categories = resp.data;
        });
      },
      handleClose(tag) {
        this.article.dynamicTags.splice(this.article.dynamicTags.indexOf(tag), 1);
      },
      showInput() {
        this.tagInputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
      handleInputConfirm() {
        let tagValue = this.tagValue;
        if (tagValue) {
          this.article.dynamicTags.push(tagValue);
        }
        this.tagInputVisible = false;
        this.tagValue = '';
      },
      //确认上传
      submitUpload() {

        this.$refs.uploadFile.submit();
      },
      //文件上传之前
      beforeFileUpload(file){

        const File = file.name.replace(/.+\./,"");
        if (['xlsx','xls','pdf'].indexOf(File.toLowerCase())===-1 ) {

          this.$message.error('只支持上传xlsx、xls文件格式!');
          this.$refs.uploadFile.clearFiles();
          return false;
        }
      },
      //文件上传成功
      onSuccess(){

        this.$message.success("文件上传成功");
      },
      //上传失败
      onError(){

        this.$refs.upload.clearFiles();
        this.$message.error("文件上传失败")
      }
    },
    data() {
      return {
        actionUrl: '/article/import',
        categories: [],
        tagInputVisible: false,
        tagValue: '',
        loading: false,
        from: '',
        article: {
          id: '-1',
          dynamicTags: [],
          title: '',
          mdContent: '',
          cid: ''
        }
      }
    }
  }
</script>
<style>
  .post-article > .main > #editor {
    width: 100%;
    height: 450px;
    text-align: left;
  }

  .post-article > .header {
    background-color: #ececec;
    margin-top: 10px;
    padding-left: 5px;
    display: flex;
    justify-content: flex-start;
  }

  .post-article > .main {
    /*justify-content: flex-start;*/
    display: flex;
    flex-direction: column;
    padding-left: 5px;
    background-color: #ececec;
    padding-top: 0px;
  }

  .post-article > .header > .el-tag + .el-tag {
    margin-left: 10px;
  }

  .post-article > .header > .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }

  .post-article > .header > .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }

  .post-article {
  }
</style>
