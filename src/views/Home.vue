<template>
  <div class="container-fluid">
    <div class="row">
      <main role="main" class="col-md-9 ml-sm-auto col-lg-10 pt-3 px-4" @dragover.prevent @drop="onFileChange">
        <ImageView 
          :imgUrl="image" 
          :invert="invert" 
          :range="parseInt(range)" 
          :width="parseInt(size.width)" 
          :height="parseInt(size.height)" 
          :quality="parseInt(quality)"
          :type="types[selectType]"
          :preview="preview"
        />
      </main>
      <nav class="col-md-2 d-none d-md-block bg-light sidebar">
        <div class="sidebar-sticky">
          <!-- <ul class="nav flex-column">
            <li class="nav-item">
              <input type="range" class="range" v-model="range">
            </li>
          </ul> -->

          <h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
            <div class="form-group">
              <label for="formControlRange">Color:</label>
              <input type="range" class="form-control-range" v-model="range">
            </div>
          </h6>

          <h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
            <div class="form-group" style="padding-left: 20px;">
              <input class="form-check-input" type="checkbox" v-model="invert">
              <label class="form-check-label">
                Invert
              </label>
            </div>
          </h6>

          <h6 class="sidebar-heading justify-content-between px-3 mt-4 mb-1 text-muted">
            <div class="col-12">
              <div class="form-group">
                <label>Width</label>
                <input type="number" class="form-control" v-model="size.width">
              </div>
            </div>
            <div class="col-12">
              <div class="form-group">
                <label>Height</label>
                <input type="number" class="form-control" v-model="size.height" :disabled="size.auto">
              </div>
            </div>
            <hr>
            <div class="col-12 form-group">
              <input class="form-check-input" type="checkbox" v-model="size.auto">
              <label class="form-check-label" for="defaultCheck1">Auto</label>
            </div>
          </h6>

          <h6 class="sidebar-heading justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
            <div class="form-group">
              <label>Example select</label>
              <select class="form-control" v-model="selectType">
                <option v-for="(_, type) in types" :key="type" v-text="type"></option>
              </select>
            </div>
            <div class="form-group">
              <label for="formControlRange">Quality:</label>
              <input type="range" class="form-control-range" v-model="quality">
            </div>
          </h6>

          <!-- <h6 class="sidebar-heading justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
            <div class="form-group">
              <input class="form-check-input" type="checkbox" v-model="preview">
              <label class="form-check-label">Preview</label>
            </div>
          </h6> -->

          <h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
            <button type="submit" class="btn btn-primary" @click="$events.$emit('SAVE_IMAGE');">Save</button>
          </h6>

        </div>
      </nav>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import ImageView from '@/components/ImageView.vue'

export default {
  name: 'home',
  data() {
    return {
      image: '',
      range: 0,
      invert: false,
      size: {
        mWidth:0,
        mHeight:0,
        width: 0,
        height: 0,
        auto: true
      },
      types: {png: 'image/png', bmp: 'image/bmp', gif: 'image/gif', jpeg: 'image/jpeg', tiff: 'image/tiff'},
      selectType: 'png',
      quality: 100,
      preview: false
    }
  },
  watch: {
    'size.width'(val) {
      if(!this.size.auto) return;
      if(val === this.size.mWidth || this.size.mWidth === 0) return;
      let percent = 100 /  parseInt(this.size.mWidth) * parseInt(val);
      if(isNaN(percent)) return;
      
      this.size.height = parseInt(this.size.mHeight / 100 * percent);
    },
    // 'size.height'(val, oldVal) {
    //   if(val === oldVal || oldVal === 0) return;
    //   let percent = 100 / parseInt(val) * parseInt(oldVal);
    //   if(percent === NaN) return;
    //   this.size.width = parseInt(this.size.width / 100 * percent);
    // },
  },
  methods: {
    onFileChange(e) {
      e.stopPropagation();
      e.preventDefault();

      let files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;

      let img = new Image();
      img.onload = () => {
        this.size.width = this.size.mWidth = img.width
        this.size.height = this.size.mHeight = img.height
        this.image = URL.createObjectURL(files[0]);
      };
      img.src = URL.createObjectURL(files[0]);
      // this.image = URL.createObjectURL(files[0]);
    }
  },
  components: {
    ImageView
  }
}
</script>
