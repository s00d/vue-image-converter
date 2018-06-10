<template>
  <div class="imgWrapper" ref="imgWrapper" :style="styleObjectWrapper" @mouseover="onMouseOver">
      <div :style="styleObjectImg" @mousedown="onMouseDown" @mouseup="onMouseUp" @mouseout="onMouseOut" @mouseover="onMouseOver">
    </div>
    <span v-show="onMouseOverFlag" :style="styleObjectHandle" @mouseover="onMouseOver" @mouseout="onMouseOut">
        <i class="blue fas fa-redo" @click.prevent.stop="rotateLeft"></i>
        <i class="blue fas fa-undo" @click.prevent.stop="rotateRight"></i>
    </span>
  </div>
</template>

<script>
export default {
  name: "ImageView",
  props: {
    imgUrl: {
      type: String,
      default: ""
    },
    invert: {
      type: Boolean,
      default: false
    },
    range: {
      type: Number,
      default: 0
    },
    width: {
      type: [Number, Boolean],
      default: 0
    },
    height: {
      type: [Number, Boolean],
      default: 0
    },
    quality: {
      type: Number,
      default: 100
    },
    type: {
      type: String,
      default: "image/png"
    },
    preview: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      computedHeight: "",
      computedWidth: "",
      imgWidth: 0,
      imgHeight: 0,
      onMouseDownFlag: false,
      onMouseOverFlag: false,
      degrees: 0,
      styleObjectWrapper: {
        overflow: "hidden",
        position: "relative",
        marginBottom: "10px",
        height: "500px"
      },
      styleObjectImg: {
        backgroundImage: "",
        backgroundRepeat: "no-repeat",
        backgroundSize: "0px 0px",
        backgroundPosition: "center",
        width: "100%",
        height: "100%",
        transform: "rotate(0deg)",
        transformOrigin: "center",
        position: "absolute"
      },
      styleObjectHandle: {
        textAlign: "center",
        position: "absolute",
        userSelect: "none",
        right: "10px",
        bottom: "10px"
      }
    };
  },
  watch: {
    imgUrl() {
      this.$nextTick(() => {
        this.styleObjectImg.backgroundImage = "url(" + this.imgUrl + ")";
        this.init().then(() => {
          this.updateStyle();
        });
      });
    },
    range() {
      this.styleObjectImg.filter =
        "grayscale(" + this.range + "%) invert(" + (this.invert ? 1 : 0) + ")";
      this.styleObjectImg["-webkit-filter"] =
        "grayscale(" + this.range + "%) invert(" + (this.invert ? 1 : 0) + ")";
    },
    invert() {
      this.styleObjectImg.filter =
        "grayscale(" + this.range + "%) invert(" + (this.invert ? 1 : 0) + ")";
      this.styleObjectImg[" -webkit-filter"] =
        "grayscale(" + this.range + "%) invert(" + (this.invert ? 1 : 0) + ")";
    },
    width() {
      this.updateStyle()
    },
    height() {
      this.updateStyle()
    },
    type() {
      this.updateSize()
    },
    quality() {
      this.updateSize()
    }
  },
  created() {
    this.$events.$on('SAVE_IMAGE', () => {
      let img = new Image();
      img.onload = () => {
        let canvas = document.createElement("canvas");
        canvas.style.filter = "grayscale(" + this.range + "%) invert(" + (this.invert ? 1 : 0) + ")";;
        let ctx = canvas.getContext("2d");
        canvas.width = this.width;
        canvas.height = this.height;
        let image = ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        var data = imageData.data;

        if(this.invert) {
          for (var i = 0; i < data.length; i += 4) {
            data[i]     = 255 - data[i];     // red
            data[i + 1] = 255 - data[i + 1]; // green
            data[i + 2] = 255 - data[i + 2]; // blue
          }
          ctx.putImageData(imageData, 0, 0);
        }
        if(this.range > 0) {
          for (var i = 0; i < data.length; i += 4) {
            var avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            data[i]     = avg; // red
            data[i + 1] = avg; // green
            data[i + 2] = avg; // blue
          }
          ctx.putImageData(imageData, 0, 0);
        }
        if(this.degrees > 0) {
          var rad = 2 * Math.PI - degrees * Math.PI / 180;    
          // ctx.rotate(rad);
        }

        let link = document.createElement("a");
        link.setAttribute("href", canvas.toDataURL(this.type, parseInt(parseInt(this.quality)/100)));
        link.setAttribute("download", 'image_load.' + this.type.split("/")[1]);
        // link.setAttribute("target", '_blank');
        link.click();
        data = imageData = image = ctx = canvas = link = null;
      };

      img.src = this.imgUrl;
      
    });
  },
  mounted() {
    this.init().then(() => {
      this.updateStyle();
    });
  },
  updated() {
    if (parseInt(this.computedWidth) === 0) {
      this.init().then(() => {
        this.updateStyle();
      });
    }
  },
  methods: {
    init() {
      return new Promise((resolve, reject) => {
        var img = new Image();
        img.src = this.imgUrl;
        img.onload = () => {
          this.imgWidth = img.width;
          this.imgHeight = img.height;
          this.get = true;
          resolve();
        };
        img.onerror = () => {
          this.get = false;
          reject();
        };
      });
    },
    updateStyle() {
      this.$nextTick(() => {
        this.computedHeight = this.$refs.imgWrapper.offsetHeight;
        this.computedWidth = this.$refs.imgWrapper.offsetWidth;
        if (this.computedHeight / this.computedWidth < this.height / this.width) {
          this.imgWidth = this.width * this.computedHeight / this.height;
          this.imgHeight = this.computedHeight;
        } else {
          this.imgHeight = this.height * this.computedWidth / this.width;
          this.imgWidth = this.computedWidth;
        }
        this.styleObjectImg.backgroundImage = "url(" + this.imgUrl + ")";
        this.styleObjectImg.transform = "rotate(0deg)";
        this.styleObjectImg.width = this.computedWidth + "px";
        this.styleObjectImg.height = this.computedHeight + "px";
        this.styleObjectImg.left = "0px";
        this.styleObjectImg.top = "0px";
        this.styleObjectImg.backgroundSize =this.imgWidth + "px " + this.imgHeight + "px";
        this.styleObjectImg.backgroundPosition = (this.computedWidth - this.imgWidth) / 2 + "px " + (this.computedHeight - this.imgHeight) / 2 + "px";
      });
    },
    updateSize() {
      if(!this.preview) return;
      let img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.style.filter = "grayscale(" + this.range + "%) invert(" + (this.invert ? 1 : 0) + ")";;
        const ctx = canvas.getContext("2d");
        canvas.width = this.width;
        canvas.height = this.height;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        this.imgUrl = canvas.toDataURL(this.type, parseInt(parseInt(this.quality)/100));
      };

      img.src = this.imgUrl;
    },
    onMouseDown() {
      this.onMouseDownFlag = true;
    },
    onMouseUp() {
      this.onMouseDownFlag = false;
    },
    onMouseOver() {
      this.onMouseOverFlag = true;
    },
    onMouseOut() {
      this.onMouseOverFlag = false;
      this.onMouseDownFlag = false;
    },
    rotate(degrees = -90) {
      var r =
        (parseInt(this.styleObjectImg.transform.split("(")[1]) + degrees) % 360;
      if (r < 0) {
        r += 360;
      }
      this.degrees += degrees;
      this.styleObjectImg.transform = "rotate(" + r + "deg)";
      if (r % 180 == 90) {
        this.styleObjectImg.width = this.computedHeight + "px";
        this.styleObjectImg.height = this.computedWidth + "px";
        this.styleObjectImg.left =
          Math.abs(
            parseInt(this.computedHeight) - parseInt(this.computedWidth)
          ) /
            2 +
          "px";
        this.styleObjectImg.top =
          (this.computedHeight - this.computedWidth) / 2 + "px";
        if (
          this.computedHeight / this.computedWidth <
          this.imgWidth / this.imgHeight
        ) {
          this.imgHeight = this.imgHeight * this.computedHeight / this.imgWidth;
          this.imgWidth = this.computedHeight;
        } else {
          this.imgWidth = this.imgWidth * this.computedWidth / this.imgHeight;
          this.imgHeight = this.computedWidth;
        }
        this.styleObjectImg.backgroundSize =
          this.imgWidth + "px " + this.imgHeight + "px";
        this.styleObjectImg.backgroundPosition =
          (this.computedHeight - this.imgWidth) / 2 +
          "px " +
          (this.computedWidth - this.imgHeight) / 2 +
          "px";
      } else {
        this.styleObjectImg.width = this.computedWidth + "px";
        this.styleObjectImg.height = this.computedHeight + "px";
        this.styleObjectImg.left = "0px";
        this.styleObjectImg.top = "0px";
        if (
          this.computedHeight / this.computedWidth <
          this.imgHeight / this.imgWidth
        ) {
          this.imgWidth = this.imgWidth * this.computedHeight / this.imgHeight;
          this.imgHeight = this.computedHeight;
        } else {
          this.imgHeight = this.imgHeight * this.computedWidth / this.imgWidth;
          this.imgWidth = this.computedWidth;
        }
        this.styleObjectImg.backgroundSize =
          this.imgWidth + "px " + this.imgHeight + "px";
        this.styleObjectImg.backgroundPosition =
          (this.computedWidth - this.imgWidth) / 2 +
          "px " +
          (this.computedHeight - this.imgHeight) / 2 +
          "px";
      }
    },
    rotateLeft() {
      this.rotate(-90);
    },
    rotateRight() {
      this.rotate(90);
    },
    onDragStart() {
      return false;
    }
  }
};
</script>
<style scoped>
.imgWrapper {
  background-image: url(../assets/background.png);
}


.blue {
    color: #6495ed;
    margin: 3px 3px;
}

.blue:hover {
    color: #00bfff;
}

/* .range {
    position: absolute;
    right: 10px;
    top: 10px;
    width: 200px !important;
}
.invert {
    position: absolute;
    right: 220px;
    top: 8px;

    color: white;
}
.filters {
    display: none;
} */
</style>